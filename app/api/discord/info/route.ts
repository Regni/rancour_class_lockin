import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (res.status === 404) {
    return NextResponse.json({ inGuild: false });
  }
  if (res.status === 401 || res.status === 403) {
    return NextResponse.json(
      { error: `Discord ${res.status} (bad/expired token or missing scope)` },
      { status: res.status }
    );
  }
  if (!res.ok) {
    return NextResponse.json(
      { error: `Discord error ${res.status}` },
      { status: res.status }
    );
  }

  const member = await res.json();
  const nickname = member.nick;
  const discordId = member.user?.id;
  const isRaider =
    Array.isArray(member.roles) && member.roles.includes(raiderRoleId);
  const isOfficer =
    Array.isArray(member.roles) && member.roles.includes(officerRoleId);

  return NextResponse.json({
    inGuild: true,
    isRaider,
    isOfficer,
    nickname,
    discordId,
  });
}
