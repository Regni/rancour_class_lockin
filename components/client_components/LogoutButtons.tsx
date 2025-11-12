"use client";
import { signOut } from "next-auth/react";
const LogoutButtons = () => {
  return (
    <button
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
      onClick={() => signOut()}
    >
      sign off
    </button>
  );
};

export default LogoutButtons;
