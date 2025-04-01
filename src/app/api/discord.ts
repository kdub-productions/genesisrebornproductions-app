import { NextApiRequest, NextApiResponse } from 'next';
import { Client, GatewayIntentBits, TextChannel, Message } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { DISCORD_BOT_TOKEN, DISCORD_CHANNEL_ID } = process.env;

    if (!DISCORD_BOT_TOKEN || !DISCORD_CHANNEL_ID) {
      throw new Error('Missing Discord credentials');
    }

    await client.login(DISCORD_BOT_TOKEN);

    const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);

    if (!channel || !channel.isTextBased()) {
      throw new Error('Invalid channel or channel is not text-based');
    }

    const messages = await (channel as TextChannel).messages.fetch({ limit: 10 });

    const discordPosts = messages.map((message: Message) => ({
      id: message.id,
      title: message.author.username,
      content: message.content,
      author: message.author.username,
      channel: (message.channel as TextChannel).name,
      timestamp: message.createdAt.toISOString(),
    }));

    client.destroy(); // Disconnect from Discord

    res.status(200).json({ success: true, data: discordPosts });
  } catch (error) {
    console.error('Error fetching Discord messages:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch Discord messages' });
  }
}
