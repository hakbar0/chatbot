import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

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
  if (message.hasMedia) {
    const media = await message.downloadMedia();
    if (media.mimetype.includes("image")) {
      const randomQuestion = getRandomQuestion();
      message.reply(randomQuestion);
    }
  }
});

client.initialize();

function getRandomQuestion(): string {
  const questions = [
    "What's your favorite hobby?",
    "What's your favorite food?",
    "What's your favorite color?",
    "What's your favorite book?",
    "What's your favorite movie?",
  ];

  return questions[Math.floor(Math.random() * questions.length)];
}
