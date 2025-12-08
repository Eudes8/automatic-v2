import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import PDFDocument from "pdfkit";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const searchParams = new URL(request.url).searchParams;
    const clientIdParam = searchParams.get("clientId");

    // Resolve clientId (session or query param for tests)
    const clientId = session?.user?.email
      ? (
          await prisma.client.findUnique({ where: { email: session.user.email }, select: { id: true } })
        )?.id
      : clientIdParam;

    if (!clientId) {
      return new Response(JSON.stringify({ error: "Unauthorized: no client ID found" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    // In Next.js app router dynamic API routes, `params` can be a promise-like — await before use
    // to avoid the runtime error: "params should be awaited before using its properties"
    const resolvedParams = await params as any;
    const contractId = resolvedParams.id;
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { proposal: true },
    });

    if (!contract) {
      return new Response(JSON.stringify({ error: "Contract not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    if (contract.clientId !== clientId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403, headers: { "Content-Type": "application/json" } });
    }

    // Generate PDF by rendering an HTML template and using Puppeteer to export to PDF.
    // This avoids pdfkit AFM/font issues in the dev container.
    // Generate PDF using pdf-lib (pure JS, no native deps)
    const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 points
    const { width, height } = page.getSize();
    const margin = 40;

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSizeTitle = 18;
    const fontSizeNormal = 11;

    let y = height - margin;

    // Title
    page.drawText(contract.title || 'Contrat', { x: margin, y: y - fontSizeTitle, size: fontSizeTitle, font });
    y -= fontSizeTitle + 8;
    page.drawText(`Créé le: ${new Date(contract.createdAt).toLocaleString('fr-FR')}`, { x: margin, y: y - 10, size: 10, font, color: rgb(0.4,0.4,0.4) });
    y -= 22;

    const clientInfo = (contract.clientInfo as any) || {};
    page.drawText('Informations client', { x: margin, y: y - fontSizeNormal, size: fontSizeNormal, font });
    y -= 16;
    page.drawText(`Entreprise: ${clientInfo.company || '-'}`, { x: margin, y: y - fontSizeNormal, size: fontSizeNormal, font });
    y -= 14;
    page.drawText(`Contact: ${clientInfo.contact || '-'}`, { x: margin, y: y - fontSizeNormal, size: fontSizeNormal, font });
    y -= 14;
    page.drawText(`Email: ${clientInfo.email || '-'}`, { x: margin, y: y - fontSizeNormal, size: fontSizeNormal, font });
    y -= 14;
    page.drawText(`Téléphone: ${clientInfo.phone || '-'}`, { x: margin, y: y - fontSizeNormal, size: fontSizeNormal, font });
    y -= 20;

    const projectInfo = (contract.projectInfo as any) || {};
    page.drawText('Informations projet', { x: margin, y: y - fontSizeNormal, size: fontSizeNormal, font });
    y -= 16;
    page.drawText(`Nom: ${projectInfo.name || '-'}`, { x: margin, y: y - fontSizeNormal, size: fontSizeNormal, font });
    y -= 14;
    page.drawText(`Description: ${projectInfo.description || '-'}`, { x: margin, y: y - fontSizeNormal, size: fontSizeNormal, font });
    y -= 14;
    page.drawText(`Montant: ${projectInfo.price ? (projectInfo.price/100).toLocaleString('fr-FR',{style:'currency',currency:'EUR'}) : '-'}`, { x: margin, y: y - fontSizeNormal, size: fontSizeNormal, font });
    y -= 14;
    page.drawText(`Timeline: ${projectInfo.timeline || '-'}`, { x: margin, y: y - fontSizeNormal, size: fontSizeNormal, font });
    y -= 20;

    // Terms simple render
    const terms = (contract.terms as any) || {};
    page.drawText('Conditions', { x: margin, y: y - fontSizeNormal, size: fontSizeNormal, font });
    y -= 14;
    if (Array.isArray(terms.deliverables) && terms.deliverables.length) {
      page.drawText('Livrables:', { x: margin + 10, y: y - fontSizeNormal, size: fontSizeNormal, font });
      y -= 14;
      for (const d of terms.deliverables) {
        page.drawText(`• ${String(d)}`, { x: margin + 18, y: y - fontSizeNormal, size: fontSizeNormal, font });
        y -= 12;
      }
    }
    if (Array.isArray(terms.paymentSchedule) && terms.paymentSchedule.length) {
      y -= 6;
      page.drawText('Échéancier:', { x: margin + 10, y: y - fontSizeNormal, size: fontSizeNormal, font });
      y -= 14;
      for (const p of terms.paymentSchedule) {
        page.drawText(`• ${String(p)}`, { x: margin + 18, y: y - fontSizeNormal, size: fontSizeNormal, font });
        y -= 12;
      }
    }

    // Signature
    const sig = (contract.signature as any) || null;
    if (sig && sig.image) {
      try {
        const imgSrc = sig.image as string;
        const base64 = imgSrc.startsWith('data:') ? imgSrc.split(',')[1] : imgSrc;
        const imageBytes = Buffer.from(base64, 'base64');
        let embeddedImage;
        // detect png/jpg by header
        if (imageBytes[0] === 0x89) {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        }
        const imgDims = embeddedImage.scale(0.5);
        page.drawImage(embeddedImage, { x: margin, y: y - 90, width: imgDims.width, height: imgDims.height });
        page.drawText(`${sig.name || ''} — ${sig.title || ''}`, { x: margin + imgDims.width + 10, y: y - 40, size: fontSizeNormal, font });
        y -= imgDims.height + 14;
      } catch (e) {
        // fallback to text
        page.drawText(`${sig.name || ''} — ${sig.title || ''}`, { x: margin, y: y - fontSizeNormal, size: fontSizeNormal, font });
        y -= 16;
      }
    } else {
      page.drawText('(Non signé)', { x: margin, y: y - fontSizeNormal, size: fontSizeNormal, font, color: rgb(0.5,0.5,0.5) });
      y -= 16;
    }

    const pdfBytes = await pdfDoc.save();
    return new Response(Buffer.from(pdfBytes) as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="contract-${contractId}.pdf"`,
      },
    });
  } catch (error) {
    // log error to console for dev debugging
    // eslint-disable-next-line no-console
    console.error('PDF generation error:', error);
    return new Response(JSON.stringify({ error: "Failed to generate PDF", details: String(error) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
