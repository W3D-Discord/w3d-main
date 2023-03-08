import {
  Client,
  ClientOptions,
  Collection,
  CommandInteraction,
  Message,
} from 'discord.js'
import BaseCommand from '../utils/structures/BaseCommand'
import BaseEvent from '../utils/structures/BaseEvent'
import DebugLogger, { LogLevel } from '../services/DebugLogger'
import { Config } from './Config'
import Auth from '../services/Auth'

export default class DiscordClient extends Client {
  private _commands = new Collection<string, BaseCommand>()
  private _events = new Collection<string, BaseEvent>()

  static client: DiscordClient

  auth: Auth = {} as Auth
  rootdir: string
  msg: Message | CommandInteraction | null = null
  config: Config
  debugLogger: DebugLogger = {} as DebugLogger

  constructor(options: ClientOptions, rootdir: string = __dirname) {
    super({
      ws: {
        properties: {
          browser: 'Discord iOS',
        },
      },
      ...options,
    })

    this.rootdir = rootdir
    this.config = new Config(this)
    DiscordClient.client = this

    process.on('uncaughtException', (error, origin) => {
      console.log('Uncaught', error)

      this.handleCrash(error, origin)
        .then(() => process.exit(-1))
        .catch((err) => {
          console.log(err)
          process.exit(-1)
        })
    })
  }

  get commands(): Collection<string, BaseCommand> {
    return this._commands
  }

  get events(): Collection<string, BaseEvent> {
    return this._events
  }

  setMessage(msg: Message | CommandInteraction) {
    this.msg = msg
  }

  async handleCrash(error: Error, origin: NodeJS.UncaughtExceptionOrigin) {
    await this.debugLogger.logApp(LogLevel.CRITICAL, 'Um erro interno ocorreu')
    await this.debugLogger.logApp(
      LogLevel.ERROR,
      `Uncaught ${error.name}: ${error.message}\n+ ${error.stack}`,
    )
    await this.debugLogger.logToHomeServer(
      `Uncaught ${error.name}: ${error.message}\n ${error.stack}`,
    )
  }
}
