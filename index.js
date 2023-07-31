import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

const specificChannelId = "Your_Discord_Channel_ID"; // Replace with the actual channel ID

function startBot() {
  client.login(process.env.BOT_TOKEN).catch((error) => {
    console.error("Failed to log in:", error);
    setTimeout(startBot, 5000); // Restart the bot after a 5-second delay
  });
}

client.on("messageCreate", async function (message) {
  if (message.author.bot || message.channel.id !== specificChannelId) return;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant who responds succinctly" },
        { role: "user", content: message.content },
      ],
    });

    const content = response.data.choices[0].message;
    return message.reply(content);
  } catch (err) {
    console.error("An error occurred:", err);
    return message.reply("As an AI robot, I encountered an error.");
  }
});

startBot();
