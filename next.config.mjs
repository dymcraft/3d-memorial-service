/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // 🔥 Supabase Storage 이미지 도메인 허용
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kkrbrbwjiohkmtxatdir.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;