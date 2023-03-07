import { CommandInteractionOptionResolver } from 'discord.js'

export default interface AutoCompleteOptions {
  options: CommandInteractionOptionResolver
  cmdName: string
  isInteraction: true
  optionsName: string
  query: string
}
