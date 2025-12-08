import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const searchParams = req.nextUrl.searchParams;
    const clientIdParam = searchParams.get("clientId");

    const clientId = session?.user?.email
      ? (await prisma.client.findUnique({ where: { email: session.user.email }, select: { id: true } }))?.id
      : clientIdParam;

    if (!clientId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const convs = await prisma.conversation.findMany({ where: {}, orderBy: { createdAt: "desc" }, take: 50 });

    return NextResponse.json(convs, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { title, type } = body;

    if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

    const conv = await prisma.conversation.create({ data: { title, type: type || "client" } });

    return NextResponse.json(conv, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
  }
}
