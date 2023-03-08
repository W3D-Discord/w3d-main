import DiscordClient from './Client'
import path from 'path'
import fs from 'fs'
import { z as zod } from 'zod'

export type ConfigType = {
  [key: string]: string | number
}

export type ConfigContainerType = {
  [guildID: string | number]: ConfigType
}

export class Config {
  props: ConfigContainerType = {}
  client: DiscordClient
  configPath: string

  constructor(client: DiscordClient) {
    this.client = client
    this.configPath = path.resolve(process.env.DEFAULT_PREFIX!)
  }

  load() {
    fs.readFile(this.configPath, (err, data) => {
      if (err) {
        console.log(err)
      }
      this.props = JSON.parse(data.toString())
    })
  }

  write() {
    fs.writeFile(
      this.configPath,
      JSON.stringify(this.props, undefined, ' '),
      () => null,
    )
  }

  get(key: string) {
    return typeof this.props[this.client.msg!.guild!.id] === 'object'
      ? this.props[this.client.msg!.guild!.id][key]
      : null
  }

  set(key: string, value: string) {
    this.props[this.client.msg!.guild!.id][key] = value
  }
}
