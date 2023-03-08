import 'reflect-metadata'
import { config } from 'dotenv'
import { GatewayIntentBits, Partials } from 'discord.js'
import DiscordClient from './client/Client'
import path from 'path'
import { registerEnd, registerStart } from './utils/functions/debug'
import { registerCommands, registerEvents } from './utils/functions/handle'
import { existsSync } from 'fs'
import { yellowTextColor } from './utils/functions/util'

if (existsSync(path.join(__dirname, '../.env'))) {
  config()
} else {
  process.env.ENV = 'prod'
}

if (process.argv.includes('--prod')) {
  console.warn(
    yellowTextColor(
      'WARNING: Forçando o modo de produção (--prod opção aprovada)',
    ),
  )
  process.env.ENV = 'prod'
}

if (process.argv.includes('--dev')) {
  console.warn(
    yellowTextColor(
      'WARNING: Forçando o modo de desenvolvimento (--dev opção aprovada)',
    ),
  )
  process.env.ENV = 'dev'
}

const client = new DiscordClient(
  {
    partials: [Partials.Channel],
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageTyping,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildModeration,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildEmojisAndStickers,
    ],
  },
  path.resolve(__dirname, '..'),
)

;(async () => {
  await registerStart()
  await registerCommands(client, '../../commands')
  await registerEnd()

  await registerStart()
  await registerEvents(client, '../../events')
  await registerEnd()

  await client.login(process.env.DISCORD_BOT_TOKEN)
})()
