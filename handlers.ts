import { ChatInputCommandInteraction } from "discord.js";

type Handler = (interaction: ChatInputCommandInteraction) => Promise<void>;

export const ping: Handler = async (interaction) => {
  await interaction.reply("Pong!");
};

export const auth: Handler = async (interaction) => {
  await interaction.reply("Not implemented.");
};

export const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
    handler: ping,
  },
  {
    name: "auth",
    description: "Link with your osu! account",
    handler: auth,
  },
];
