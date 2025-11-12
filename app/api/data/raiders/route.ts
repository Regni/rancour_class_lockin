import { getAllRaiders, getRaider, setRaiderChoice } from "@/db/Raiders";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const discordId = searchParams.get("discordId");

  if (discordId) {
    const raider = await getRaider(discordId);
    return NextResponse.json(raider);
  }

  const raiders = await getAllRaiders();
  return NextResponse.json(raiders);
}

export async function POST(req: Request) {
  const data = await req.json();

  return NextResponse.json({ message: "Raider created", data });
}
