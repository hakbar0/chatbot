import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import OpenAI from "openai-api";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI(process.env.OPENAI_API_KEY as string);

const client = new Client({});

client.on("qr", (qr) => {
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (message) => {
  console.log(message);
  const receivedText = message.body;
  const response = await generateConfusingQuestion(receivedText);
  message.reply(response);
});

client.initialize();

async function generateConfusingQuestion(input: string): Promise<string> {
  const prompt = `Generate a confusing and hard-to-understand question related to the topic "${input}". Do not generate code snippets.`;

  try {
    const response = await openai.complete({
      engine: "davinci-codex",
      prompt,
      maxTokens: 50,
      n: 1,
      temperature: 0.7,
    });

    if (response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].text.trim();
    } else {
      return "I'm not sure how to respond to that.";
    }
  } catch (error) {
    console.error(error);
    return "errrmmmm";
  }
}
