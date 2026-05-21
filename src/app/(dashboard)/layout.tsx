import { redirect } from "next/navigation";
import { getCurrentAuthUser } from "@/lib/get-user";
import Layout from "@/components/layout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentAuthUser();
  if (!user) redirect("/login");

  return <Layout>{children}</Layout>;
}
