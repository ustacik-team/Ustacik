import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "private_demo_key";
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "public_demo_key";

    const { token, expire, signature } = getUploadAuthParams({
      privateKey,
      publicKey,
    });

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey,
    });
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload authentication parameters" },
      { status: 500 }
    );
  }
}
