/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Prevents double mounting R3F canvas in dev mode
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  async rewrites() {
    if (process.env.VERCEL && !process.env.BACKEND_URL) {
      throw new Error('BACKEND_URL must point to the deployed Express backend on Vercel.');
    }
    const backend = new URL(process.env.BACKEND_URL || 'http://localhost:4000');
    if (!['http:', 'https:'].includes(backend.protocol) || backend.username || backend.password || backend.search || backend.hash || backend.pathname !== '/') {
      throw new Error('BACKEND_URL must be an HTTP(S) origin without credentials, paths, or query parameters.');
    }
    if (process.env.VERCEL && (backend.protocol !== 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(backend.hostname))) {
      throw new Error('Vercel BACKEND_URL must be a publicly reachable HTTPS Express origin.');
    }
    return [{ source: '/api/:path*', destination: `${backend.origin}/api/:path*` }];
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    return config;
  },
};

export default nextConfig;
