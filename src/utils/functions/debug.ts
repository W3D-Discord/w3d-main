import BaseCommand from '../structures/BaseCommand'
import BaseEvent from '../structures/BaseEvent'
import { fill, greenTextColor, redTextColor, yellowTextColor } from './util'

const colLengths = [19, 33, 10]

export async function registerStart() {
  if (process.env.ENV === 'prod' || !process.argv.includes('--verbose')) return

  console.log(`+-----------------------------------------------------+`)
  console.log(`|Name               |Time                  |Status    |`)
}

export async function registered(
  command: BaseCommand | BaseEvent,
  startTime: number = 0,
  endTime: number = 0,
) {
  if (process.env.ENV === 'prod' || !process.argv.includes('--verbose')) return

  console.log(`|-------------------+----------------------+----------|`)

  const calcTime: number = endTime - startTime
  let fileName = command.getName()
  let time = calcTime + 'ms'

  if (calcTime >= 100) {
    time = redTextColor(time)
  } else if (calcTime >= 50) {
    time = yellowTextColor(time)
  } else {
    time = greenTextColor(time)
  }

  let status = 'Sucesso'

  if (colLengths[0] > fileName.length) {
    fileName = fill(colLengths[0], fileName)
  }

  if (colLengths[1] > time.length) {
    time = fill(colLengths[1], time)
  }

  if (colLengths[2] > status.length) {
    status = fill(colLengths[2], status)
  }
}

export async function registerEnd() {
  if (process.env.ENV === 'prod' || !process.argv.includes('--verbose')) return
  console.log(`+-----------------------------------------------------+`)
  console.log(`\n`)
}
