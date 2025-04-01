// Simple script to test Discord API integration
require('dotenv').config({ path: '.env.local' });

const https = require('https');

const token = process.env.DISCORD_BOT_TOKEN;
const channelId = process.env.DISCORD_CHANNEL_ID;

console.log('Testing Discord API with channel ID:', channelId);

if (!token || !channelId) {
  console.error('Discord bot token or channel ID not found in environment variables');
  process.exit(1);
}

const options = {
  hostname: 'discord.com',
  path: `/api/v10/channels/${channelId}/messages?limit=5`,
  method: 'GET',
  headers: {
    'Authorization': `Bot ${token}`,
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  console.log('Status Code:', res.statusCode);
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    
    if (res.statusCode === 200) {
      console.log('Successfully retrieved Discord messages');
      try {
        const messagesData = JSON.parse(data);
        if (Array.isArray(messagesData) && messagesData.length > 0) {
          console.log(`Found ${messagesData.length} messages`);
          console.log('First message:', {
            id: messagesData[0].id,
            content: messagesData[0].content,
            author: messagesData[0].author?.username || 'Unknown'
          });
        } else {
          console.log('No messages found in the channel');
        }
      } catch (error) {
        console.error('Error parsing Discord response:', error);
      }
    } else if (res.statusCode === 401) {
      console.error('Unauthorized: Check if your Discord bot token is correct');
    } else {
      console.error(`Unexpected status code: ${res.statusCode}`);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();