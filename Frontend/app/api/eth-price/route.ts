import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Development mode - return mock ETH price
    if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
      const mockPrice = 3250.75; // Mock ETH price in USD
      return NextResponse.json({
        price: mockPrice,
        timestamp: Date.now(),
      });
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      {
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Return error without logging - rate limits are common
      return NextResponse.json({ error: "Failed to fetch ETH price" }, { status: response.status });
    }

    const data = await response.json();
    const ethPrice = data.ethereum?.usd;

    if (!ethPrice) {
      return NextResponse.json({ error: "Invalid price data" }, { status: 500 });
    }

    return NextResponse.json({
      price: ethPrice,
      timestamp: Date.now(),
    });
  } catch (error) {
    // Silently handle errors - network issues are expected
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
