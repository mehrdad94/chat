const counter = 3
export const timer = 2000

const taskList = {}

const taskCreate = (id, task, onTimeout) => {
  taskList[id] = {
    id,
    task,
    timer,
    counter,
    onTimeout,
    timeout: null
  }
}

export const taskListAdd = ({id, task, onTimeout = () => {}}) => {
  taskCreate(id, task, onTimeout)

  taskListRun(id)
}

const taskListRun = id => {
  if (taskList[id].counter === 0) {
    taskList[id].onTimeout(taskList[id])
    taskListRemove(id)
    return
  }

  taskList[id].task()

  taskList[id].timeout = setTimeout(function () {
    taskList[id].counter--

    taskListRun(id)
  }, taskList[id].timer)
}

export const taskListRemove = id => {
  clearTimeout(taskList[id].timeout)

  delete taskList[id]
}