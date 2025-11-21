"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { usersApi } from "@/lib/api"
import type { User, CreateUserDto } from "@/lib/types"

export function useUsers() {
  const queryClient = useQueryClient()

  const {
    data: users,
    isLoading,
    error,
    refetch: mutate,
  } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: usersApi.getUsers,
  })

  const { mutateAsync: createUser } = useMutation<User, Error, CreateUserDto>({
    mutationFn: usersApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  return {
    users: users ?? [],
    isLoading,
    error,
    createUser,
    mutate,
  }
}

export function useUser(userId: string) {
  const {
    data: user,
    isLoading,
    error,
    refetch: mutate,
  } = useQuery<User | null, Error>({
    queryKey: ["user", userId],
    queryFn: () => usersApi.getUser(userId),
    enabled: !!userId,
  })

  return {
    user,
    isLoading,
    error,
    mutate,
  }
}

export function useCurrentUser() {
  const email = "dev.user@example.com"

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User | null, Error>({
    queryKey: ["currentUser", email],
    queryFn: async () => {
      try {
        const userData = await usersApi.getUserByEmail(email)
        if (typeof window !== "undefined") {
          localStorage.setItem("currentUser", JSON.stringify(userData))
        }
        return userData
      } catch (e) {
        console.error("Failed to fetch user by email", e)
        return null
      }
    },
    staleTime: 1000 * 60 * 5,
    enabled: typeof window !== "undefined",
  })

  const storedUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("currentUser") || "null")
      : null

  return {
    user: user ?? storedUser,
    isLoading,
    error,
  }
}
