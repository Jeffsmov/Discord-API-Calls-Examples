import axios from "axios";
const fs = require("fs");

import { User, Server, Config } from "../types";

const configFilePath = "./config.json";

const configFile = fs.readFileSync(configFilePath, "utf-8");
const config: Config = JSON.parse(configFile);

const TOKEN = config.token;

export async function getUserMessages(props: Props) {
  let fileName = "";
  try {
    fileName = props.fileName
      ? `./Results/${props.fileName}`
      : `./Results/${props.user.userId}-${props.server.serverId}.txt`;

    // Get the user object
    const userResponse = await axios.get(
      `https://discord.com/api/users/${props.user.userId}`,
      {
        headers: {
          Authorization: TOKEN,
        },
      }
    );
    const user = userResponse.data;

    // Get the server object
    const serverResponse = await axios.get(
      `https://discord.com/api/guilds/${props.server.serverId}/channels`,
      {
        headers: {
          Authorization: TOKEN,
        },
      }
    );
    const channels = serverResponse.data;
    // Open the file for writing
    const file = fs.createWriteStream(fileName);

    // Iterate through all channels in the server
    for (const channel of channels) {
      if (props.channelsToSearchFor) {
        let found = props.channelsToSearchFor.find(
          (element: string) => element === channel.name
        );

        if (!found) continue;
      }

      // Check if the channel is a text channel
      if (channel.type === 0) {
        // Retrieve messages in the channel
        let lastMessageId: string | null = null;
        let messages: any[] = [];
        do {
          const messagesResponse = await axios.get(
            `https://discord.com/api/channels/${channel.id}/messages`,
            {
              headers: {
                Authorization: TOKEN,
              },
              params: {
                before: lastMessageId,
                limit: 100,
              },
            }
          );
          messages = messagesResponse.data;
          if (messages.length > 0) {
            lastMessageId = messages[messages.length - 1].id;
            // Iterate through all messages in the channel
            for (const message of messages) {
              // Check if the message was sent by the user
              if (message.author.id === user.id) {
                // Write the message content to the file
                file.write(`${message.content}\n`);
              }
            }
          }
        } while (messages.length > 0);
      }
    }

    // Close the file
    file.end();

    console.log("The operation has finished successfully");
  } catch (error) {
    console.error(error);
  }
}

export type Props = {
  user: User;
  server: Server;
  fileName?: string;
  channelsToSearchFor?: string[] | undefined;
};
