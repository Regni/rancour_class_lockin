"use client";
import React from "react";
import { signIn } from "next-auth/react";
const testItem = () => {
  return (
    <div>
      <button onClick={() => signIn("discord")}>Sign in with Discord</button>
    </div>
  );
};

export default testItem;
