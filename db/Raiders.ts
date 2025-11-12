import clientPromise from "@/lib/mongodb";

type RaiderDoc = {
  discordId: string;
  raiderName: string;
  choice?: string | null;
  changeCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

const DB_NAME = "ClassLockIn";
const COLLECTION = "Raiders";

export async function getRaider(discordId: string) {
  const client = await clientPromise;
  console.log(client);
  const db = client.db(DB_NAME);
  const col = db.collection<RaiderDoc>(COLLECTION);
  return col.findOne({ discordId }, { projection: { _id: 0 } });
}

export async function getAllRaiders() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const col = db.collection<RaiderDoc>(COLLECTION);
  //gets all the raiders and removes the internal _id field
  return col.find({}, { projection: { _id: 0 } }).toArray();
}
/**
 * Atomically upserts the raider's choice and increments changeCount
 * only when the new choice is different from the current one.
 */
export async function setRaiderChoice(
  discordId: string,
  newChoice: string,
  raiderName?: string
) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const col = db.collection<RaiderDoc>(COLLECTION);

  // Safe to run repeatedly; ensures one doc per user
  await col.createIndex({ discordId: 1 }, { unique: true });

  const now = new Date();
  const res = await col.findOneAndUpdate(
    { discordId },
    [
      {
        $set: {
          changeCount: {
            $cond: [
              { $eq: ["$choice", newChoice] },
              { $ifNull: ["$changeCount", 0] },
              {
                $add: [
                  { $ifNull: ["$changeCount", 0] },
                  { $cond: [{ $eq: ["$choice", null] }, 0, 1] },
                ],
              },
            ],
          },
          choice: newChoice,
          updatedAt: now,
          createdAt: { $ifNull: ["$createdAt", now] },
          ...(raiderName
            ? { raiderName: { $ifNull: ["$name", raiderName] } }
            : {}),
        },
      },
    ],
    {
      upsert: true,
      returnDocument: "after",
      projection: { _id: 0 },
    }
  );

  return res as RaiderDoc;
}
