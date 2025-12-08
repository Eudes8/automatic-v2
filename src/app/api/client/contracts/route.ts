import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/api-logger";

/**
 * GET /api/client/contracts
 * List all contracts for the authenticated client
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const searchParams = request.nextUrl.searchParams;
    const clientIdParam = searchParams.get("clientId");

    // Resolve clientId: from session or query param (for testing)
    const clientId = session?.user?.email
      ? (
          await prisma.client.findUnique({
            where: { email: session.user.email },
            select: { id: true },
          })
        )?.id
      : clientIdParam;

    if (!clientId) {
      logger.error("/api/client/contracts", "No client ID found", undefined, { session });
      return NextResponse.json(
        { error: "Unauthorized: no client ID found" },
        { status: 401 }
      );
    }

    logger.info("/api/client/contracts", "Fetching contracts for client", { clientId });

    const contracts = await prisma.contract.findMany({
      where: { clientId },
      include: {
        proposal: {
          select: {
            id: true,
            projectName: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    logger.info("/api/client/contracts", "Contracts fetched successfully", {
      clientId,
      count: contracts.length,
    });

    return NextResponse.json(contracts, { status: 200 });
  } catch (error) {
    logger.error("/api/client/contracts", "Error fetching contracts", error as Error);
    return NextResponse.json(
      { error: "Failed to fetch contracts" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/client/contracts
 * Create a new contract (admin operation via proposalId)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const searchParams = request.nextUrl.searchParams;
    const clientIdParam = searchParams.get("clientId");

    // Resolve clientId
    const clientId = session?.user?.email
      ? (
          await prisma.client.findUnique({
            where: { email: session.user.email },
            select: { id: true },
          })
        )?.id
      : clientIdParam;

    if (!clientId) {
      logger.error("/api/client/contracts (POST)", "No client ID found for contract creation", undefined, { session });
      return NextResponse.json(
        { error: "Unauthorized: no client ID found" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { proposalId, title, clientInfo, projectInfo, terms } = body;

    if (!proposalId || !title) {
      return NextResponse.json(
        { error: "proposalId and title are required" },
        { status: 400 }
      );
    }

    logger.info("/api/client/contracts", "Creating contract", { clientId, proposalId, title });

    // Verify proposal exists and is linked to client
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
    });

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    if (proposal.clientId && proposal.clientId !== clientId) {
      return NextResponse.json(
        { error: "Unauthorized: proposal not linked to your account" },
        { status: 403 }
      );
    }

    const contract = await prisma.contract.create({
      data: {
        proposalId,
        clientId,
        title,
        clientInfo: clientInfo || {
          company: proposal.company,
          contact: proposal.email,
          email: proposal.email,
          phone: proposal.phone,
        },
        projectInfo: projectInfo || {
          name: proposal.projectName,
          description: proposal.description,
          price: proposal.price,
          timeline: proposal.timeline,
        },
        terms: terms || {
          deliverables: [],
          paymentSchedule: [],
          responsibilities: [],
        },
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      },
      include: {
        proposal: {
          select: {
            id: true,
            projectName: true,
            price: true,
          },
        },
      },
    });

    logger.info("/api/client/contracts", "Contract created successfully", { contractId: contract.id });

    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    logger.error("/api/client/contracts", "Error creating contract", error as Error);
    return NextResponse.json(
      { error: "Failed to create contract" },
      { status: 500 }
    );
  }
}
