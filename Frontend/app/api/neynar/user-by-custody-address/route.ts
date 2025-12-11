import { NextRequest, NextResponse } from "next/server";

/**
 * Neynar API Proxy Endpoint
 * 
 * OnchainKit may call this endpoint to look up user information by custody address.
 * This endpoint proxies requests to Neynar API.
 * 
 * @see https://docs.neynar.com/reference/lookup-user-by-custody-address
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Address parameter is required" },
        { status: 400 }
      );
    }

    const neynarApiKey = process.env.NEYNAR_API_KEY;

    if (!neynarApiKey) {
      console.warn("⚠️ NEYNAR_API_KEY not found in environment variables");
      return NextResponse.json(
        { error: "Neynar API key not configured" },
        { status: 500 }
      );
    }

    // Call Neynar API to lookup user by custody address
    // API endpoint: https://docs.neynar.com/reference/lookup-user-by-custody-address
    // Endpoint format: /v2/farcaster/user/custody-address/{custody_address}
    const neynarResponse = await fetch(
      `https://api.neynar.com/v2/farcaster/user/custody-address/${encodeURIComponent(address)}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-api-key": neynarApiKey, // Neynar uses x-api-key header, not api_key
        },
      }
    );

    if (!neynarResponse.ok) {
      const errorText = await neynarResponse.text();
      console.error("Neynar API error:", neynarResponse.status, errorText);
      return NextResponse.json(
        { error: "Failed to fetch user from Neynar", details: errorText },
        { status: neynarResponse.status }
      );
    }

    const data = await neynarResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in neynar/user-by-custody-address:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
