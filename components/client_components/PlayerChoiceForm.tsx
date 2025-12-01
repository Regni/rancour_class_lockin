"use client";

import React, { useEffect, useState } from "react";
import { discordCache } from "@/lib/discordCashe";

const PlayerChoiceForm = ({
  discordName,
  setRaiderChoice,
}: {
  discordName: string;
  setRaiderChoice?: any;
}) => {
  const [loading, setLoading] = useState(false);
  const [playerInfo, setPlayerInfo] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState("Druid");
  const [cooldown, setCooldown] = useState<number>(0);
  const [canSubmit, setCanSubmit] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/data/raiders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discordId: playerInfo.discordId,
          choice: selectedClass,
          raiderName: playerInfo.nickname || discordName,
        }),
      });
      if (res.status === 429) {
        const retryAfter = res.headers.get("Retry-After");
        if (retryAfter) {
          setCooldown(parseInt(retryAfter, 10) * 1000);
          setCanSubmit(false);
          return;
        }
      }
      setCooldown(59 * 1000);
      setCanSubmit(false);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
      setRaiderChoice({
        discordId: playerInfo.discordId,
        choice: selectedClass,
        raiderName: playerInfo.nickname || discordName,
      });
    }
  };

  const playerData = async () => {
    try {
      const data = await discordCache();
      if (!data.inGuild || !data.isRaider) {
        setErrorMessage(
          "You are not a member of the guild or do not have the raider rank."
        );
        return;
      }

      const resDB = await fetch(`/api/data/raiders?id=${data.discordId}`, {
        cache: "no-store",
        credentials: "include",
      });
      const dbData = await resDB.json();
      if (!dbData) {
        setPlayerInfo({ ...data, dbInfo: null });
        setCanSubmit(true);
        return;
      }

      setPlayerInfo({ ...data, dbInfo: dbData });
      setSelectedClass(dbData.choice);

      const lastUpdate = new Date(dbData.updatedAt);
      const now = Date.now();
      const timeDifference = now - lastUpdate.getTime();
      const cooldown = 59 * 1000;
      if (timeDifference < cooldown) {
        const timeLeft = cooldown - timeDifference;
        setCanSubmit(false);
        setCooldown(timeLeft);
        return;
      }

      setCanSubmit(false);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    playerData();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!canSubmit && cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1000) {
            clearInterval(timer);
            setCanSubmit(true);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown, canSubmit]);

  const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(event.target.value);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);

    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  return (
    <div>
      {errorMessage ? (
        <p className="text-red-600 font-bold">{errorMessage}</p>
      ) : canSubmit ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <label>
            Which class are you planning on playing in Midnight?
            <select
              value={selectedClass}
              onChange={handleClassChange}
              className="p-2 my-1 rounded block border"
            >
              <option className="text-black" value="Death Knight">
                Death Knight
              </option>
              <option className="text-black" value="Demon Hunter">
                Demon Hunter
              </option>
              <option className="text-black" value="Druid">
                Druid
              </option>
              <option className="text-black" value="Evoker">
                Evoker
              </option>
              <option className="text-black" value="Hunter">
                Hunter
              </option>
              <option className="text-black" value="Mage">
                Mage
              </option>
              <option className="text-black" value="Monk">
                Monk
              </option>
              <option className="text-black" value="Paladin">
                Paladin
              </option>
              <option className="text-black" value="Priest">
                Priest
              </option>
              <option className="text-black" value="Rogue">
                Rogue
              </option>
              <option className="text-black" value="Shaman">
                Shaman
              </option>
              <option className="text-black" value="Warlock">
                Warlock
              </option>
              <option className="text-black" value="Warrior">
                Warrior
              </option>
            </select>
          </label>
          <button
            disabled={!canSubmit || loading}
            className={`${
              canSubmit
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            } text-white px-4 py-2 rounded block mt-2`}
            type="submit"
          >
            {canSubmit ? (loading ? "Saving..." : "Save") : `Locked in!`}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <p className="text-2xl">You are locked in!</p>
          <p className="mb-4 italic text-sm text-gray-300">
            (Message Regni if there is an issue with already being locked in)
          </p>
        </div>
      )}
    </div>
  );
};

export default PlayerChoiceForm;
