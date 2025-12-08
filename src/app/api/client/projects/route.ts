import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { logger } from "@/lib/api-logger"

const ROUTE = "/api/client/projects"

export async function GET(req: NextRequest) {
  const startTime = Date.now()
  try {
    const url = new URL(req.url)
    const qClientId = url.searchParams.get("clientId")

    let clientId: string | null = qClientId

    // If no clientId query param provided, require an authenticated session
    if (!clientId) {
      const session = await getServerSession(authOptions)
      if (!session || !session.user || !session.user.id) {
        logger.warn(ROUTE, "Unauthorized access to projects", { duration: Date.now() - startTime })
        return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
      }
      clientId = session.user.id
    }

    const clientIdStr = clientId as string
    const projects = await prisma.project.findMany({
      where: { clientId: clientIdStr },
      orderBy: { updatedAt: "desc" },
    })

    logger.info(ROUTE, "Fetched client projects", { clientId, count: projects.length, duration: Date.now() - startTime })
    return NextResponse.json(projects)
  } catch (error) {
    logger.error(ROUTE, "Failed to fetch client projects", error as Error, { duration: Date.now() - startTime })
    return NextResponse.json({ message: "Erreur serveur lors du chargement des projets" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  try {
    const body = await req.json()
    const url = new URL(req.url)
    const qClientId = url.searchParams.get("clientId")

    let clientId: string | null = qClientId || (body?.clientId ?? null)

    if (!clientId) {
      const session = await getServerSession(authOptions)
      if (!session || !session.user || !session.user.id) {
        logger.warn(ROUTE, "Unauthorized create project", { duration: Date.now() - startTime })
        return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
      }
      clientId = session.user.id
    }

    // Build a project payload from body with sensible defaults
    const payload: any = {
      name: body.name || body.projectName || "Nouveau projet",
      description: body.description || "",
      status: body.status || "planning",
      progress: typeof body.progress === "number" ? body.progress : 0,
      startDate: body.startDate ? new Date(body.startDate) : new Date(),
      // Prisma Project.endDate is NOT nullable, provide a default (30 days from start)
      endDate: body.endDate ? new Date(body.endDate) : new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
      // Prisma Project.budget is NOT nullable, default to 0 (in cents)
      budget: typeof body.budget === "number" ? body.budget : 0,
      spent: 0,
      // Prisma requires the client relation to be explicitly set for Project.create()
      // Do NOT include clientId in the data object; Prisma will infer it from the client relation
      client: { connect: { id: clientId } },
    }

    try {
      // Ensure the client exists (for dev/test with clientId query param, create if missing)
      const clientExists = await prisma.client.findUnique({ where: { id: clientId } })
      if (!clientExists && clientId === "test-client") {
        // Create a dummy test client if it doesn't exist
        await prisma.client.create({
          data: {
            id: "test-client",
            email: "test@test.local",
            passwordHash: "test",
            company: "Test Company",
            contactName: "Test Contact",
            phone: "+33600000000",
            country: "FR",
          },
        })
      }

      const created = await prisma.project.create({ data: payload })
      logger.info(ROUTE, "Created project via Prisma", { clientId, id: created.id, duration: Date.now() - startTime })
      return NextResponse.json(created, { status: 201 })
    } catch (err: any) {
      logger.error(ROUTE, "Failed to create project via Prisma", err as Error, { duration: Date.now() - startTime })
      throw err
    }
  } catch (error) {
    logger.error(ROUTE, "Failed to create project", error as Error, { duration: Date.now() - startTime })
    return NextResponse.json({ message: "Erreur serveur lors de la création du projet" }, { status: 500 })
  }
}
