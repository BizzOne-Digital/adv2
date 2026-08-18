import mongoose from "mongoose";
import { getEnv, validateProductionEnv } from "@/lib/env";

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const cached = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  validateProductionEnv();
  const { mongodbUri } = getEnv();

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongodbUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}
