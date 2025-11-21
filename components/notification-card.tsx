"use client"

import { Bell, Tag, Clock, Mail, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Notification,
  NotificationChannel,
  EventType,
} from "@/lib/types"
import { cn } from "@/lib/utils"

interface NotificationCardProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
}

const iconMap: Record<EventType, React.ElementType> = {
  NEW_AUDIT: Bell,
  DOCUMENT_UPDATED: Tag,
  REPORT_READY: Clock,
}

const channelIconMap: Record<NotificationChannel, React.ElementType> = {
  IN_APP: MessageSquare,
  EMAIL: Mail,
}

export default function NotificationCard({
  notification,
  onMarkAsRead,
}: NotificationCardProps) {
  const Icon = iconMap[notification.eventType as EventType] || Bell
  const ChannelIcon =
    channelIconMap[notification.channel as NotificationChannel] || MessageSquare

  return (
    <Card
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg transition-colors cursor-pointer",
        notification.read
          ? "bg-card text-muted-foreground"
          : "bg-card hover:bg-border",
      )}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon size={20} className="text-primary" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">
            {notification.title || "Nova Notificação"}
          </h3>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {new Date(notification.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {notification.description || notification.content}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="text-xs">
            <ChannelIcon size={12} className="mr-1" />
            {notification.channel}
          </Badge>
          <Badge variant="secondary" className="text-xs capitalize">
            {notification.eventType?.replace(/_/g, " ").toLowerCase() || "Geral"}
          </Badge>
        </div>
      </div>
    </Card>
  )
}

