"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Settings } from "lucide-react"
import NotificationBell from "./notification-bell"
import SettingsModal from "@/components/settings-modal"
import { useState } from "react"

export default function Navigation() {
  const pathname = usePathname()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Bell size={20} className="text-white" />
            </div>
            <span className="font-semibold text-lg text-foreground">NotifyHub</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                isActive("/dashboard") ? "bg-primary text-white" : "text-muted hover:bg-border"
              }`}
            >
              <Bell size={18} />
              <span>Notificações</span>
            </Link>



            <NotificationBell />
          </div>
        </div>
      </div>

    </nav>
  )
}
