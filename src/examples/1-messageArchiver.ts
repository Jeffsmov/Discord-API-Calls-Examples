const fs = require("fs");

import { getServerName } from "../functions/getServerName";
import { getUserMessages } from "../functions/getUserMessages";
import { getUserName } from "../functions/getUserName";

import { User, Server, Config } from "../types";

const configFilePath = "./config.json";

const configFile = fs.readFileSync(configFilePath, "utf-8");
const config: Config = JSON.parse(configFile);

export const run = async () => {
  try {
    let userName = await getUserName({
      userId: config.userId,
      serverId: config.serverId,
    });
    let serverName = await getServerName(config.serverId);

    if (userName === undefined) {
      console.log('An issue has occured - "userName is not defined"');
      return;
    }

    if (serverName === undefined) {
      console.log('An issue has occured - "serverName is not defined"');
      return;
    }

    let user: User = { userId: config.userId, userName };
    let server: Server = { serverId: config.serverId, serverName };

    let channelsToSearchFor: string[] | undefined = config.serverList;

    await getUserMessages({ user, server, channelsToSearchFor });
  } catch (error) {
    console.error(error);
  }
};
