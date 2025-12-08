"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  MessageSquare,
  Send,
  User,
  Clock,
  Paperclip,
  Search,
  Plus,
  Settings,
  LogOut,
  ArrowLeft,
  MoreVertical,
  Check,
  CheckCheck
  ,
  Zap
} from 'lucide-react'
import Link from 'next/link'

interface Conversation {
  id: string
  title: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  participants: Participant[]
  type: 'project' | 'support' | 'general'
}

interface Participant {
  id: string
  name: string
  avatar: string
  role: string
  status: 'online' | 'offline' | 'busy'
}

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  senderAvatar: string
  timestamp: string
  read: boolean
  attachments?: Attachment[]
}

interface Attachment {
  id: string
  name: string
  size: string
  type: string
}

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        const res = await fetch('/api/messages')
        if (!res.ok) throw new Error('Failed to fetch conversations')
        const data = await res.json()
        if (mounted) {
          setConversations(data)
          if (data && data.length) setSelectedConversation(data[0])
        }
      } catch (err) {
        console.error('Error loading conversations:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!selectedConversation) return

    let mounted = true

    ;(async () => {
      try {
        const res = await fetch(`/api/messages/${selectedConversation.id}`)
        if (!res.ok) throw new Error('Failed to fetch messages')
        const data = await res.json()
        if (mounted) setMessages(data)
      } catch (err) {
        console.error('Error loading messages:', err)
        if (mounted) setMessages([])
      }
    })()

    return () => { mounted = false }
  }, [selectedConversation])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      senderId: 'client',
      senderName: 'Vous',
      senderAvatar: 'CL',
      timestamp: new Date().toISOString(),
      read: false
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Envoi vers l'API (optimistic update)
    ;(async () => {
      try {
        await fetch(`/api/messages/${selectedConversation.id}/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message)
        })
      } catch (err) {
        console.error('Error sending message:', err)
      }
    })()
  }

  const getConversationTypeColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-blue-100 text-blue-800'
      case 'support': return 'bg-green-100 text-green-800'
      case 'general': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getConversationTypeText = (type: string) => {
    switch (type) {
      case 'project': return 'Projet'
      case 'support': return 'Support'
      case 'general': return 'Général'
      default: return 'Autre'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return `${days}j`
    } else if (hours > 0) {
      return `${hours}h`
    } else {
      return 'Maintenant'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Chargement des messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/client/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">AUTOMATIC</span>
              </Link>

              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/client/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Tableau de bord
                </Link>
                <Link href="/client/messages" className="text-foreground hover:text-primary transition-colors">
                  Messages
                </Link>
                <Link href="/client/files" className="text-muted-foreground hover:text-primary transition-colors">
                  Fichiers
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Conversations</span>
                  </CardTitle>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Rechercher..." className="pl-10" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-20rem)]">
                  <div className="space-y-1 p-4">
                    {conversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedConversation?.id === conversation.id
                            ? 'bg-primary/10 border border-primary/20'
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <MessageSquare className="w-4 h-4 text-primary" />
                            </div>
                            <Badge variant="secondary" className={`text-xs ${getConversationTypeColor(conversation.type)}`}>
                              {getConversationTypeText(conversation.type)}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                        <h4 className="font-medium text-sm mb-1 line-clamp-1">
                          {conversation.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <div className="flex items-center justify-between">
                            <Badge variant="destructive" className="text-xs">
                              {conversation.unreadCount}
                            </Badge>
                            <div className="flex -space-x-1">
                              {conversation.participants.slice(0, 3).map((participant) => (
                                <div
                                  key={participant.id}
                                  className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium border-2 border-background"
                                >
                                  {participant.avatar[0]}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            {selectedConversation ? (
              <Card className="h-full">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{selectedConversation.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedConversation.participants.length} participant{selectedConversation.participants.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-[calc(100vh-24rem)] p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === 'client' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                            message.senderId === 'client' ? 'order-2' : 'order-1'
                          }`}>
                            {message.senderId !== 'client' && (
                              <div className="flex items-center space-x-2 mb-1">
                                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                                  {message.senderAvatar[0]}
                                </div>
                                <span className="text-xs font-medium">{message.senderName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(message.timestamp)}
                                </span>
                              </div>
                            )}
                            <div className={`p-3 rounded-lg ${
                              message.senderId === 'client'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}>
                              <p className="text-sm">{message.content}</p>
                              {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {message.attachments.map((attachment) => (
                                    <div key={attachment.id} className="flex items-center space-x-2 text-xs">
                                      <Paperclip className="w-3 h-3" />
                                      <span>{attachment.name}</span>
                                      <span className="text-muted-foreground">({attachment.size})</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            {message.senderId === 'client' && (
                              <div className="flex items-center justify-end space-x-1 mt-1">
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(message.timestamp)}
                                </span>
                                {message.read ? (
                                  <CheckCheck className="w-3 h-3 text-blue-500" />
                                ) : (
                                  <Check className="w-3 h-3 text-muted-foreground" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Tapez votre message..."
                      className="flex-1 min-h-[60px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Sélectionnez une conversation
                  </h3>
                  <p className="text-muted-foreground">
                    Choisissez une conversation pour commencer à échanger avec l'équipe.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Messages