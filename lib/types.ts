

export type EventType = "NEW_AUDIT" | "DOCUMENT_UPDATED" | "REPORT_READY"
export type NotificationChannel = "IN_APP" | "EMAIL"
export type NotificationFrequency = "REAL_TIME" | "DAILY" | "WEEKLY"
export type NotificationModule = "audits" | "documents" | "reports"

export interface Event {
  id: string
  type: EventType
  payload: Record<string, any>
  createdAt: string
  notifications?: Notification[]
}

export interface Notification {
  id: string
  content: string
  channel: NotificationChannel
  read: boolean
  userId: string
  eventId: string | null
  createdAt: string
  event?: Event

  title?: string
  description?: string
  type?: NotificationModule
  eventType?: EventType
}

export interface NotificationPreference {
  id: string
  userId: string
  eventType: EventType
  channel: NotificationChannel
  frequency: NotificationFrequency

  module?: NotificationModule
  channels?: NotificationChannel[]
  enabled?: boolean
}

export interface User {
  id: string
  name: string
  email: string
}

export interface CreateUserDto {
  name: string
  email: string
}

export interface CreatePreferenceDto {
  userId: string
  eventType: EventType
  channel: NotificationChannel
  frequency: NotificationFrequency
}

export interface UpdatePreferenceDto {
  eventType?: EventType
  channel?: NotificationChannel
  frequency?: NotificationFrequency
  enabled?: boolean
}

export interface CreateEventDto {
  type: EventType
  payload: Record<string, any>
}

