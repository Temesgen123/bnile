import mongoose from 'mongoose';

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDataBase = async (
  MONGOGB_URI = process.env.MONGODB_URI
) => {
  if (cached.conn) return cached.conn;
  if (!MONGOGB_URI) throw new Error('MONGODB_URI is missing.');
  cached.promise = cached.promise || mongoose.connect(MONGOGB_URI);
  cached.conn = await cached.promise;
  return cached.conn;
};
