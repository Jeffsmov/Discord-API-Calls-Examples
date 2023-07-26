const fs = require("fs");

import { sendMessage } from "../functions/sendMessage";

import { Config } from "../types";

const configFilePath = "./config.json";

const configFile = fs.readFileSync(configFilePath, "utf-8");
const config: Config = JSON.parse(configFile);

export const run = async () => {
  try {
    if (config.mudae) {
      let message = "/tu";
      for (let i = 0; i < 1; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        await sendMessage({
          channelId: config.mudae.channelId,
          message,
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
};
