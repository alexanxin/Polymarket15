import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const crypto = searchParams.get('crypto');
    const tag = searchParams.get('tag');
    const slug = searchParams.get('slug');
    const getSlugs = searchParams.get('getSlugs');

    let url;
    if (slug) {
      // Fetch specific market by slug
      url = `https://gamma-api.polymarket.com/events?slug=${slug}&active=true&closed=false`;
    } else if (tag) {
      // Fetch markets by tag (e.g., '15M' for 15-minute markets)
      url = `https://gamma-api.polymarket.com/events?tag_slug=${tag}&active=true&closed=false`;
    } else if (getSlugs) {
      // Special endpoint to get slugs for all crypto tabs
      url = `https://gamma-api.polymarket.com/events?tag_slug=15M&active=true&closed=false`;
    } else if (crypto) {
      // Fetch specific crypto markets
      url = `https://gamma-api.polymarket.com/events?category=${crypto.toUpperCase()}`;
    } else {
      // Fetch all crypto markets
      url = "https://gamma-api.polymarket.com/events?category=Crypto";
    }
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TradingBot/1.0)'
      }
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data); // Debug log

    // Special handling for getSlugs - extract active slugs for each crypto
    if (getSlugs) {
      const cryptoSlugs: { [key: string]: string } = {};

      if (Array.isArray(data)) {
        data.forEach((event: any) => {
          if (event.slug && event.markets && Array.isArray(event.markets)) {
            // Extract crypto from slug (e.g., 'btc-updown-15m-1765463400' -> 'BTC')
            const slugParts = event.slug.split('-');
            if (slugParts.length >= 3) {
              const crypto = slugParts[0].toUpperCase();
              if (['BTC', 'ETH', 'SOL', 'XRP'].includes(crypto)) {
                cryptoSlugs[crypto] = event.slug;
              }
            }
          }
        });
      }

      return NextResponse.json(cryptoSlugs);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching markets:', error);
    return NextResponse.json({ error: 'Failed to fetch markets' }, { status: 500 });
  }
}
