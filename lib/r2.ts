import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { gzipSync, gunzipSync } from "zlib";
import { Readable } from "stream";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadResponseToR2(userId: string, filename: string, body: string) {
  const key = `${userId}/${Date.now()}-${filename}`;
  const gz = gzipSync(Buffer.from(body, "utf-8"));

  await r2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: gz,
    ContentEncoding: "gzip",
    ContentType: "application/json; charset=utf-8",
  }));

  return key;
}

export async function getPresignedUrlForKey(key: string, expiresInSeconds = 60) {
  const cmd = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(r2, cmd, { expiresIn: expiresInSeconds });
}

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  if (!stream) return Buffer.from([]);
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function getObjectStringFromR2(key: string): Promise<string> {
  const res = await r2.send(new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  }));
   if (!res.Body) {
    throw new Error(`No body returned for key: ${key}`);
  }

  const stream = res.Body instanceof Readable 
    ? res.Body 
    : Readable.from(res.Body as unknown as AsyncIterable<Uint8Array>);
  

  const buf = await streamToBuffer(stream);
  try {
    if (buf.length >= 2 && buf[0] === 0x1f && buf[1] === 0x8b) {
      return gunzipSync(buf).toString("utf-8");
    }
  } catch (e) {
    console.error("Failed to gunzip response:", e);
  }
  return buf.toString("utf-8");
}
