import axios from "axios";
const fs = require("fs");

const configFilePath = "./config.json";
import { Config } from "../types";

const configFile = fs.readFileSync(configFilePath, "utf-8");
const config: Config = JSON.parse(configFile);

const TOKEN = config.token;

export async function getUserName(props: Props): Promise<string | undefined> {
  let result = "";
  try {
    const response = await axios({
      method: "GET",
      url: `https://discord.com/api/guilds/${props.serverId}/members/${props.userId}`,
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json",
      },
    });

    const user = response.data.user;
    const serverNickname = response.data.nick;
    const username = user.username;

    result = props.getNickname ? serverNickname : username;

    return result;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

type Props = {
  userId: string;
  serverId: string;
  getNickname?: boolean | undefined;
};
