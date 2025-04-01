// Simple script to test Twitter API integration
require('dotenv').config({ path: '.env.local' });

const https = require('https');

const bearerToken = process.env.TWITTER_BEARER_TOKEN;
const username = process.env.TWITTER_USERNAME;

console.log('Testing Twitter API with username:', username);

if (!bearerToken || !username) {
  console.error('Twitter bearer token or username not found in environment variables');
  process.exit(1);
}

const options = {
  hostname: 'api.twitter.com',
  path: `/2/users/by/username/${username}`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${bearerToken}`
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
      const userData = JSON.parse(data);
      const userId = userData.data?.id;
      
      if (userId) {
        console.log('Successfully found Twitter user ID:', userId);
        console.log('Testing tweet retrieval...');
        getTweets(userId);
      } else {
        console.error('Could not find Twitter user ID in response');
      }
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();

function getTweets(userId) {
  const tweetOptions = {
    hostname: 'api.twitter.com',
    path: `/2/users/${userId}/tweets?max_results=5&tweet.fields=created_at,public_metrics`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    }
  };

  const tweetReq = https.request(tweetOptions, (res) => {
    let data = '';
    console.log('Tweet Status Code:', res.statusCode);
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Tweet Response:', data);
    });
  });

  tweetReq.on('error', (error) => {
    console.error('Tweet Error:', error);
  });

  tweetReq.end();
}