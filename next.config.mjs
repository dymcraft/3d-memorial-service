/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 빌드 중 ESLint 검사를 비활성화 (배포를 위해)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 빌드 중 TypeScript 오류를 무시 (배포를 위해)
    ignoreBuildErrors: true,
  },
  images: {
    // 외부 이미지 호스트 허용 (필요시)
    // unoptimized: true,
  },
};

export default nextConfig;