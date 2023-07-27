const fs = require("fs");

import { sendMessage } from "../functions/sendMessage";

import { Config } from "../types";

const configFilePath = "./config.json";

const configFile = fs.readFileSync(configFilePath, "utf-8");
const config: Config = JSON.parse(configFile);

export const run = async () => {
  let hourCount = 0;
  await dailyMessages();

  while (true) {
    //await warningMessages();

    const rnd = Math.floor(Math.random() * 9);
    const what = rnd % 2 === 0 ? "w" : rnd < 5 ? "h" : "m";

    const props: RollProps = { what };

    await roll(props);

    hourCount++;

    if (hourCount === 12) {
      await dailyMessages();
      hourCount = 0;
    }

    const nextRollsIn = calNextRolls();

    await new Promise((r) => setTimeout(r, nextRollsIn));
  }
};

const roll = async ({ what, pool }: RollProps) => {
  try {
    if (config.mudae) {
      let message = `$${what}${pool ?? ""}`;
      for (let i = 0; i < 10; i++) {
        await sendMessage({
          channelId: config.mudae.channelId,
          message,
        });
        // If you want the bot to be able to save a wish, it would have to be done here
        // However, not sure how the bot can save wishes/kk react without normal reactions, whole new adventure later
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const warningMessages = async () => {
  const messages: string[] = [
    "WARNING",
    "Message(s) will start in:",
    "3",
    "2",
    "1",
  ];
  await sendArrayOfMessages(messages);
};

const dailyMessages = async () => {
  const messages: string[] = ["$daily", "$dk"];
  await sendArrayOfMessages(messages);
};

const sendArrayOfMessages = async (messages: string[]) => {
  if (config.mudae) {
    for (let i = 0; i < messages.length; i++) {
      await sendMessage({
        channelId: config.mudae.channelId,
        message: messages[i],
      });
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
};

const calNextRolls = () => {
  const rnd = Math.floor(Math.random() * 40);

  const time = new Date();
  let hour = time.getHours();
  if (time.getMinutes() < 10) {
    hour--;
  }

  const fecha = new Date(
    time.getFullYear(),
    time.getMonth(),
    time.getDate(),
    hour + 1,
    11 + rnd,
    0,
    0
  );

  return fecha.getTime() - time.getTime();
};

type RollProps = {
  what: "w" | "h" | "m";
  pool?: "a" | "g";
};
