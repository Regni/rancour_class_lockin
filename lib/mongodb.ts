import { MongoClient } from "mongodb";

const DATABASE_URL = process.env.DATABASE_URL!;
const options = {};

declare global {
  // var is used here to prevent errors in developement mode with hot reloading
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(DATABASE_URL, options);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;
export default clientPromise;
