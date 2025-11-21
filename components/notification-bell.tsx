"use client"

import { useState } from "react"
import { Bell, Check, X, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/hooks/use-notifications"
import { useCurrentUser } from "@/hooks/use-users"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function NotificationBell() {
  const { user: currentUser } = useCurrentUser()
  const { notifications, markAsRead, markAllAsRead } = useNotifications(
    currentUser?.id ?? ""
  )
  const [isOpen, setIsOpen] = useState(false)

  const unreadNotifications = notifications.filter((n) => !n.read)
  const recentNotifications = notifications.slice(0, 5)

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const notifDate = new Date(date)
    const secondsAgo = Math.floor((now.getTime() - notifDate.getTime()) / 1000)

    if (secondsAgo < 60) return "agora"
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m`
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h`
    if (secondsAgo < 604800) return `${Math.floor(secondsAgo / 86400)}d`
    return notifDate.toLocaleDateString("pt-BR")
  }

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await markAsRead(id)
  }

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await markAllAsRead()
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadNotifications.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadNotifications.length > 9 ? "9+" : unreadNotifications.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0">Notificações</DropdownMenuLabel>
          {unreadNotifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-xs"
              onClick={handleMarkAllAsRead}
            >
              <Check className="h-3 w-3 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />

        {recentNotifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Nenhuma notificação
          </div>
        ) : (
          <div className="space-y-1">
            {recentNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex flex-col items-start gap-1 p-3 cursor-pointer",
                  !notification.read && "bg-accent/50"
                )}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id)
                  }
                  setIsOpen(false)
                }}
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {notification.title || "Nova Notificação"}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.description || notification.content}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatTimeAgo(notification.createdAt)}</span>
                      <span>•</span>
                      <span className="capitalize">
                        {notification.eventType?.replace(/_/g, " ").toLowerCase()}
                      </span>
                    </div>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        {notifications.length > 5 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard"
                className="w-full text-center text-sm font-medium cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Ver todas as notificações
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

