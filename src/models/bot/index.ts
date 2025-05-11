import TelegramApi from "node-telegram-bot-api";
import yandexApi from "../services/yandexClieny";
import axiosClient from "../services/axiosClient";
import path from "path";
import fs from "fs";
import "dotenv/config";

export class TelegramBot {
  private _token: string;
  private _bot: TelegramApi;
  private _yandexApi: any;

  constructor() {
    this._token = String(process.env.BOT_TOKEN);
    this._bot = new TelegramApi(this._token, { polling: true });
    this._yandexApi = yandexApi;
  }

  async _setCommands() {
    await this._bot.setMyCommands([
      { command: "start", description: "Start the bot" },
      { command: "help", description: "Check the bot commands" },
    ]);
  }

  async _handleCommands() {
    this._bot.on("text", async ({ text, chat }) => {
      if (text === "/start") {
        const trackId = "136070040";
        try {
          this._bot.sendMessage(chat.id, "Fetching your track, please wait...");

          const finalUrl = await this._yandexApi.getTrackById(trackId);

          if (!finalUrl) {
            return this._bot.sendMessage(
              chat.id,
              "❌ Couldn't fetch the track."
            );
          }

          const tempPath = path.join(__dirname, "..", "..", "temp.mp3");
          const response = await axiosClient.get(finalUrl, {
            responseType: "stream",
          });
          const writer = fs.createWriteStream(tempPath);
          response.data.pipe(writer);

          writer.on("finish", async () => {
            await this._bot.sendAudio(chat.id, tempPath, {
              caption: "🎵 Here is your track!",
            });

            fs.unlinkSync(tempPath);
          });

          writer.on("error", () => {
            this._bot.sendMessage(chat.id, "❌ Failed to write track file.");
          });
        } catch (err) {
          this._bot.sendMessage(chat.id, "❌ Something went wrong.");
        }
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
