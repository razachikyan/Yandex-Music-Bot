import { AxiosInstance } from "axios";
import axiosClient from "./axiosClient";
import { XMLParser } from "fast-xml-parser";

class YandexApi {
  private _axiosClient: AxiosInstance;
  constructor() {
    this._axiosClient = axiosClient;
  }
  async getTrackById(trackId: string): Promise<string | null> {
    try {
      const { data } = await this._axiosClient.get(
        `/tracks/${trackId}/download-info`
      );

      const result = data?.result;
      if (!Array.isArray(result) || result.length === 0) return null;

      const best =
        result.find((r: any) => r.bitrateInKbps === 320) || result[0];
      if (!best.downloadInfoUrl) return null;
      const response = await this._axiosClient.get(best.downloadInfoUrl, {
        responseType: "text",
      });

      const parser = new XMLParser();
      const parsed = parser.parse(response.data);
      const info = parsed["download-info"];

      if (!info?.host || !info?.path || !info?.ts || !info?.s) return null;

      const finalUrl = `https://${info.host}${info.path}?ts=${info.ts}&s=${info.s}`;
      console.log(best.downloadInfoUrl, finalUrl);

      return finalUrl;
    } catch (err) {
      console.error("Failed to get track:", err);
      return null;
    }
  }

  getTrackLyrics(trackId: string) {}
  getSimilarTracks(trackId: string) {}
  getUserLikedTracks(userId: string) {}
  getTracksByArtistId(artistId: string) {}

  getAlbumById(albumId: string) {}

  getUserPlaylists(userId: string) {}
}

export default new YandexApi();
