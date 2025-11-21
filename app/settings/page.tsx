"use client"

import { useState, useEffect } from "react"
import { usePreferences } from "@/hooks/use-preferences"
import { useUsers } from "@/hooks/use-users"
import PreferenceCard from "@/components/preference-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Bell, Save } from "lucide-react"
import { usersApi } from "@/lib/api"

const USER_EMAIL = "dev.user@example.com"

export default function Settings() {
  const [userId, setUserId] = useState<string | null>(null)
  const { preferences, isLoading, updatePreference } = usePreferences(userId)
  const { users } = useUsers()
  const currentUser = users.find((u) => u.id === userId)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const user = await usersApi.getUserByEmail(USER_EMAIL)
      if (user) {
        setUserId(user.id)
      }
    }
    fetchUser()
  }, [])

  const handleTogglePreference = async (id: string, enabled: boolean) => {
    await updatePreference({ id, updates: { enabled } })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const enabledPreferences = preferences.filter((p: any) => p.enabled)
  const inAppChannels = preferences.filter(
    (p: any) => p.enabled && p.channel === "IN_APP",
  ).length
  const emailChannels = preferences.filter(
    (p: any) => p.enabled && p.channel === "EMAIL",
  ).length

  if (isLoading || !userId) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-muted-foreground">Carregando preferências...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Configurações de Notificações</h1>
        <p className="text-muted-foreground">Personalize como e quando quer receber notificações</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Canais ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{enabledPreferences.length}</div>
              <p className="text-xs text-muted-foreground mt-1">de {preferences.length} configurações</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Bell size={16} /> In-app
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{inAppChannels}</div>
              <p className="text-xs text-muted-foreground mt-1">notificações ativas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail size={16} /> Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{emailChannels}</div>
              <p className="text-xs text-muted-foreground mt-1">notificações ativas</p>
            </CardContent>
          </Card>
        </div>

        {/* Preferences */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Preferências por Módulo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {preferences.map((preference) => (
              <PreferenceCard
                key={preference.id}
                preference={preference}
                onToggle={() =>
                  handleTogglePreference(preference.id, !(preference.enabled ?? true))
                }
              />
            ))}
          </div>
        </div>

        {/* Frequency Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tipos de Frequência</CardTitle>
            <CardDescription>Entenda como as notificações são entregues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400 mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground text-sm">Tempo Real</p>
                <p className="text-xs text-muted-foreground">Receba notificações instantaneamente</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground text-sm">Resumo Diário</p>
                <p className="text-xs text-muted-foreground">Receba um resumo de notificações uma vez por dia</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground text-sm">Resumo Semanal</p>
                <p className="text-xs text-muted-foreground">Receba um resumo consolidado uma vez por semana</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            className={`flex items-center gap-2 transition ${
              saved
                ? "bg-green-600 hover:bg-green-600 text-white"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }`}
          >
            <Save size={18} />
            {saved ? "Salvo!" : "Salvar Mudanças"}
          </Button>
        </div>
      </div>
    </div>
  )
}
