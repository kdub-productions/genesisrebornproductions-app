import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const maxResults = url.searchParams.get('maxResults') || '12';
  const pageToken = url.searchParams.get('pageToken') || '';
  const order = url.searchParams.get('order') || 'date';

  const apiKey = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID || process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    return NextResponse.json({ items: [], nextPageToken: '', prevPageToken: '', message: 'Missing server-side YouTube credentials' }, { status: 200 });
  }

  const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&type=video&maxResults=${encodeURIComponent(maxResults)}&pageToken=${encodeURIComponent(pageToken)}&order=${encodeURIComponent(order)}`;

  try {
    const resp = await fetch(apiUrl);
    const data = await resp.json();

    if (!resp.ok) {
      // Propagate status and message to client with helpful hint
      return NextResponse.json({ error: data, message: data?.error?.message || 'YouTube API error' }, { status: resp.status });
    }

    // Sanitize and return only necessary fields
    const items = (data.items || []).map((item: any) => ({
      videoId: item.id?.videoId,
      title: item.snippet?.title,
      thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || null,
    }));

    return NextResponse.json({ items, nextPageToken: data.nextPageToken || '', prevPageToken: data.prevPageToken || '' });
  } catch (err) {
    return NextResponse.json({ error: String(err), message: 'Failed to fetch YouTube data' }, { status: 500 });
  }
}
