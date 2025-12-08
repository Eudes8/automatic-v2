"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  MessageSquare, 
  CreditCard,
  Settings,
  Bell
} from "lucide-react"

export default function ClientSidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/client/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/client/projects", icon: FolderKanban, label: "Projets" },
    { href: "/client/contracts", icon: FileText, label: "Contrats" },
    { href: "/client/messages", icon: MessageSquare, label: "Messages" },
    { href: "/client/payments", icon: CreditCard, label: "Paiements" },
    { href: "/client/settings", icon: Settings, label: "Paramètres" },
  ]

  return (
    <div className="flex w-64 flex-col border-r bg-gray-950">
      <div className="flex h-16 shrink-0 items-center px-6">
        <Link href="/client/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="text-lg">AUTOMATIC</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 px-4 py-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-gray-50 ${pathname === item.href ? 'bg-gray-800 text-gray-50' : ''}`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t p-4">
        <Link
          href="/client/notifications"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-gray-50 ${pathname === '/client/notifications' ? 'bg-gray-800 text-gray-50' : ''}`}
        >
          <Bell className="h-5 w-5" />
          Notifications
        </Link>
      </div>
    </div>
  )
}