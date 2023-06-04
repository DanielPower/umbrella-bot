import express, { Request } from "express";
import { env } from "../env";
import { Client } from "discord.js";

interface ReqQuery {
  code: string;
  state: string;
}

export const authServer = (botClient: Client) => {
  const app = express();

  app.get("/auth", async (req: Request<{}, {}, {}, ReqQuery>, res) => {
    if (!req.query.code || !req.query.state) {
      return res.status(400).send("Invalid request");
    }

    const [guildId, userId] = req.query.state.split(",") as [string, string];
    let authJson;
    let userJson;

    try {
      authJson = await (
        await fetch("https://osu.ppy.sh/oauth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            client_id: env.OSU_CLIENT_ID,
            client_secret: env.OSU_CLIENT_SECRET,
            code: req.query.code,
            grant_type: "authorization_code",
            redirect_uri: "http://localhost:3000/auth",
            scope: "identify",
          }),
        })
      ).json();

      userJson = await (
        await fetch("https://osu.ppy.sh/api/v2/me", {
          headers: {
            Authorization: `Bearer ${authJson.access_token}`,
          },
        })
      ).json();
    } catch {
      return res.status(500).send("Failed to authenticate");
    }
    console.log(authJson);
    console.log(userJson);

    try {
      const guild = await botClient.guilds.fetch(guildId);
      const member = await guild.members.fetch(userId);
      console.log(userJson.username, member.nickname);
      await member.setNickname(userJson.username);
    } catch (e) {
      console.error(e);
      return res.status(500).send("Failed to set nickname");
    }

    return res.send("Successfully authenticated");
  });

  return app;
};
