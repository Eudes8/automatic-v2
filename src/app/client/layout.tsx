"use client"

import { SessionProvider } from "next-auth/react"
import ClientNavbar from "@/components/client/client-navbar"
import ClientSidebar from "@/components/client/client-sidebar"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-gray-900 text-white">
        <ClientSidebar />
        <div className="flex flex-col flex-1">
          <ClientNavbar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  )
}