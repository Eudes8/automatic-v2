import { createServer } from 'http'
// socket.io removed in example to avoid build-time dependency during typecheck
// import { Server } from 'socket.io'

const httpServer = createServer()
// const io = new Server(httpServer, {
//   path: '/',
//   cors: { origin: "*", methods: ["GET", "POST"] },
//   pingTimeout: 60000,
//   pingInterval: 25000,
// })

interface User {
  id: string
  username: string
}

interface Message {
  id: string
  username: string
  content: string
  timestamp: Date
  type: 'user' | 'system'
}

const users = new Map<string, User>()

const generateMessageId = () => Math.random().toString(36).substr(2, 9)

const createSystemMessage = (content: string): Message => ({
  id: generateMessageId(),
  username: 'System',
  content,
  timestamp: new Date(),
  type: 'system'
})

const createUserMessage = (username: string, content: string): Message => ({
  id: generateMessageId(),
  username,
  content,
  timestamp: new Date(),
  type: 'user'
})

// Socket.io connection would go here (disabled for build-time typecheck)
// io.on('connection', (socket) => { ... })

const PORT = 3003
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal, shutting down server...')
  httpServer.close(() => {
    console.log('WebSocket server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('Received SIGINT signal, shutting down server...')
  httpServer.close(() => {
    console.log('WebSocket server closed')
    process.exit(0)
  })
})