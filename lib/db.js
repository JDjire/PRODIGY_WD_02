import mongoose from "mongoose";

const g = globalThis;

let cached = g.mongoose;

if (!cached) {
  cached = g.mongoose = { conn: null, promise: null };
}

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri || !String(uri).trim()) {
    throw new Error(
      "MONGODB_URI is not set. Copy .env.example to .env.local in the project root, set MONGODB_URI (and NEXTAUTH_* / ADMIN_* for seed), then restart the dev server."
    );
  }
  return String(uri).trim();
}

export async function connectDB() {
  const MONGODB_URI = getMongoUri();

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
