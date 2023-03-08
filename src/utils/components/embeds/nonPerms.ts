import { EmbedBuilder } from "discord.js";
import colours from "../json/colours.json";

export const nonPermEmbed = new EmbedBuilder()
  .setDescription("Você não possui permissões suficientes para executar esse comando!")
  .setColor(Number(colours.embed.error));
