import { headers } from "next/headers";

const trimTrailingSlash = (url: string) => url.replace(/\/$/, "");

export const getSiteUrl = async () => {
  const headersList = await headers();
  const forwardedHost = headersList.get("x-forwarded-host");
  const host = forwardedHost ?? headersList.get("host");
  const forwardedProto = headersList.get("x-forwarded-proto");
  const protocol =
    forwardedProto ?? (host?.startsWith("localhost") ? "http" : "https");

  // 배포 도메인 기준 URL 생성
  if (host) {
    return trimTrailingSlash(`${protocol}://${host}`);
  }

  if (process.env.VERCEL_URL) {
    return trimTrailingSlash(`https://${process.env.VERCEL_URL}`);
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL);
  }

  return "http://localhost:3000";
};
