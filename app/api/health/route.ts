import { NextResponse } from "next/server";
import { APP_CONFIG, HTTP_STATUS } from "@constants/index";

export async function GET() {
  return NextResponse.json(
    {
      status: "healthy",
      service: APP_CONFIG.name,
      version: APP_CONFIG.version,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    },
    { status: HTTP_STATUS.OK },
  );
}
