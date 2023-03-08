import { Events } from "discord.js";
import DiscordClient from "../../client/Client";
import { greenTextColor, redTextColor } from "../../utils/functions/util";
import BaseEvent from "../../utils/structures/BaseEvent";
import { exit } from "process";

export default class ReadyEvent extends BaseEvent {
  constructor() {
    super(Events.ClientReady);
  }

  async run(client: DiscordClient) {
    console.log(`\nLogado em ${client.user!.tag}!`);

    for (const guild of client.guilds.cache.toJSON()) {
      if (guild.id !== process.env.GUILD_ID) {
        console.log(redTextColor(`Servidores não autorizadas encontradas!\nName: ${guild.name} ID: ${guild.id}`));
        exit(-1);
      } else {
        console.log(greenTextColor(`Servidor encontrado!\n Name ${guild.name} ID: ${guild.id}`));
      }
    }
  }
}
