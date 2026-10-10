// Run with: node scripts/upgrade-next.mjs
// Resolve, install and check the upgrade in an ignored staging directory first.
// No env files, credentials, live orders or deployments are created by this script.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const logs = path.join(root, '.local-logs');
const targets = {
  dependencies: {
    next: '^16.4.0', react: '~19.3.0', 'react-dom': '~19.3.0',
    '@react-three/fiber': '^9.8.1', '@react-three/drei': '^10.7.7',
  },
  devDependencies: {
    eslint: '^9.39.5', 'eslint-config-next': '^16.4.0',
    '@types/react': '^19.0.0', '@types/react-dom': '^19.0.0',
  },
};
const flatConfig = `import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextVitals,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
`;

function npm(args, cwd, env = process.env) {
  console.log(`\nRunning npm ${args.join(' ')}`);
  const result = spawnSync('npm', args, { cwd, env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`npm ${args.join(' ')} failed (exit ${result.status ?? result.signal})`);
}
const readJSON = filename => JSON.parse(fs.readFileSync(filename, 'utf8'));
const writeJSON = (filename, value) => fs.writeFileSync(filename, JSON.stringify(value, null, 2) + '\n');

// Fixture checks never inherit live provider/database/admin credentials.
function checkEnv(nodeEnv) {
  const env = { ...process.env, NODE_ENV: nodeEnv };
  for (const name of ['GROQ_API_KEY', 'AI_MODEL', 'DATABASE_URL', 'ADMIN_MENU_SYNC_TOKEN', 'DATABASE_SSL_CA_FILE', 'DATABASE_SSL_MODE']) delete env[name];
  return env;
}
function checks(directory, { backendTests = true } = {}) {
  npm(['ls', '--depth=0'], directory);
  npm(['run', 'lint'], directory, checkEnv('development'));
  npm(['run', 'typecheck'], directory, checkEnv('development'));
  if (backendTests) npm(['test', '--prefix', 'backend'], directory, checkEnv('test'));
  npm(['run', 'build'], directory, checkEnv('production'));
}

let stage;
let applied = false;
try {
  const [major, minor] = process.versions.node.split('.').map(Number);
  assert.ok(major > 22 || (major === 22 && minor >= 18), 'Use Node.js 22.18 or later for project checks');
  assert.ok(fs.existsSync(path.join(root, 'backend/node_modules/ai/package.json')),
    'Install backend dependencies first: npm ci --prefix backend');
  fs.mkdirSync(logs, { recursive: true });
  stage = fs.mkdtempSync(path.join(logs, 'next-upgrade-'));

  const manifest = readJSON(path.join(root, 'package.json'));
  const previousLock = readJSON(path.join(root, 'package-lock.json'));
  const previousRanges = structuredClone(manifest);
  // Resolve the coordinated React/Fiber/Drei migration as a fresh tree. Reusing
  // the React 18 lock here makes npm retain incompatible renderer peers. Keep
  // unrelated direct dependencies at their existing resolved versions; restore
  // their original manifest ranges after generating the new lock.
  for (const kind of ['dependencies', 'devDependencies']) {
    for (const name of Object.keys(manifest[kind])) {
      if (!targets[kind][name]) manifest[kind][name] = previousLock.packages[`node_modules/${name}`].version;
    }
  }
  for (const [kind, dependencies] of Object.entries(targets)) {
    manifest[kind] = { ...manifest[kind], ...dependencies };
  }
  manifest.scripts = { ...manifest.scripts, dev: 'next dev --webpack', build: 'next build --webpack', lint: 'eslint src' };
  writeJSON(path.join(stage, 'package.json'), manifest);
  fs.writeFileSync(path.join(stage, 'eslint.config.mjs'), flatConfig);

  // npm generates all resolutions/integrities. Failed resolution leaves the
  // actual project manifest, lock, lint setup and dependency tree untouched.
  npm(['install', '--package-lock-only', '--include=dev', '--no-audit', '--no-fund', '--fetch-retries=0', '--fetch-timeout=10000'], stage);
  const lock = readJSON(path.join(stage, 'package-lock.json'));
  for (const [kind, dependencies] of Object.entries(targets)) {
    for (const name of Object.keys(dependencies)) {
      const version = lock.packages[`node_modules/${name}`]?.version;
      const requiredMajor = name === 'next' || name === 'eslint-config-next' ? 16 : name === 'eslint' || name === '@react-three/fiber' ? 9 : name === '@react-three/drei' ? 10 : 19;
      assert.equal(Number(version?.split('.')[0]), requiredMajor, `Unexpected ${name} version`);
      assert.ok(!version.includes('-'), `Prerelease ${name} is not a production target`);
      manifest[kind][name] = version;
    }
  }
  assert.equal(manifest.dependencies.next, manifest.devDependencies['eslint-config-next'], 'Next and its ESLint config must match');
  assert.equal(manifest.dependencies.react, manifest.dependencies['react-dom'], 'React and React DOM must match');
  for (const kind of ['dependencies', 'devDependencies']) {
    for (const name of Object.keys(manifest[kind])) {
      if (!targets[kind][name]) manifest[kind][name] = previousRanges[kind][name];
    }
  }
  writeJSON(path.join(stage, 'package.json'), manifest);
  // Regenerate through npm after pinning the resolved direct versions.
  npm(['install', '--package-lock-only', '--include=dev', '--offline', '--no-audit', '--no-fund'], stage);
  npm(['ci', '--include=dev', '--no-audit', '--no-fund', '--fetch-retries=0', '--fetch-timeout=10000'], stage);

  for (const name of ['src', 'public', 'tsconfig.json', 'next.config.mjs', 'postcss.config.js', 'tailwind.config.js', 'next-env.d.ts']) {
    if (fs.existsSync(path.join(root, name))) fs.cpSync(path.join(root, name), path.join(stage, name), { recursive: true });
  }
  fs.mkdirSync(path.join(stage, 'backend'), { recursive: true });
  for (const name of ['package.json', 'src', 'test']) {
    fs.cpSync(path.join(root, 'backend', name), path.join(stage, 'backend', name), { recursive: true });
  }
  fs.symlinkSync(path.join(root, 'backend/node_modules'), path.join(stage, 'backend/node_modules'), 'dir');
  checks(stage);

  const files = ['package.json', 'package-lock.json', 'eslint.config.mjs', '.eslintrc.json', 'tsconfig.json'];
  const previousFiles = new Map(files.map(name => [name, fs.existsSync(path.join(root, name)) ? fs.readFileSync(path.join(root, name)) : null]));
  const previousModules = path.join(stage, 'previous-node_modules');
  const hadModules = fs.existsSync(path.join(root, 'node_modules'));
  let modulesInstalled = false;
  try {
    if (hadModules) fs.renameSync(path.join(root, 'node_modules'), previousModules);
    fs.renameSync(path.join(stage, 'node_modules'), path.join(root, 'node_modules'));
    modulesInstalled = true;
    for (const name of ['package.json', 'package-lock.json', 'eslint.config.mjs', 'tsconfig.json']) fs.copyFileSync(path.join(stage, name), path.join(root, name));
    fs.rmSync(path.join(root, '.eslintrc.json'), { force: true });
    applied = true;
  } catch (error) {
    for (const [name, value] of previousFiles) {
      if (value === null) fs.rmSync(path.join(root, name), { force: true });
      else fs.writeFileSync(path.join(root, name), value);
    }
    if (modulesInstalled) fs.renameSync(path.join(root, 'node_modules'), path.join(stage, 'node_modules'));
    if (hadModules && fs.existsSync(previousModules)) fs.renameSync(previousModules, path.join(root, 'node_modules'));
    throw error;
  }
  fs.rmSync(stage, { recursive: true, force: true });
  stage = undefined;
  // Rebuild in the real location so artifacts contain the correct project path.
  // Backend fixtures already passed in the env-file-free staging directory.
  // Do not rerun them where the developer's backend/.env could be loaded.
  checks(root, { backendTests: false });
  console.log(`\nNext.js ${manifest.dependencies.next} upgrade applied; lint, typecheck, tests and production build passed.`);
  console.log('Browser, live Groq, test PostgreSQL TLS and Preview streaming checks remain required. No merge or deployment was performed.');
} catch (error) {
  console.error(`\n${error.message}`);
  console.error(applied ? 'The dependency upgrade was applied, but final checks failed. Review the output before merging.' : 'Upgrade not applied. The existing project dependency files and installation are preserved.');
  process.exitCode = 1;
} finally {
  if (stage) fs.rmSync(stage, { recursive: true, force: true });
}
