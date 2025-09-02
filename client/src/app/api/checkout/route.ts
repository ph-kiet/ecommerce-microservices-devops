import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, items, total } = await request.json();

  try {
    await fetch(`${process.env.CHECKOUT_SERVICE_URL}/checkout`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ email, items, total }),
    });

    return NextResponse.json(
      { message: "Checkout successful" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to checkout" }, { status: 500 });
  }
}
