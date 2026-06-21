import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/AdminLoginForm";
export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "ADMIN") {
    redirect("/admin");
  }
  return <AdminLoginForm />;
}
