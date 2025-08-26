"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          AUTOMATIC
        </Link>
        <div className="flex items-center space-x-4">
          {status === "loading" ? (
            <div>Chargement...</div>
          ) : session ? (
            <>
              <span>Bonjour, {session.user?.name || "Utilisateur"}</span>
              <Link href="/client" className="hover:text-gray-300">
                Espace Client
              </Link>
              <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded">
                Déconnexion
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
