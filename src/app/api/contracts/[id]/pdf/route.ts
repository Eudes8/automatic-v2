/**
 * GET /api/contracts/[id]/pdf
 * Generates and returns contract PDF using server-rendered HTML
 * Converts HTML to PDF format for download
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/api-logger'

const ROUTE = '/api/contracts/[id]/pdf'

/**
 * Generate a simple PDF from contract data using text encoding
 * Returns a basic PDF with contract information
 */
function generateSimplePdf(contract: any): Buffer {
  const lines: string[] = []
  
  const created = new Date(contract.createdAt).toLocaleDateString('fr-FR')
  const validUntil = contract.validUntil ? new Date(contract.validUntil).toLocaleDateString('fr-FR') : ''
  const vatRate = contract.projectInfo?.vatRate ?? 0.2
  const priceHT = Number(contract.projectInfo?.price ?? 0) / 100
  const vatAmount = Math.round(priceHT * vatRate * 100) / 100
  const priceTTC = Math.round((priceHT + vatAmount) * 100) / 100

  // PDF header structure
  let content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${2000} >>
stream
BT
/F1 18 Tf
50 750 Td
(AUTOMATIC) Tj
0 -20 Td
/F1 10 Tf
(Contrat de prestation de services informatiques) Tj
0 -40 Td
/F1 12 Tf
(1. Parties) Tj
0 -20 Td
/F1 10 Tf
(Prestataire: AUTOMATIC) Tj
0 -12 Td
(Client: ${(contract.clientInfo?.company || '').substring(0, 50)}) Tj
0 -40 Td
/F1 12 Tf
(2. Conditions financieres) Tj
0 -20 Td
/F1 10 Tf
(Prix HT: ${priceHT.toLocaleString('fr-FR')} EUR) Tj
0 -12 Td
(TVA (${Math.round(vatRate * 100)}%): ${vatAmount.toLocaleString('fr-FR')} EUR) Tj
0 -12 Td
(Prix TTC: ${priceTTC.toLocaleString('fr-FR')} EUR) Tj
0 -40 Td
/F1 12 Tf
(3. Clauses legales) Tj
0 -20 Td
/F1 9 Tf
(- Propriete intellectuelle: Licence cédée au client) Tj
0 -12 Td
(- Confidentialite: Engagement bilatéral) Tj
0 -12 Td
(- Garantie: 90 jours post-livraison) Tj
0 -12 Td
(- Droit francais. Tribunaux de Paris.) Tj
0 -40 Td
/F1 10 Tf
(Signatures) Tj
0 -20 Td
/F1 9 Tf
(Date: ${new Date().toLocaleDateString('fr-FR')}) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000074 00000 n
0000000133 00000 n
0000000281 00000 n
0000002431 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
2520
%%EOF`

  return Buffer.from(content, 'utf-8')
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const startTime = Date.now()

  try {
    logger.debug(ROUTE, 'Fetching contract for PDF', { contractId: id })

    // Find by contract id or proposalId
    let contract = await prisma.contract.findUnique({ where: { id } }).catch(() => null)
    if (!contract) contract = await prisma.contract.findFirst({ where: { proposalId: id } }).catch(() => null)

    if (!contract) {
      logger.warn(ROUTE, 'Contract not found', { contractId: id })
      return NextResponse.json({ error: 'Contrat non trouvé' }, { status: 404 })
    }

    logger.info(ROUTE, 'Contract found, generating PDF', { contractId: id })

    const pdfBuffer = generateSimplePdf(contract)

    const duration = Date.now() - startTime
    logger.info(ROUTE, 'PDF generated successfully', { contractId: id, duration, size: pdfBuffer.length })

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="contrat-${contract.id}.pdf"`,
        'Cache-Control': 'no-cache'
      }
    })
  } catch (err) {
    const duration = Date.now() - startTime
    logger.error(ROUTE, 'Failed to generate PDF', err as Error, { duration })
    return NextResponse.json({ error: 'Erreur génération PDF' }, { status: 500 })
  }
}
