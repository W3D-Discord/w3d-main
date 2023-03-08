import BaseEvent from "../../utils/structures/BaseEvent";
import { GuildMember, EmbedBuilder, ChannelType, Interaction, CommandInteraction, Events } from "discord.js";
import DiscordClient from "../../client/Client";
import InteractionOptions from "../../types/InteractionOptionsType";
import AutoCompleteOptions from "../../types/AutoCompleteOptionsType";
import { nonPermEmbed } from "../../utils/components/embeds/nonPerms";

export default class InteractionCreateEvent extends BaseEvent {
  constructor() {
    super(Events.InteractionCreate);
  }

  async run(client: DiscordClient, interaction: Interaction, cmdInteraction: CommandInteraction) {
    if (!interaction.guild || !interaction.channel || interaction.channel.type === ChannelType.DM) {
      if (interaction.isRepliable())
        await interaction.reply({
          content: "Voce nao pode utilizar comandos na DM",
          ephemeral: true,
        });

      return;
    }

    if (interaction.isCommand()) {
      client.setMessage(interaction);

      const { commandName } = interaction;

      const command = client.commands.get(commandName);

      if (command && interaction.isCommand() && command.supportsInteraction) {
        const allowed = await client.auth.verify(interaction.member! as GuildMember, command);

        if (!allowed) {
          await interaction.reply({
            embeds: [nonPermEmbed],
            ephemeral: true,
          });

          return;
        }

        const options = {
          cmdName: commandName,
          options: interaction.options,
          isInteraction: true,
        } as InteractionOptions;

        await command.execute(client, interaction, options);
        (global as any).lastCommand = commandName;
      }
    } else if (interaction.isAutocomplete()) {
      client.setMessage(cmdInteraction);

      const { commandName } = interaction;

      const command = client.commands.get(commandName);

      if (command && command.supportsInteraction) {
        const allowed = await client.auth.verify(interaction.member! as GuildMember, command);

        if (!allowed) {
          return;
        }

        if (!(await command.perms(client, cmdInteraction))) {
          return;
        }

        const options = {
          cmdName: commandName,
          options: interaction.options,
          isInteraction: true,
          optionName: interaction.options.getFocused(true).name,
          query: interaction.options.getFocused(true).value.toString(),
        } as unknown as AutoCompleteOptions;

        await command.autoComplete(client, interaction, options);
        (global as any).lastCommand = commandName;
      }
    } else {
      if (!(global as any).commandName) return;

      client.setMessage(cmdInteraction);

      const command = client.commands.get((global as any).commandName);

      if (command && command.supportsInteraction) {
        const allowed = await client.auth.verify(interaction.member! as GuildMember, command);

        if (!allowed) {
          return;
        }

        if (!(await command.perms(client, cmdInteraction))) {
          return;
        }

        await command.default(client, interaction);
      }
    }
  }
}
