// some messages needs to be in queue, others does not require
// but when other answers it should have one gate way
const QUEUES_TYPES = ['MESSAGE']
const counter = 3
export const timer = 2000
const queues = {}

const queueCreate = queueType => {
  queues[queueType] = {
    timer,
    counter,
    timeout: null,
    tasks: []
  }
}

export const queueAdd = ({id, task, onTimeout = () => {},  queueType = QUEUES_TYPES[0]}) => {
  if (!queues[queueType]) queueCreate(queueType)

  queues[queueType].tasks.push({ id, task, onTimeout })
}

export const queueRemove = ({queueType = QUEUES_TYPES[0]}) => {
  queues[queueType].tasks.shift()

  clearTimeout(queues[queueType].timeout)

  queues[queueType].timeout = null
  queues[queueType].counter = counter

  queueRun({ queueType })
}

const shouldStopQueue = (queueType) => (!queues[queueType].tasks.length || queues[queueType].timeout)

export const queueRun = ({queueType = QUEUES_TYPES[0]}) => {
  if (shouldStopQueue(queueType)) return

  if (queues[queueType].counter === 0) {
    queues[queueType].tasks[0].onTimeout(queues[queueType].tasks[0])
    queueRemove({ queueType })
    return
  }

  const task = queues[queueType].tasks[0].task

  task()
  setTimeout(() => {
    if (shouldStopQueue(queueType)) return

    queueRun({queueType})

    queues[queueType].counter--
  }, queues[queueType].timer)
}
