import type { NextConfig } from "next";

const uploadBucketHostname = `${
  process.env.AWS_S3_BUCKET_NAME ?? "mongree-upload-image"
}.s3.${process.env.AWS_REGION ?? "ap-northeast-2"}.amazonaws.com`;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sesac.s3.amazonaws.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "**.kakaocdn.net",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "**.daumcdn.net",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "ssl.pstatic.net",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: uploadBucketHostname,
        port: "",
        pathname: "/users/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
