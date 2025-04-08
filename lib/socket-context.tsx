"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"
import { io, type Socket } from "socket.io-client"

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  connect: (userId: string) => void
  disconnect: () => void
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
})

export const useSocket = () => useContext(SocketContext)

interface SocketProviderProps {
  children: React.ReactNode
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const userIdRef = useRef<string | null>(null)

  const connect = (userId: string) => {
    if (socketRef.current) {
      //console.log("Socket already connected")
      return
    }

    userIdRef.current = userId
    const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000"

    //console.log(`Connecting to socket server as user ${userId}...`)

    const socket = io(SOCKET_SERVER_URL, {
      query: { userId },
      transports: ["websocket"],
      reconnectionAttempts: 5,
    })

    socket.on("connect", () => {
      //console.log("Socket connected:", socket.id)
      setIsConnected(true)
    })

    socket.on("disconnect", (reason) => {
      //console.log("Socket disconnected:", reason)
      setIsConnected(false)
    })

    socket.on("error", (err) => {
      //console.error("Connection error:", err)
      setIsConnected(false)
    })

    socketRef.current = socket
  }

  const disconnect = () => {
    if (socketRef.current) {
      //console.log("Disconnecting socket...")
      socketRef.current.disconnect()
      socketRef.current = null
      userIdRef.current = null
      setIsConnected(false)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [])

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        connect,
        disconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

