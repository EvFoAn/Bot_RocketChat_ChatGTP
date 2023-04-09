const { driver } = require('@rocket.chat/sdk');
const axios = require('axios');
const googleSearchBaseUrl = 'https://www.googleapis.com/customsearch/v1';
const SummarizerManager = require('node-summarizer').SummarizerManager;
const cheerio = require('cheerio');
const spinner = require('cli-spinners').dots;
const natural = require('natural');
const cursor = require('cli-cursor');
const readline = require('readline');
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();


const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';
const ROCKETCHAT_URL = 'https://YOUR_URL_ROCKETCHAT'
const ROCKETCHAT_USER = 'YOUR_BOT_LOGIN';
const ROCKETCHAT_PASSWORD = 'YOUR_PASSWORD';
const rocketChatChannel = 'ChatGPT';
const OPENAI_API_KEY = 'YOUR_API_KEY_OPENAI'; 
const googleApiKey = 'YOUR_GOOGLE_APIKEY';
const customSearchEngineId = 'YOUR_SEARCH_ENGINEID';



function startTyping(rid) {
  sendMessage('.', rid);
  stopTyping(rid);
}

function stopTyping() {
  cursor.show();
  readline.moveCursor(process.stdout, -3, 0);
  readline.clearLine(process.stdout, 1);
}

// Function to send a message to the chat
async function sendMessage(message, roomId) {
  try {
    // startTyping(roomId); // Starting input indication
    await driver.sendToRoom( message, roomId, { typingIndicator: true });
    // stopTyping(roomId); // Finishing the input indication
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

const runBot = async () => {
  try {
    let lastResponse = '';

    const conn = await driver.connect({
      host: ROCKETCHAT_URL,
      useSsl: true
    });

    await driver.login({
      username: ROCKETCHAT_USER,
      password: ROCKETCHAT_PASSWORD
    });

    await driver.joinRooms([rocketChatChannel]);
    console.log('joinRooms:', driver.joinRooms([rocketChatChannel]));
    await driver.subscribeToMessages();

    driver.reactToMessages(async (err, message, messageOptions) => {
      if (err) {
        console.error(err);
        return;
      }

      if (message.msg && !message.bot && message.rid) {
        if (message.msg.toLowerCase().startsWith('search on the internet')) {
	  await sendMessage('typing ...', message.rid);
          const query = message.msg.slice('search on the internet'.length).trim();
          const searchResults = await searchInternet(query);
          lastResponse = searchResults;
          await sendMessage(searchResults, message.rid);
        } else {
          try {
            const requestBody = {
              model: "gpt-3.5-turbo",
              messages: [{ role: "system", content: "You are a helpful assistant." },
		      { role: "user", content: lastResponse + '\n' + message.msg }],
              temperature: 0.0
            };

	    await sendMessage('typing ...', message.rid);
	    const response = await axios.post(openaiEndpoint, requestBody, {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`
           }
           });

            const responseBody = response.data;
             if (responseBody.hasOwnProperty('choices') && responseBody.choices.length > 0) {
               varAnswer = responseBody.choices[0].message.content;
               const AiAnswer = varAnswer.replace(/```/g, "`");
               const wrappedText = "```\n" + AiAnswer + "\n```";

               const aiReply = wrappedText;
               lastResponse = aiReply;
               await sendMessage(aiReply, message.rid);
             } else {
               console.error('Invalid response from OpenAI API');
        }
      } catch (error) {
        console.error('Error in OpenAI request:', error);
      }
    }
  }
});

} catch (error) {
  console.error('Error connecting to Rocket.Chat:', error);
  }
};

function removeHtmlAndScripts(htmlText) {
	const $ = cheerio.load(htmlText);
	$('script, style').remove(); 
	return $('body').text();
}

async function searchInternet(query) {
	try {
		const response = await axios.get(googleSearchBaseUrl, {
			params: {
			key: googleApiKey,
			cx: customSearchEngineId,
			q: query,
			num: 6,
			gl: 'ua,en,ru',
			hl: 'ua,en,ru',
		},
});

const searchResults = response.data;

if (searchResults.items && searchResults.items.length > 0) {
  const analyzedResults = [];

  for (const result of searchResults.items) {
    try {
      const pageResponse = await axios.get(result.link);
      const $ = cheerio.load(pageResponse.data);
      const pageTextS = $('body').text();

      const summarizer = new SummarizerManager(pageTextS, 3);
      const summary = await summarizer.getSummaryByRank();

      const title = result.title;
      const link = result.link;
      const snippet = summary.summary;

      analyzedResults.push(`${title}\n${link}\n\n`);
    } catch (error) {
      console.error(`Error analyzing search result ${result.link}: ${error}`);
    }
  }

  return analyzedResults.join('\n');
} else {
  return 'Sorry, I did not find anything for your query.'; 
}

} catch (error) {
  console.error('Error while searching:', error);
  return 'An error occurred while searching. Please try again later';
  }
}

runBot();
