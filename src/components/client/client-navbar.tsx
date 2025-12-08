"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Search } from "lucide-react"

export default function ClientNavbar() {
  const { data: session } = useSession()

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b bg-gray-950 px-6">
      <div className="flex items-center gap-4">
        <Link href="/client/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="text-lg">AUTOMATIC Client</span>
        </Link>
        <Button variant="ghost" size="icon" className="ml-4">
          <Search className="h-5 w-5 text-gray-400" />
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-gray-400" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={session?.user?.image || "/placeholder-user.jpg"} alt="@username" />
                <AvatarFallback>{session?.user?.name ? session.user.name.charAt(0) : "A"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session?.user?.name || "Client"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/client/profile" className="w-full">Profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/client/settings" className="w-full">Paramètres</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({
              callbackUrl: "/client/login"
            })}>
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}