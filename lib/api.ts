import axios from "axios"
import type {
  Notification,
  NotificationPreference,
  User,
  Event,
  CreateUserDto,
  CreatePreferenceDto,
  UpdatePreferenceDto,
  CreateEventDto,
  EventType,
  NotificationChannel,
} from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await axiosInstance.get<T>(endpoint)
      return response.data
    } catch (error) {
      console.error("[API] GET error:", error)
      throw error
    }
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    try {
      const response = await axiosInstance.post<T>(endpoint, data)
      return response.data
    } catch (error) {
      console.error("[API] POST error:", error)
      throw error
    }
  },

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    try {
      const response = await axiosInstance.patch<T>(endpoint, data)
      return response.data
    } catch (error) {
      console.error("[API] PATCH error:", error)
      throw error
    }
  },

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await axiosInstance.delete<T>(endpoint)
      return response.data
    } catch (error) {
      console.error("[API] DELETE error:", error)
      throw error
    }
  },
}

export const notificationApi = {
  async getNotifications(
    userId: string,
    eventType?: EventType,
    channel?: NotificationChannel,
  ): Promise<Notification[]> {
    let query = `/notifications/${userId}`
    const params = new URLSearchParams()
    if (eventType) params.append("eventType", eventType)
    if (channel) params.append("channel", channel)
    if (params.toString()) query += `?${params.toString()}`
    return apiClient.get<Notification[]>(query)
  },

  async markAsRead(notificationId: string): Promise<Notification> {
    return apiClient.patch<Notification>(`/notifications/${notificationId}/read`, {})
  },

  async markAllAsRead(userId: string): Promise<void> {
    console.log("markAllAsRead called for user:", userId)
  },

  async deleteNotification(notificationId: string): Promise<void> {
    console.log("deleteNotification called for:", notificationId)
  },
}

export const usersApi = {
  async getUsers(): Promise<User[]> {
    return apiClient.get<User[]>("/users")
  },

  async getUser(userId: string): Promise<User | null> {
    if (!userId) return null
    return apiClient.get<User>(`/users/${userId}`)
  },

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return apiClient.get<User>(`/users/by-email/${encodeURIComponent(email)}`)
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null
      }
      console.error(`[API] Error fetching user by email ${email}:`, error)
      throw error
    }
  },

  async createUser(data: CreateUserDto): Promise<User> {
    return apiClient.post<User>("/users", data)
  },
}

export const eventsApi = {
  async getEvents(): Promise<Event[]> {
    return apiClient.get<Event[]>("/events")
  },

  async getEvent(id: string): Promise<Event> {
    return apiClient.get<Event>(`/events/${id}`)
  },

  async createEvent(data: CreateEventDto): Promise<Event> {
    return apiClient.post<Event>("/events", data)
  },

  async updateEvent(id: string, data: Partial<CreateEventDto>): Promise<Event> {
    return apiClient.patch<Event>(`/events/${id}`, data)
  },

  async deleteEvent(id: string): Promise<void> {
    return apiClient.delete<void>(`/events/${id}`)
  },
}



export const preferencesApi = {
  async getPreferences(userId: string): Promise<NotificationPreference[]> {
    return apiClient.get<NotificationPreference[]>(`/preferences/${userId}`)
  },

  async createPreference(data: CreatePreferenceDto): Promise<NotificationPreference> {
    return apiClient.post<NotificationPreference>("/preferences", data)
  },

  async updatePreference(id: string, data: UpdatePreferenceDto): Promise<NotificationPreference> {
    return apiClient.patch<NotificationPreference>(`/preferences/${id}`, data)
  },
}
