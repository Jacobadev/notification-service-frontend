"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import type { NotificationPreference, EventType } from "@/lib/types"

interface PreferenceCardProps {
  preference: NotificationPreference
  onToggle?: (id: string, enabled: boolean) => void
}

export default function PreferenceCard({ preference, onToggle }: PreferenceCardProps) {
  const getEventTypeLabel = (type: EventType) => {
    switch (type) {
      case "NEW_AUDIT":
        return "Nova Auditoria"
      case "DOCUMENT_UPDATED":
        return "Documento Atualizado"
      case "REPORT_READY":
        return "Relatório Pronto"
      default:
        return type
    }
  }

  const getFrequencyLabel = (freq: string) => {
    switch (freq) {
      case "REAL_TIME":
        return "Tempo Real"
      case "DAILY":
        return "Diária"
      case "WEEKLY":
        return "Semanal"
      default:
        return freq
    }
  }

  const getChannelLabel = (channel: string) => {
    return channel === "IN_APP" ? "In-app" : channel === "EMAIL" ? "Email" : channel
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-base">{getEventTypeLabel(preference.eventType)}</CardTitle>
          <CardDescription>{getFrequencyLabel(preference.frequency)}</CardDescription>
        </div>
        <Switch
          checked={preference.enabled ?? true}
          onCheckedChange={(checked) => onToggle?.(preference.id, checked)}
        />
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Canal:</span>
          <Badge variant={preference.channel === "EMAIL" ? "secondary" : "default"}>
            {getChannelLabel(preference.channel)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
