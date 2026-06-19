/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }],
  },
  async redirects() {
    return [
      { source: '/blog', destination: '/community', permanent: true },
      { source: '/blog/:path*', destination: '/community', permanent: true },
    ];
  },
};
export default nextConfig;
