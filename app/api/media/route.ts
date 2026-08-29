import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "PlayIT Sahara Media Hub",
    deployedOn: "Vercel",
    timestamp: new Date().toISOString(),
  });
}
