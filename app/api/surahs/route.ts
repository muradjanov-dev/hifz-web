import { NextResponse } from "next/server";
import { ApiError, botFetch } from "@/lib/api";

export const revalidate = 3600; // 1h — surah list is static

export async function GET() {
  try {
    const data = await botFetch("/api/surahs", { next: { revalidate: 3600 } });
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
