import axios from "axios";
const fs = require("fs");

const configFilePath = "./config.json";
import { Config } from "../types";

const configFile = fs.readFileSync(configFilePath, "utf-8");
const config: Config = JSON.parse(configFile);

const TOKEN = config.token;

export async function getServerName(
  serverId: string
): Promise<string | undefined> {
  let result = "";
  try {
    const serverResponse = await axios({
      method: "GET",
      url: `https://discord.com/api/guilds/${serverId}`,
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json",
      },
    });

    const serverName = serverResponse.data.name;

    result = serverName;

    return result;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
