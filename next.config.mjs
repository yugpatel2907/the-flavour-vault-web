/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Prevents double mounting R3F canvas in dev mode
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/:path*` }];
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
