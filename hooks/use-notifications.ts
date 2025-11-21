"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { notificationApi } from "@/lib/api"
import type { Notification, EventType, NotificationChannel } from "@/lib/types"

export function useNotifications(
  userId: string,
  eventType?: EventType,
  channel?: NotificationChannel,
) {
  const queryClient = useQueryClient()

  const queryKey = ["notifications", userId, eventType, channel]

  const {
    data: notifications,
    isLoading,
    error,
    refetch: mutate,
  } = useQuery<Notification[], Error>({
    queryKey,
    queryFn: () =>
      notificationApi.getNotifications(userId, eventType, channel),
    enabled: !!userId,
  })

  const { mutateAsync: markAsRead } = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const { mutateAsync: deleteNotification } = useMutation<
    void,
    Error,
    string
  >({
    mutationFn: notificationApi.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const { mutateAsync: markAllAsRead } = useMutation<void, Error, void>({
    mutationFn: async () => {
      if (
        !notifications ||
        !Array.isArray(notifications) ||
        notifications.length === 0
      )
        return

      await Promise.all(
        notifications
          .filter((n) => !n.read)
          .map((n) => notificationApi.markAsRead(n.id)),
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    notifications: notifications ?? [],
    isLoading,
    error,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    mutate,
  }
}
