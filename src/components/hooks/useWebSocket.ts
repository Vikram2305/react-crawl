"use client"

import { useEffect, useRef, useState } from "react"

export const ReadyState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
  UNINSTANTIATED: 4,
}

const useWebSocket = (url: string) => {
  const [readyState, setReadyState] = useState(ReadyState.UNINSTANTIATED)
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null)
  const socket = useRef<WebSocket | null>(null)

  useEffect(() => {
    socket.current = new WebSocket(url)

    socket.current.onopen = () => setReadyState(ReadyState.OPEN)
    socket.current.onclose = () => setReadyState(ReadyState.CLOSED)
    socket.current.onmessage = (event) => setLastMessage(event)

    return () => {
      if (socket.current) {
        socket.current.close()
      }
    }
  }, [url])

  const sendMessage = (message: string) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(message)
    } else {
      console.error("WebSocket is not connected")
    }
  }

  return { sendMessage, lastMessage, readyState }
}

export default useWebSocket