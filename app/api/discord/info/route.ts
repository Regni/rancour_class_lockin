import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function noStoreJson(body: any, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, private, max-age=0, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      Vary: "Cookie",
      "Netlify-CDN-Cache-Control": "no-store",
      "CDN-Cache-Control": "no-store",
    },
  });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const accessToken = (session as any)?.accessToken as string | undefined;

  if (!accessToken) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const guildId = process.env.RANCOUR_GUILD_ID!;
  const raiderRoleId = process.env.RANCOUR_RAIDER_ROLE_ID!;
  const officerRoleId = process.env.RANCOUR_OFFICER_ROLE_ID!;

  const res = await fetch(
    `https://discord.com/api/v10/users/@me/guilds/${guildId}/member`,
    { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" }
  );

  if (res.status === 404) {
    return noStoreJson({ inGuild: false });
  }
  if (res.status === 401 || res.status === 403) {
    return noStoreJson(
      { error: `Discord ${res.status} (bad/expired token or missing scope)` },
      res.status
    );
  }
  if (!res.ok) {
    return noStoreJson({ error: `Discord error ${res.status}` }, res.status);
  }

  const member = await res.json();
  const nickname = member.nick;
  const discordId = member.user?.id;
  const isRaider =
    Array.isArray(member.roles) && member.roles.includes(raiderRoleId);
  const isOfficer =
    Array.isArray(member.roles) && member.roles.includes(officerRoleId);

  return noStoreJson({
    inGuild: true,
    isRaider,
    isOfficer,
    nickname,
    discordId,
  });
}
