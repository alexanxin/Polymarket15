import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url = "https://gamma-api.polymarket.com/markets";
    const params = new URLSearchParams({
      active: "true",
      closed: "false",
      limit: "20",
      tag_id: "1"
    });
    const response = await fetch(`${url}?${params}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TradingBot/1.0)'
      }
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching markets:', error);
    return NextResponse.json({ error: 'Failed to fetch markets' }, { status: 500 });
  }
}
