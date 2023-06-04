import { ChatInputCommandInteraction } from "discord.js";
import { env } from "../env";

type Handler = (interaction: ChatInputCommandInteraction) => Promise<void>;

export const ping: Handler = async (interaction) => {
  await interaction.reply("Pong!");
};

export const auth: Handler = async (interaction) => {
  await interaction.reply({
    content: `Go to this link to authenticate: https://osu.ppy.sh/oauth/authorize?client_id=${env.OSU_CLIENT_ID}&redirect_uri=${env.ROOT_URL}/auth&response_type=code&scope=identify&state=${interaction.guildId},${interaction.user.id}`,
    ephemeral: true,
  });
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
