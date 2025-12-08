import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/api-logger";

/**
 * GET /api/client/contracts/[id]
 * Fetch a single contract
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      return NextResponse.json(
        { error: "Unauthorized: no client ID found" },
        { status: 401 }
      );
    }

    const contractId = params.id;
    logger.info("/api/client/contracts/[id]", "Fetching contract", { contractId, clientId });

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        proposal: {
          select: {
            id: true,
            projectName: true,
            price: true,
            description: true,
            timeline: true,
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (contract.clientId !== clientId) {
      return NextResponse.json(
        { error: "Unauthorized: contract not linked to your account" },
        { status: 403 }
      );
    }

    logger.info("/api/client/contracts/[id]", "Contract fetched successfully", { contractId });

    return NextResponse.json(contract, { status: 200 });
  } catch (error) {
    logger.error("/api/client/contracts/[id]", "Error fetching contract", error as Error);
    return NextResponse.json(
      { error: "Failed to fetch contract" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/client/contracts/[id]
 * Update contract (signature, status, etc.)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      return NextResponse.json(
        { error: "Unauthorized: no client ID found" },
        { status: 401 }
      );
    }

    const contractId = params.id;
    const body = await request.json();
    const { signature, status } = body;

    logger.info("/api/client/contracts/[id]", "Updating contract", { contractId, clientId });

    // Verify ownership
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      select: { clientId: true },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    if (contract.clientId !== clientId) {
      return NextResponse.json(
        { error: "Unauthorized: contract not linked to your account" },
        { status: 403 }
      );
    }

    const updateData: any = {};
    if (signature) {
      // Ensure signature.date exists
      const sig = { ...signature };
      if (!sig.date) sig.date = new Date().toISOString();
      updateData.signature = sig;
      // If signing provided, mark status as signed unless explicitly set
      if (!status) updateData.status = "signed";
    }
    if (status) updateData.status = status;

    const updatedContract = await prisma.contract.update({
      where: { id: contractId },
      data: updateData,
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

    logger.info("/api/client/contracts/[id]", "Contract updated successfully", { contractId });

    return NextResponse.json(updatedContract, { status: 200 });
  } catch (error) {
    logger.error("/api/client/contracts/[id]", "Error updating contract", error as Error);
    return NextResponse.json(
      { error: "Failed to update contract" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/client/contracts/[id]
 * Delete a contract (only if not signed)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      return NextResponse.json(
        { error: "Unauthorized: no client ID found" },
        { status: 401 }
      );
    }

    const contractId = params.id;
    logger.info("/api/client/contracts/[id]", "Deleting contract", { contractId, clientId });

    // Verify ownership
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      select: { clientId: true, status: true },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    if (contract.clientId !== clientId) {
      return NextResponse.json(
        { error: "Unauthorized: contract not linked to your account" },
        { status: 403 }
      );
    }

    // Prevent deletion of signed contracts
    if (contract.status === "signed") {
      return NextResponse.json(
        { error: "Cannot delete a signed contract" },
        { status: 400 }
      );
    }

    await prisma.contract.delete({
      where: { id: contractId },
    });

    logger.info("/api/client/contracts/[id]", "Contract deleted successfully", { contractId });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error("/api/client/contracts/[id]", "Error deleting contract", error as Error);
    return NextResponse.json(
      { error: "Failed to delete contract" },
      { status: 500 }
    );
  }
}
