import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const created = await prisma.contact.create({ data: {
      name: body.name || '',
      email: body.email || '',
      phone: body.phone || null,
      company: body.company || null,
      subject: body.subject || 'Contact',
      message: body.message || ''
    }})

    return new Response(JSON.stringify({ success: true, id: created.id }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }
}
