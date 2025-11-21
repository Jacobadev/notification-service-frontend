"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { preferencesApi } from "@/lib/api"
import type {
  NotificationPreference,
  UpdatePreferenceDto,
  CreatePreferenceDto,
} from "@/lib/types"

export function usePreferences(userId: string | null) {
  const queryClient = useQueryClient()

  const queryKey = ["preferences", userId]

  const {
    data: preferences,
    isLoading,
    error,
    refetch: mutate,
  } = useQuery<NotificationPreference[], Error>({
    queryKey,
    queryFn: () => preferencesApi.getPreferences(userId!),
    enabled: !!userId,
  })

  const { mutateAsync: updatePreference } = useMutation({
    mutationFn: ({ id, updates }:{id:string,updates:UpdatePreferenceDto}) =>
      preferencesApi.updatePreference(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const { mutateAsync: createPreference } = useMutation({
    mutationFn: preferencesApi.createPreference,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    preferences: preferences ?? [],
    isLoading,
    error,
    updatePreference,
    createPreference,
    mutate,
  }
}
