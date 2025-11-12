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
const CooldownPeriod = 15 * 60 * 1000;
export async function POST(req: Request) {
  const data = await req.json();
  const { discordId, choice, raiderName } = data;

  if (!discordId || !choice) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const raider = await getRaider(discordId);
  const now = Date.now();

  if (raider?.updatedAt) {
    const lastUpdate = new Date(raider.updatedAt);
    const timeDifference = now - lastUpdate.getTime();
    if (timeDifference < CooldownPeriod) {
      const timeLeft = CooldownPeriod - timeDifference;
      return NextResponse.json(
        {
          error: `Recently updated. Try again in ${Math.ceil(
            timeLeft / 1000
          )} seconds.`,
        },
        {
          status: 429,
          headers: { "Retry-After": Math.ceil(timeLeft / 1000).toString() },
        }
      );
    }
  }

  const doc = await setRaiderChoice(discordId, choice, raiderName);

  return NextResponse.json({ message: "Raider created", doc });
}
