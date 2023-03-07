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
