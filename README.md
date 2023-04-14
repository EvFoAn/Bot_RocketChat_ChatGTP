ChatGPT RocketChat Bot

# ChatGPT RocketChat Bot is an application based on the GPT-3.5 language model trained by OpenAI that can remember users' questions and answers and search for information in real-time on the internet, responding to questions based on content analysis. You can use this application as a bot for RocketChat.

# Installation

# 1. Clone the repository

git clone https://github.com/yourusername/ChatGPT-RocketChat-Bot.git

# 2. Install Node.js and npm

apt install nodejs npm


# 3. Install dependencies

npm install rocket.chat axios node-summarizer cheerio cli-spinners natural cli-cursor readline

# 4. Go to your Rocket Chat, create a bot (user) and a room. Add this bot to the room.

# 5. Change variables:

const ROCKETCHAT_URL = 'https://YOUR_URL_ROCKETCHAT'

const ROCKETCHAT_USER = 'YOUR_BOT_LOGIN';

const ROCKETCHAT_PASSWORD = 'YOUR_PASSWORD';

const rocketChatChannel = 'ChatGPT';

const OPENAI_API_KEY = 'YOUR_API_KEY_OPENAI';

const googleApiKey = 'YOUR_GOOGLE_APIKEY';

const customSearchEngineId = 'YOUR_SEARCH_ENGINEID';

# 6. Run the application

node chatgpt.js




