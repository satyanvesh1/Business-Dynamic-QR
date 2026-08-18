import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Navigation from "./Navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <div className="lg:pl-64">
        {children}
      </div>
    </div>
  );
}