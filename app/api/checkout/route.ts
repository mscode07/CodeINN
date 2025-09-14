export const runtime = "edge";

import { NextResponse } from "next/server";

const POLAR_BASE =
  process.env.POLAR_SERVER === "sandbox"
    ? "https://sandbox-api.polar.sh/v1"
    : "https://api.polar.sh/v1";

const AMOUNT_TO_PRODUCT: Record<number, string | undefined> = {
  5: process.env.POLAR_PRODUCT_5_ID,
  10: process.env.POLAR_PRODUCT_10_ID,
  20: process.env.POLAR_PRODUCT_20_ID,
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const amount = Number(url.searchParams.get("amount"));
    if (!amount || ![5, 10, 20].includes(amount)) {
      return NextResponse.json(
        { error: "Invalid amount. Must be 5, 10, or 20" },
        { status: 400 }
      );
    }

    const productId = AMOUNT_TO_PRODUCT[amount];
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID not found for amount" },
        { status: 400 }
      );
    }

    if (!process.env.POLAR_ACCESS_TOKEN) {
      console.error("POLAR_ACCESS_TOKEN is missing");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}${
      process.env.POLAR_SUCCESS_PATH ?? "/supportUs/thankyou"
    }?checkout_id={CHECKOUT_ID}`;
    const cancelUrl = `${
      process.env.NEXT_PUBLIC_APP_URL ?? ""
    }/supportUs?cancelled=1`;

    const body = {
      product_ids: [productId],
      success_url: successUrl,
      cancel_url: cancelUrl,
    };

    const res = await fetch(`${POLAR_BASE}/checkouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Polar API error:", {
        status: res.status,
        statusText: res.statusText,
        error: errorData,
      });
      return NextResponse.json(
        {
          error: "polar_create_failed",
          details: errorData,
          status: res.status,
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("Checkout created successfully:", data.id);
    return NextResponse.json({ url: data.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      {
        error: "internal",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
