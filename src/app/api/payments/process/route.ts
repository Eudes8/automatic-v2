import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Processing payment:', body)

    const { proposalId, contractId, amount } = body.paymentData || {}

    // Mark payment as completed in DB if exists
    const payment = await prisma.payment.findFirst({ where: { proposalId } })
    if (payment) {
      await prisma.payment.update({ where: { id: payment.id }, data: { status: 'completed', method: body.selectedMethod || 'card' } })
    }

    if (proposalId) {
      await prisma.proposal.update({ where: { id: proposalId }, data: { status: 'paid' } }).catch(() => null)
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Payment processing failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
