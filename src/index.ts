import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import OpenAI from "openai-api";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI(process.env.OPENAI_API_KEY as string);
const model = "text-davinci-003";
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
  const prompt = `Generate a confusing and hard-to-understand question related to this message "${input}". Do not generate code snippets.`;

  try {
    const response = await openai.complete({
      engine: model,
      prompt: prompt,
      maxTokens: 1024,
      n: 1,
      temperature: 0,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
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
