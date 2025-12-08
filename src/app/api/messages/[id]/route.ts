import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const messagesByConv: Record<string, any[]> = {
    'conv-1': [
      {
        id: 'msg-1',
        content: "Bonjour ! Le développement de l'application avance bien. Nous venons de terminer l'intégration de l'API de paiement.",
        senderId: '1',
        senderName: 'Marie Dubois',
        senderAvatar: 'MD',
        timestamp: '2024-03-10T10:00:00Z',
        read: true
      },
      {
        id: 'msg-2',
        content: 'Parfait ! Pouvez-vous me donner plus de détails sur les fonctionnalités de paiement implémentées ?',
        senderId: 'client',
        senderName: 'Vous',
        senderAvatar: 'CL',
        timestamp: '2024-03-10T10:15:00Z',
        read: true
      },
      {
        id: 'msg-3',
        content: 'Bien sûr ! Nous avons intégré Stripe avec support des cartes de crédit, PayPal, et Apple Pay. La sécurité est assurée par 3D Secure.',
        senderId: '1',
        senderName: 'Marie Dubois',
        senderAvatar: 'MD',
        timestamp: '2024-03-10T10:20:00Z',
        read: true
      },
      {
        id: 'msg-4',
        content: "Le développement de l'API est terminé. Vous pouvez tester les endpoints dans l'environnement de développement.",
        senderId: '1',
        senderName: 'Marie Dubois',
        senderAvatar: 'MD',
        timestamp: '2024-03-10T14:30:00Z',
        read: false
      }
    ],
    'conv-2': [
      {
        id: 'msg-21',
        content: 'Bonjour, nous avons bien reçu votre demande de support.',
        senderId: '4',
        senderName: 'Support AUTOMATIC',
        senderAvatar: 'SA',
        timestamp: '2024-03-08T09:20:00Z',
        read: true
      }
    ],
    'conv-3': []
  }

  const messages = messagesByConv[id] || []
  return NextResponse.json(messages)
}
