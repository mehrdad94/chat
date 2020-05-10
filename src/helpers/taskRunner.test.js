import { taskListAdd, taskListRemove, timer } from './taskRunner'

jest.setTimeout(15000)

describe('Test task runner', function () {
  let task
  const id = 123
  beforeEach(function () {
    task = jest.fn()
  })
  it('should run a task just once', function (done) {
    taskListAdd({ id, task })
    taskListRemove(id)

    setTimeout(function () {
      expect(task).toHaveBeenCalledTimes(1)
      done()
    }, timer * 2)
  })
  it('should run a task 3 times', function (done) {
    const onTimeout = jest.fn()
    taskListAdd({ id, task, onTimeout })

    setTimeout(function () {
      expect(task).toHaveBeenCalledTimes(3)
      expect(onTimeout).toHaveBeenCalled()
      done()
    }, timer * 4 + 10)
  })
})