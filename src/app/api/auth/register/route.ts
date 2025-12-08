import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: NextRequest) {
  try {
    const { email, password, company, contactName, phone, country } = await req.json()
    if (!email || !password || !company || !contactName || !phone || !country) {
      return NextResponse.json({ message: "Tous les champs sont obligatoires." }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ message: "Le mot de passe doit contenir au moins 8 caractères." }, { status: 400 })
    }
    const existing = await prisma.client.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ message: "Cet email est déjà utilisé." }, { status: 400 })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    await prisma.client.create({
      data: {
        email,
        passwordHash,
        company,
        contactName,
        phone,
        country,
        status: "active"
      }
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 })
  }
}
