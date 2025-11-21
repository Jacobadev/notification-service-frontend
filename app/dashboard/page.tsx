"use client"

import { useState } from "react"
import type { EventType } from "@/lib/types"
import { useNotifications } from "@/hooks/use-notifications"
import { useEvents } from "@/hooks/use-events"
import { useCurrentUser } from "@/hooks/use-users";
import NotificationItem from "@/components/notification-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Zap, RefreshCw, Settings} from "lucide-react";
import Navigation from "@/components/navigation";
import SettingsModal from "@/components/settings-modal";

type FilterType = EventType | "all";

export default function Dashboard() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { user: currentUser } = useCurrentUser();
  const { notifications, isLoading, markAsRead, deleteNotification, markAllAsRead, mutate } = useNotifications(currentUser?.id ?? "");
  const { createEvent } = useEvents()
  const [filteredType, setFilteredType] = useState<FilterType>("all")
  const [searchTerm, setSearchTerm] = useState("")

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = notifications.filter((notif) => {
    const eventType = notif.event?.type || notif.eventType
    const matchesType = filteredType === "all" || eventType === filteredType

    const searchableContent = [
      notif.title,
      notif.description,
      notif.content,
    ].filter(Boolean).join(" ").toLowerCase()

    const matchesSearch = searchableContent.includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  const handleSimulateEvent = async () => {
    const eventTypes: EventType[] = ["NEW_AUDIT", "DOCUMENT_UPDATED", "REPORT_READY"]
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)]

    try {
      await createEvent({
        type: randomType,
        payload: {
          message: `Evento simulado: ${randomType}`,
          timestamp: new Date().toISOString(),
          userId: currentUser?.id ?? ""
        }
      });
      setTimeout(() => mutate(), 1000);
    } catch (error) {
      console.error("Failed to simulate event:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-muted-foreground">Carregando notificações...</div>
      </div>
    )
  }

  return (

    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      <div className="mb-8 flex items-center justify-between w-full">

        <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground mb-2">Central de Notificações</h1>
        <p className="text-muted-foreground">Você tem {unreadCount} notificações não lidas</p>
        </div>
        <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition border hover:bg-dark/10"
        >
          <Settings size={18} />
          <span>Configurações</span>
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Não lidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{unreadCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{notifications.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de leitura</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {notifications.length > 0
                  ? Math.round(((notifications.length - unreadCount) / notifications.length) * 100)
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="flex-1">
            <Input
              placeholder="Buscar notificações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-card border-border"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={()=>markAllAsRead()}
              variant="outline"
              disabled={unreadCount === 0}
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw size={18} />
              <span className="hidden sm:inline">Marcar Tudo</span>
            </Button>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilteredType("all")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filteredType === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            Todas
          </button>
          {(["NEW_AUDIT", "DOCUMENT_UPDATED", "REPORT_READY"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilteredType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filteredType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {type === "NEW_AUDIT" ? "Auditorias" : type === "DOCUMENT_UPDATED" ? "Documentos" : "Relatórios"}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={() => markAsRead(notification.id)}
                onDelete={() => deleteNotification(notification.id)}
              />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Nenhuma notificação encontrada</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
