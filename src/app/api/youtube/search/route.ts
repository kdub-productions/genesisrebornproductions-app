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
      console.error('YouTube Data API error', { status: resp.status, body: data });
      // If quota or other error, attempt to fall back to the public RSS feed for the channel
      try {
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
        const rssResp = await fetch(rssUrl);
        if (rssResp.ok) {
          const rssText = await rssResp.text();
          // Simple XML parsing (no external deps): extract <entry> blocks and then extract yt:videoId, title and media:thumbnail url
          const entryMatches = rssText.match(/<entry[\s\S]*?<\/entry>/g) || [];
          const items = entryMatches.slice(0, Number(maxResults)).map((entryXml: string) => {
            const idMatch = entryXml.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
            const titleMatch = entryXml.match(/<title>([\s\S]*?)<\/title>/);
            const thumbMatch = entryXml.match(/<media:thumbnail[^>]*url="([^"]+)"/);
            const vid = idMatch ? idMatch[1] : null;
            const title = titleMatch ? titleMatch[1] : null;
            const thumb = thumbMatch ? thumbMatch[1] : null;
            return { videoId: vid, title, thumbnail: thumb };
          });
          return NextResponse.json({ items, nextPageToken: '', prevPageToken: '' });
        }
      } catch (rssErr) {
        // ignore rss fallback errors and fall through to returning the original API error
        console.error('RSS fallback failed', rssErr);
      }

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
