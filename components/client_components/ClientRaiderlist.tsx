"use client";
import { RaiderDoc } from "@/db/Raiders";
import { useState, useEffect } from "react";
import PlayerChoiceForm from "./PlayerChoiceForm";

const ClientRaiderList = ({
  raiders,
  discordName,
}: {
  raiders: RaiderDoc[];
  discordName: string;
}) => {
  const [raiderList, setRaiderList] = useState(raiders);
  const [raiderChoice, setRaiderChoice] = useState<RaiderDoc | null>(null);
  const classImg = (classChoice: string) => {
    //return class icon based on raider choice
    switch (classChoice) {
      case "Death Knight":
        return "https://wow.zamimg.com/images/wow/icons/large/classicon_deathknight.jpg";
      case "Demon Hunter":
        return "https://wow.zamimg.com/images/wow/icons/large/classicon_demonhunter.jpg";
      case "Druid":
        return "https://wow.zamimg.com/images/wow/icons/large/classicon_druid.jpg";
      case "Evoker":
        return "https://wow.zamimg.com/images/wow/icons/large/classicon_evoker.jpg";
      case "Hunter":
        return "https://wow.zamimg.com/images/wow/icons/large/classicon_hunter.jpg";
      case "Mage":
        return "https://wow.zamimg.com/images/wow/icons/large/classicon_mage.jpg";
      case "Monk":
        return "https://wow.zamimg.com/images/wow/icons/large/classicon_monk.jpg";
      case "Paladin":
        return "https://wow.zamimg.com/images/wow/icons/large/classicon_paladin.jpg";
      case "Priest":
        return "https://wow.zamimg.com/images/wow/icons/large/classicon_priest.jpg";
      case "Rogue":
        return "https://wow.zamimg.com/images/wow/icons/large/classicon_rogue.jpg";
      case "Shaman":
        return "https://wow.zamimg.com/images/wow/icons/large/classicon_shaman.jpg";
      case "Warlock":
        return "https://wow.zamimg.com/images/wow/icons/large/classicon_warlock.jpg";
      case "Warrior":
        return "https://wow.zamimg.com/images/wow/icons/large/classicon_warrior.jpg";
      case "Reroll Extraordinaire!":
        return "/BrentFace.png";
      // question mark for unknown class or no choice
      default:
        return "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
    }
  };

  useEffect(() => {
    if (!raiderChoice) return;
    setRaiderList((prevList) => {
      const existingRaider = prevList.some(
        (raider) => raider.discordId === raiderChoice.discordId
      );

      if (existingRaider) {
        return prevList.map((raider) =>
          raider.discordId === raiderChoice.discordId ? raiderChoice : raider
        );
      }
      return [...prevList, raiderChoice];
    });
  }, [raiderChoice]);

  return (
    <div className="flex flex-col">
      <PlayerChoiceForm
        discordName={discordName}
        setRaiderChoice={setRaiderChoice}
      />
      <div className="mt-10 w-full flex flex-col items-center">
        <h2 className="text-2xl mb-2">Raider Choices</h2>
        <table className="table-auto border-collapse border grow w-60 border-gray-400">
          <thead>
            <tr className="border-b">
              <th className="text-left p-1">Icon</th>
              <th className="text-left p-1">Raider</th>
              <th className="text-left p-1">Choice</th>
            </tr>
          </thead>
          <tbody>
            {raiderList.map((raider) => (
              <tr
                className="border-b border-gray-600 border-dashed"
                key={raider.discordId}
              >
                <td className="p-1">
                  <img
                    src={classImg(raider.choice || "unknown")}
                    alt={"class Icon"}
                    className="h-6 w-6"
                  />
                </td>
                <td>{raider.raiderName}</td>
                <td>{raider.choice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientRaiderList;
