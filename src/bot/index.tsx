import TelegramApi from "node-telegram-bot-api";
import "dotenv/config";

export class TGBot {
  private _token: string;
  private _bot: TelegramApi;

  constructor() {
    this._token = "";
    this._bot = new TelegramApi(this._token, { polling: true });
  }

  async _setCommands() {
    await this._bot.setMyCommands([
      { command: "start", description: "Start the bot" },
      { command: "help", description: "Check the bot commands" },
    ]);
  }

  async _handleCommands() {
    this._bot.on("text", async ({ text, chat, from }) => {
      if (text === "/start") {
      } else if (text === "/help") {
      }
    });
  }

  async startBot() {
    console.log("\t\t--------------Bot started !---------------");
    await this._setCommands();
    await this._handleCommands();
  }
}
