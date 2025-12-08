import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const convId = params.id;
    const messages = await prisma.message.findMany({ where: { conversationId: convId }, orderBy: { timestamp: "asc" } });
    return NextResponse.json(messages, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const convId = params.id;
    const body = await req.json();
    const { content, senderName, senderId, clientId } = body;
    if (!content || !senderName || !senderId) return NextResponse.json({ error: "missing fields" }, { status: 400 });

    const msg = await prisma.message.create({ data: { conversationId: convId, content, senderName, senderId, clientId: clientId || null } });
    return NextResponse.json(msg, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
  }
}
