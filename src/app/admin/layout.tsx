import { redirect } from "next/navigation";
import { getPlatformAdmin } from "@/lib/platform-admin";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await getPlatformAdmin();

  if (!admin) {
    redirect("/dashboard");
  }

  return children;
}
