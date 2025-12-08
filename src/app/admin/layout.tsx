import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AdminSidebar from "@/components/admin/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/client/login"); // Rediriger vers la page de login si non authentifié
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  // Assurez-vous que seul les utilisateurs avec le rôle 'admin' peuvent accéder à cette section
  if (!user || user.role !== "admin") {
    // Ou rediriger vers un tableau de bord client si l'utilisateur n'est pas admin
    redirect("/client/dashboard");
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
}
