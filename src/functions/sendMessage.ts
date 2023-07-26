import axios from "axios";
const fs = require("fs");

const configFilePath = "./config.json";
import { Config } from "../types";

const configFile = fs.readFileSync(configFilePath, "utf-8");
const config: Config = JSON.parse(configFile);

const TOKEN = config.token;

export async function sendMessage({
  channelId,
  message,
}: {
  channelId: string;
  message: string;
}): Promise<string | undefined> {
  let result = "";
  try {
    await axios({
      method: "POST",
      url: `https://discord.com/api/channels/${channelId}/messages`,
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json",
      },
      data: {
        content: message,
      },
    });
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
