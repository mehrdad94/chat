import { queueAdd, queueRemove, queueRun, timer } from './queue'

jest.setTimeout(15000)

describe('Test queue helper', () => {
  let task

  beforeEach(function () {
    task = jest.fn()
  })

  it('should run a task just once', function (done) {
    queueAdd({ task })

    queueRun({})
    queueRemove({})

    setTimeout(function () {
      expect(task).toBeCalledTimes(1)
      done()
    }, timer + 10)
  })

  it('should run a task 4 times with 3 times retry', function (done) {
    const onTimeout = jest.fn()

    queueAdd({ task, onTimeout })

    queueRun({})

    setTimeout(function () {
      expect(task).toBeCalledTimes(4)
      expect(onTimeout).toBeCalled()
      done()
    }, 4 * timer + 10)
  })

  it('should run multiple tasks', function (done) {
    const task2 = jest.fn()
    queueAdd({task, id: 'task'})
    queueAdd({task: task2, id: 'task2'})

    queueRun({})
    queueRemove({})

    expect(task).toBeCalled()

    setTimeout(() => {
      queueRemove({})
      expect(task2).toHaveBeenCalledTimes(3)
      done()
    }, timer + 10)
  })
})
