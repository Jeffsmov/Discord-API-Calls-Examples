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

    let rnd = Math.floor(Math.random() * 9);
    const what = rnd % 2 === 0 ? "w" : rnd < 5 ? "h" : "m";

    rnd = Math.floor(Math.random() * 9);
    const pool = rnd % 2 === 0 ? undefined : rnd < 5 ? "a" : "g";

    const props: RollProps = { what, pool };

    await roll(props);

    hourCount++;

    if (hourCount === 12) {
      await dailyMessages();
      hourCount = 0;
    }

    const nextRollsIn = calcNextRolls();

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

const calcNextRolls = () => {
  const rnd = Math.floor(Math.random() * 40);

  const time = new Date();
  let hour = 1;
  if (time.getMinutes() <= 10) {
    hour = 0;
  }

  const auxFecha = new Date(
    time.getFullYear(),
    time.getMonth(),
    time.getDate(),
    time.getHours(),
    11 + rnd,
    0,
    0
  );

  const fecha = auxFecha.getTime() + 3600000 * hour;

  return fecha - time.getTime();
};

type RollProps = {
  what: "w" | "h" | "m";
  pool?: "a" | "g";
};
