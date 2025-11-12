"use client";
import { signIn } from "next-auth/react";

const LoginButtons = () => {
  return (
    <button
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
      onClick={() => signIn("discord")}
    >
      Sign in with Discord
    </button>
  );
};

export default LoginButtons;
