import Test from "./testItem";
import DiscordCheckPage from "./DiscordCheckPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LoginButtons from "../components/client_components/LoginButtons";
import LogoutButtons from "../components/client_components/LogoutButtons";
import PlayerChoiceForm from "@/components/client_components/PlayerChoiceForm";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log("Session:", session);
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <header className="absolute top-4 right-4">
        <div>
          {session ? (
            <div>
              <img
                src={session.user?.image || ""}
                alt="User Avatar"
                className="inline-block h-8 w-8 rounded-full mr-2"
              />
              <span className="mr-2 text-lg">
                Signed in as {session.user?.name}
              </span>{" "}
              <LogoutButtons />
            </div>
          ) : (
            <LoginButtons />
          )}
        </div>
      </header>

      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <PlayerChoiceForm />
        <DiscordCheckPage />
      </main>
    </div>
  );
}
