import { env } from "../env";
import { Interaction } from "discord.js";
import { REST, Routes } from "discord.js";
import { Client, GatewayIntentBits } from "discord.js";
import { commands } from "./handlers";
import { authServer } from "./auth";
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);

try {
  console.log("Started refreshing application (/) commands.");
  await rest.put(Routes.applicationCommands(env.APPLICATION_ID), {
    body: commands.map(({ name, description }) => ({ name, description })),
  });
  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = commands.find(
    (command) => command.name === interaction.commandName,
  );
  if (command) {
    await command.handler(interaction);
  }
});

await client.login(env.DISCORD_TOKEN);

authServer(client).listen(3000, () => {
  console.log("Started auth server on port 3000");
});
