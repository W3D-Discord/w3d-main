import { appendFile } from 'fs/promises'
import { format } from 'date-fns'
import path from 'path'
import Service from '../utils/structures/BaseServices'
import { WebhookClient, EmbedBuilder } from 'discord.js'
import { splitMessage } from '../utils/functions/util'

export enum LogLevel {
  LOG = 'LOG',
  INFO = 'INFO',
  WARN = 'WARN',
  CRITICAL = 'CRITICAL',
  ERROR = 'ERROR',
}

export default class DebugLogger extends Service {
  private joinLeaveLogFile = path.join(
    process.env.DEFAULT_PREFIX ?? __dirname + '/../../',
    'logs/join-leave.log',
  )

  private appLogFile = path.join(
    process.env.DEFAULT_PREFIX ?? __dirname + '/../../',
    'logs/app.log',
  )

  private debugLogFile = path.join(
    process.env.DEFAULT_PREFIX ?? __dirname + '/../../',
    'logs/debug.log',
  )

  async logApp(level: LogLevel, message: string) {
    await this.log(this.appLogFile, level, message)
  }

  async logLeaveJoin(level: LogLevel, message: string) {
    await this.log(this.joinLeaveLogFile, level, message)
  }

  async log(stream: string, level: LogLevel, message: string) {
    await appendFile(
      stream,
      `[${new Date().toISOString()}] [${level}] \n${message}\n`,
    )
  }

  async logDebug(message: string, newLine = false) {
    await appendFile(
      this.debugLogFile,
      `${newLine ? '\n' : ''}[${format(
        new Date(),
        "yyy-MM-dd'T'HH:mm:ss.SSSxxx",
      )}] \n${message}\n`,
    )
  }

  async logToHomeServer(message: string, logLevel: LogLevel = LogLevel.ERROR) {
    if (!process.env.DEBUG_WEKHOOK_URL) return

    const webhookClient = new WebhookClient({
      url: process.env.DEBUG_WEKHOOK_URL!,
    })
    const splitted = splitMessage(message)
    const embed = new EmbedBuilder({
      color: logLevel === LogLevel.WARN ? 0x8c14fb : 0x000,
      title: logLevel === LogLevel.WARN ? 'CORE WARNING' : 'FATAL ERROR',
      description: splitted.shift(),
    })

    if (splitted.length === 0) {
      embed.setTimestamp()
    }

    try {
      await webhookClient.send({
        embeds: [embed],
      })

      for (const index in splitted) {
        const embed = new EmbedBuilder({
          color: logLevel === LogLevel.WARN ? 0x8c14fb : 0x000,
          description: splitted[index],
        })

        if (parseInt(index) === splitted.length - 1) {
          embed.setTimestamp()
        }

        await webhookClient.send({
          embeds: [embed],
        })
      }

      await webhookClient.destroy()
    } catch (e) {
      console.log(e)
    }
  }
}
