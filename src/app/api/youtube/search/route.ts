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
    console.log('Fetching YouTube API URL:', apiUrl);
    const resp = await fetch(apiUrl);
    console.log('YouTube API response status:', resp.status);
    const data = await resp.json();
    console.log('YouTube API response data:', data);

    if (!resp.ok) {
      console.error('YouTube Data API error', { status: resp.status, body: data });
      // If quota or other error, attempt to fall back to the public RSS feed for the channel
      try {
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
        console.log('Fetching RSS feed URL:', rssUrl);
        const rssResp = await fetch(rssUrl);
        console.log('RSS feed response status:', rssResp.status);
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
            return { videoId: vid, title, thumbnail: `https://i.ytimg.com/vi/${vid}/mqdefault.jpg` };
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
      thumbnail: `https://i.ytimg.com/vi/${item.id?.videoId}/mqdefault.jpg`,
      channelTitle: item.snippet?.channelTitle,
      publishedAt: item.snippet?.publishedAt,
    }));

    return NextResponse.json({ items, nextPageToken: data.nextPageToken || '', prevPageToken: data.prevPageToken || '' });
  } catch (err) {
    console.error('Failed to fetch YouTube data:', err);
    return NextResponse.json({ error: String(err), message: 'Failed to fetch YouTube data' }, { status: 500 });
  }
}
