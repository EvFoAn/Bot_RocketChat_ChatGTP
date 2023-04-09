# You can use this app as ChatGPT Bot for RocketChat.
# The bot can find information on the Internet, remember the latest messages and analyze them for a better response

1. git clone repository
2. apt install nodejs
2. node install rocket.chat axios node-summarizer cheerio cli-spinners natural cli-cursor readline
3. Go to your Rocket Chat, create a bot (user) and a room. Add this bot to the room.

4. Change vars:
const ROCKETCHAT_URL = 'https://YOUR_URL_ROCKETCHAT'

const ROCKETCHAT_USER = 'YOUR_BOT_LOGIN';

const ROCKETCHAT_PASSWORD = 'YOUR_PASSWORD';

const rocketChatChannel = 'ChatGPT';

const OPENAI_API_KEY = 'YOUR_API_KEY_OPENAI';

const googleApiKey = 'YOUR_GOOGLE_APIKEY';

const customSearchEngineId = 'YOUR_SEARCH_ENGINEID';

5. node chatgpt.js

...




