"use client";

import { useState } from "react";

export default function DiscordCheckPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/discord/test");
      const data = await res.json();
      console.log("Discord check result:", data);
      setResult(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Discord Raider Role Check</h1>
      <button
        onClick={handleCheck}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Checking..." : "Check My Role"}
      </button>

      {result && (
        <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
      <p className="text-gray-500">
        (Open your browser console to see the raw API result too)
      </p>
    </main>
  );
}
