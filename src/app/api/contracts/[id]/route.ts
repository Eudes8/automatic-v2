import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Cherche le contrat par id (ou proposalId)
  const byId = await prisma.contract.findUnique({ where: { id } }).catch(() => null)
  if (byId) return NextResponse.json(byId)

  const byProposal = await prisma.contract.findFirst({ where: { proposalId: id } }).catch(() => null)
  if (byProposal) return NextResponse.json(byProposal)

  return NextResponse.json({ error: 'Contrat non trouvé' }, { status: 404 })
}
