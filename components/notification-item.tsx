"use client"
import { Mail, Bell, Check, Trash2 } from "lucide-react"
import type { Notification, EventType } from "@/lib/types"

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead?: (id: string) => void
  onDelete?: (id: string) => void
}

const formatTimeAgo = (date: Date | string): string => {
  const now = new Date()
  const notifDate = typeof date === "string" ? new Date(date) : date
  const secondsAgo = Math.floor((now.getTime() - notifDate.getTime()) / 1000)

  if (secondsAgo < 60) return "agora mesmo"
  if (secondsAgo < 3600) return `há ${Math.floor(secondsAgo / 60)}m`
  if (secondsAgo < 86400) return `há ${Math.floor(secondsAgo / 3600)}h`
  if (secondsAgo < 604800) return `há ${Math.floor(secondsAgo / 86400)}d`
  return notifDate.toLocaleDateString("pt-BR")
}

export default function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const getEventTypeInfo = (type?: EventType) => {
    switch (type) {
      case "NEW_AUDIT":
        return {
          label: "Nova Auditoria",
          color: "bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-300"
        }
      case "DOCUMENT_UPDATED":
        return {
          label: "Documento Atualizado",
          color: "bg-purple-100 text-purple-900 dark:bg-purple-900/40 dark:text-purple-300"
        }
      case "REPORT_READY":
        return {
          label: "Relatório Pronto",
          color: "bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-300"
        }
      default:
        return {
          label: "Notificação",
          color: "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-300"
        }
    }
  }

  const eventInfo = getEventTypeInfo(notification.event?.type || notification.eventType)


  const getDisplayContent = () => {
    try {

      const parsed = JSON.parse(notification.content)
      return {
        title: parsed.title || notification.title || eventInfo.label,
        description: parsed.message || parsed.description || notification.description || notification.content
      }
    } catch {

      return {
        title: notification.title || eventInfo.label,
        description: notification.description || notification.content
      }
    }
  }

  const { title, description } = getDisplayContent()

  return (
    <div
      className={`p-4 rounded-lg border transition ${
        notification.read ? "bg-card border-border/50" : "bg-card/80 border-primary/30 ring-1 ring-primary/20"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="pt-1">
            {notification.channel === "EMAIL" ? (
              <Mail size={20} className="text-accent" />
            ) : (
              <Bell size={20} className="text-primary" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">{title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${eventInfo.color}`}>
                {eventInfo.label}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">{description}</p>

            <span className="text-xs text-muted-foreground/70">{formatTimeAgo(notification.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!notification.read && onMarkAsRead && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="p-2 hover:bg-border rounded-lg transition"
              title="Marcar como lida"
            >
              <Check size={18} className="text-green-600 dark:text-green-400" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(notification.id)}
              className="p-2 hover:bg-border/50 rounded-lg transition text-destructive hover:text-destructive/80"
              title="Deletar"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
