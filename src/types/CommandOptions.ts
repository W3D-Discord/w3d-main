export default interface CommandOptions {
  args: Array<string>
  argsv: Array<string>
  normalArgs: Array<string>
  options: Array<string>
  cmdName: string
  isInteraction: false
}
