"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { eventsApi } from "@/lib/api"
import type { Event, CreateEventDto } from "@/lib/types"

export function useEvents() {
  const queryClient = useQueryClient()

  const {
    data: events,
    isLoading,
    error,
    refetch: mutate,
  } = useQuery<Event[], Error>({
    queryKey: ["events"],
    queryFn: eventsApi.getEvents,
  })

  const { mutateAsync: createEvent } = useMutation<
    Event,
    Error,
    CreateEventDto
  >({
    mutationFn: eventsApi.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] })
    },
  })

  return {
    events: events ?? [],
    isLoading,
    error,
    createEvent,
    mutate,
  }
}

export function useEvent(eventId: string) {
  const {
    data: event,
    isLoading,
    error,
    refetch: mutate,
  } = useQuery<Event | null, Error>({
    queryKey: ["event", eventId],
    queryFn: () => eventsApi.getEvent(eventId),
    enabled: !!eventId,
  })

  return {
    event,
    isLoading,
    error,
    mutate,
  }
}

