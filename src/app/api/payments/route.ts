import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const proposalId = url.searchParams.get('proposalId') || 'PROP-2024-001'

    const paymentData = {
      proposalId,
      contractId: 'CONTRAT-2024-001',
      amount: 7500,
      currency: 'EUR',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Acompte de 30% pour le projet Application E-commerce Mobile',
      paymentMethods: ['card', 'transfer', 'check'],
      status: 'pending'
    }
    
    return NextResponse.json(paymentData)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Unable to fetch payment data' }, { status: 500 })
  }
}
