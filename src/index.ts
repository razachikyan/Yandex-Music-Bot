import { TelegramBot } from "./models/bot/index";

async function startBot() {
  const loadetBot = new TelegramBot();
  await loadetBot.startBot();
}

startBot();