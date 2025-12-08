import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { logger } from "@/lib/api-logger"

const ROUTE = "/api/client/profile"

// GET /api/client/profile - Get client profile
export async function GET(req: NextRequest) {
  const startTime = Date.now()
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.id) {
      logger.warn(ROUTE, "Unauthorized access", { duration: Date.now() - startTime })
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const client = await prisma.client.findUnique({
      where: { id: session.user.id },
      select: { email: true, company: true, contactName: true, phone: true, country: true, website: true },
    })

    if (!client) {
      logger.warn(ROUTE, "Client profile not found", { clientId: session.user.id, duration: Date.now() - startTime })
      return NextResponse.json({ message: "Profil client introuvable" }, { status: 404 })
    }

    logger.info(ROUTE, "Client profile fetched successfully", { clientId: session.user.id, duration: Date.now() - startTime })
    return NextResponse.json(client)
  } catch (error) {
    logger.error(ROUTE, "Failed to fetch client profile", error as Error, { duration: Date.now() - startTime })
    return NextResponse.json({ message: "Erreur serveur lors du chargement du profil" }, { status: 500 })
  }
}

// PUT /api/client/profile - Update client profile
export async function PUT(req: NextRequest) {
  const startTime = Date.now()
  const session = await getServerSession(authOptions)

  try {
    if (!session || !session.user || !session.user.id) {
      logger.warn(ROUTE, "Unauthorized access to update profile", { duration: Date.now() - startTime })
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const body = await req.json()
    const { company, contactName, phone, country, website } = body

    if (!company || !contactName || !phone || !country) {
      return NextResponse.json({ message: "Les champs obligatoires sont manquants." }, { status: 400 })
    }

    const updatedClient = await prisma.client.update({
      where: { id: session.user.id },
      data: {
        company,
        contactName,
        phone,
        country,
        website: website || null,
        updatedAt: new Date(),
      },
      select: { email: true, company: true, contactName: true, phone: true, country: true, website: true },
    })

    logger.info(ROUTE, "Client profile updated successfully", { clientId: session.user.id, duration: Date.now() - startTime })
    return NextResponse.json(updatedClient)
  } catch (error) {
    const clientId = session?.user?.id || "unknown"
    logger.error(ROUTE, "Failed to update client profile", error as Error, { clientId, duration: Date.now() - startTime })
    return NextResponse.json({ message: "Erreur serveur lors de la mise à jour du profil" }, { status: 500 })
  }
}
