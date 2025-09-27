# Discord Bot Setup Guide

## Overview
This guide will help you set up your Discord bot correctly to avoid the "Missing Access" (403) error that occurs when the bot doesn't have proper permissions to access channels.

## Problem
The error message `{"message": "Missing Access", "code": 50001}` indicates that your Discord bot doesn't have the necessary permissions to access the specified channel.

## Solution

### 1. Configure Bot Permissions in Discord Developer Portal

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Navigate to the "Bot" section
4. Under "Privileged Gateway Intents", enable:
   - Message Content Intent
   - Server Members Intent (if you need to access member data)
5. Save changes

### 2. Generate a Proper Invite URL

1. In the Discord Developer Portal, go to the "OAuth2" section
2. Select "URL Generator"
3. Under "Scopes", select:
   - `bot`
4. Under "Bot Permissions", select:
   - Read Messages/View Channels
   - Read Message History
   - Send Messages (if your bot needs to send messages)
5. Copy the generated URL

### 3. Invite the Bot to Your Server

1. Paste the URL from step 2 into your browser
2. Select your server from the dropdown
3. Authorize the bot

### 4. Check Channel Permissions

1. In your Discord server, right-click the channel you're trying to access
2. Select "Edit Channel"
3. Go to "Permissions"
4. Make sure your bot (or a role your bot has) can:
   - View Channel
   - Read Message History

### 5. Update Environment Variables

1. Make sure your `.env.local` file has the correct values:
   - `DISCORD_BOT_TOKEN`: Your bot's token from the Bot section
   - `DISCORD_CHANNEL_ID`: The ID of the channel you want to access
   - `DISCORD_SERVER_ID`: The ID of your server

### 6. Get Channel ID

To get a channel ID:
1. Enable Developer Mode in Discord (User Settings > Advanced > Developer Mode)
2. Right-click on the channel and select "Copy ID"

## Testing

After completing these steps, run the test script:

```bash
node test-discord-api.js
```

If successful, you should see a list of messages from your channel.

## Common Errors

- **403 Missing Access**: Bot doesn't have permission to view the channel
- **401 Unauthorized**: Invalid or expired bot token
- **404 Not Found**: Channel ID doesn't exist or is incorrect
- **429 Too Many Requests**: You're making too many requests to the Discord API

## Need More Help?

If you're still experiencing issues, check the [Discord Developer Documentation](https://discord.com/developers/docs/intro) or the [Discord API Server](https://discord.gg/discord-developers).