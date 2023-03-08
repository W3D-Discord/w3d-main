import DiscordClient from '../../client/Client'
import {
  PermissionResolvable,
  GuildMember,
  AutocompleteInteraction,
  Interaction,
  Message,
  CommandInteraction,
  MessagePayload,
  ContextMenuCommandInteraction,
  MessageEditOptions,
  WebhookEditMessageOptions,
} from 'discord.js'
import AutoCompleteOptions from '../../types/AutoCompleteOptionsType'
import CommandOptions from '../../types/CommandOptionsType'
import InteractionOptions from '../../types/InteractionOptionsType'

export default abstract class BaseCommand {
  supportsInteraction: boolean = false
  supportsLegacy: boolean = true
  permissions: PermissionResolvable[] = []
  coolDown?: number
  ownerOnly: boolean = false

  protected name: string = ''
  protected category: string = ''
  protected aliases: Array<string> = []

  constructor(name?: string, aliases?: Array<string>, category?: string) {
    if (name) this.name = name
    if (aliases) this.aliases = aliases
    if (category) this.category = category
  }

  getName(): string {
    return this.name
  }

  getAliases(): Array<string> {
    return this.aliases
  }

  getCategory(): string {
    return this.category
  }

  async permissionValidation(
    client: DiscordClient,
    member: GuildMember,
  ): Promise<boolean> {
    return true
  }

  async autoComplete(
    client: DiscordClient,
    interactions: AutocompleteInteraction,
    options: AutoCompleteOptions,
  ): Promise<void> {}

  async default(
    client: DiscordClient,
    interaction: Interaction,
  ): Promise<void> {}

  async deferReply(
    msg: Message | CommandInteraction | ContextMenuCommandInteraction,
    options: string | MessagePayload,
    edit: boolean = false,
  ): Promise<Message | CommandInteraction> {
    if (msg instanceof Message) {
      return await msg[edit ? 'edit' : 'reply'](
        options as MessagePayload & MessageEditOptions,
      )
    }
    return (await msg.editReply(
      options as string | MessagePayload | WebhookEditMessageOptions,
    )) as Message
  }

  async perms(client: DiscordClient, message: Message | CommandInteraction) {
    if (client.config.props.global.owners.includes(message.member!.user.id)) {
      return true
    }

    let member: GuildMember | null = null

    if (message.member && !(message.member instanceof GuildMember)) {
      try {
        member =
          (await message.guild?.members.fetch(message.member!.user.id)) ?? null
      } catch (e) {
        console.log(e)
        return false
      }
    } else {
      member = message.member
    }

    for await (const permission of this.permissions) {
      if (!member?.permissions.has(permission, true)) {
        if (message instanceof CommandInteraction && !message.isRepliable())
          return
        await message.reply({
          embeds: [
            {
              description: 'Voce nao tem permissao para executar este comando',
              color: 0x8c14fb,
            },
          ],
        })
        return false
      }
    }

    if (!(await this.permissionValidation(client, member!))) {
      if (message instanceof CommandInteraction && !message.isRepliable())
        return
      await message.reply({
        embeds: [
          {
            description: 'Voce nao tem permissao para executar este comando',
            color: 0x8c14fb,
          },
        ],
      })
    }
  }

  async execute(
    client: DiscordClient,
    message: Message | CommandInteraction,
    options: CommandOptions | InteractionOptions,
  ) {
    if (!(await this.perms(client, message))) {
      return
    }

    await this.run(client, message, options)
  }

  abstract run(
    client: DiscordClient,
    message: Message | CommandInteraction,
    options: CommandOptions | InteractionOptions,
  ): Promise<void>
}
