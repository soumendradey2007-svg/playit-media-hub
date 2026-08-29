import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    version: "2.0.0",
    message: "Playlist API ready for cloud sync",
  });
}
