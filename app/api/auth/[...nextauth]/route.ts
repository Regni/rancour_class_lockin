import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import type { Session } from "next-auth";

interface ExtendedSession extends Session {
  accessToken?: string;
}

export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        url: "https://discord.com/api/oauth2/authorize",
        params: { scope: "identify guilds.members.read" },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        (token as any).accessToken = account.access_token;
        (token as any).provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      const extended: ExtendedSession = {
        ...session,
        accessToken: (token as any).accessToken as string | undefined,
      };
      return extended;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
