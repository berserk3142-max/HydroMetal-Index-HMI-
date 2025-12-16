import "server-only";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const apiSecret = process.env.STREAM_API_SECRET!;

export const streamClient = new StreamClient(apiKey, apiSecret);

// Generate a token for a user to join a call
export const generateStreamToken = (userId: string): string => {
  // Token valid for 1 hour
  const expirationTime = Math.floor(Date.now() / 1000) + 3600;
  const issuedAt = Math.floor(Date.now() / 1000) - 60;

  return streamClient.generateUserToken({
    user_id: userId,
    exp: expirationTime,
    iat: issuedAt,
  });
};

// Create or get a call
export const createStreamCall = async (callId: string, createdByUserId: string) => {
  const call = streamClient.video.call("default", callId);
  
  await call.getOrCreate({
    data: {
      created_by_id: createdByUserId,
      members: [{ user_id: createdByUserId, role: "admin" }],
    },
  });

  return call;
};

// Upsert a user in Stream
export const upsertStreamUser = async (user: {
  id: string;
  name: string;
  image?: string;
}) => {
  await streamClient.upsertUsers([
    {
      id: user.id,
      name: user.name,
      image: user.image,
    },
  ]);
};
