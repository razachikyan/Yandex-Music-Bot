import axios from "axios";
import "dotenv/config";

const axiosClient = axios.create({
  baseURL: process.env.BASE_URL || "https://api.music.yandex.net",
  headers: {
    "Content-Type": "application/json",
    Authorization: `OAuth ${process.env.YANDEX_API_TOKEN}`,
  },
});

export default axiosClient;
