import DiscordClient from '../../client/Client'

export function splitMessage(
  message: string,
  limit: number = 1000,
  maxInterationCount: number = 100,
) {
  const splitted: string[] = []
  let content = message
  let { length } = content

  if (length >= limit) {
    let i = 0

    while (length !== 0 && content !== '') {
      splitted.push(content.substring(0, limit))
      content = content.substring(limit)
      length = content.length
      i++

      if (i >= maxInterationCount) {
        console.log('Loop Interronpido')
        break
      }
    }
  } else {
    splitted.push(message)
  }
  return splitted
}

export function getHomeGuild(client: DiscordClient) {
  return client.guilds.cache.get(`${client.config.props.global.verifyGuilds}`)
}

export function greenTextColor(text: string) {
  return '\u001b[1;32m' + `🟢 ${text}` + '\u001b[0m'
}

export function yellowTextColor(text: string) {
  return '\u001b[1;33m' + `🟡 ${text}` + '\u001b[0m'
}

export function redTextColor(text: string) {
  return '\u001b[1;31m' + `🔴 ${text}` + '\u001b[0m'
}

export function fill(lenght: number, text: string, token: string = ' ') {
  let safe = 0

  if (lenght < text.length) return text

  const diff = lenght - text.length

  for (let i = 1; i <= diff; i++, safe++) {
    if (safe >= 500) break
    text += ' '
  }
  return text
}
