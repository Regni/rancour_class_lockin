"use client";
import React, { use, useEffect, useState } from "react";

const PlayerChoiceForm = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [playerInfo, setPlayerInfo] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleCheck = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/discord/test");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const playerData = async () => {
    try {
      const res = await fetch("/api/discord/test");
      const data = await res.json();
      if (!data.inGuild || !data.isRaider) {
        setErrorMessage(
          "You are not a member of the guild or do not have the raider rank."
        );
        return;
      }

      const resDB = await fetch(`/api/data/raiders?id=${data.discordId}`);
      const dbData = await resDB.json();
      console.log("DB Data:", dbData);
      setPlayerInfo({ ...data, dbInfo: dbData[0] });
      setSelectedClass(dbData[0].choice);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    playerData();
  }, []);

  useEffect(() => {
    console.log("Player Info Updated:", playerInfo);
    console.log("Selected Class:", selectedClass);
  }, [playerInfo]);

  const [selectedClass, setSelectedClass] = useState("Druid");

  const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(event.target.value);
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCheck();
        }}
      >
        <label>
          Which class are you planning on playing in Midnight?
          <select
            value={selectedClass}
            onChange={handleClassChange}
            className="p-2 my-1 rounded block border"
          >
            <option className="text-black" value="DeathKnight">
              Death Knight
            </option>
            <option className="text-black" value="DemonHunter">
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
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded block mt-2"
          type="submit"
        >
          save
        </button>
      </form>
    </div>
  );
};

export default PlayerChoiceForm;
