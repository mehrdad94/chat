/* global it expect describe */
import { findIndexB, promiseWithTimeout } from './helper'

describe('should test helper.js', function () {
  it('should test binary search', function () {
    const items = [
      {a: 1},
      {a: 2},
      {a: 3},
      {a: 4}
    ]

    const searchValue = 3

    const compareFunction = item => {
      const value = item.a

      if (searchValue > value) return 1
      else if (searchValue < value) return -1
      else return 0
    }

    const result = findIndexB(compareFunction, items)

    expect(result).toBe(2)
  })

  it('should test binary search with invalid search value ', function () {
    const items = [
      {a: 1},
      {a: 2},
      {a: 3},
      {a: 4}
    ]

    const searchValue = 5

    const compareFunction = item => {
      const value = item.a

      if (searchValue > value) return 1
      else if (searchValue < value) return -1
      else return 0
    }

    const result = findIndexB(compareFunction, items)

    expect(result).toBe(-1)
  })

  it('should test promise with timeout', function (done) {
    const promise = new Promise((resolve, reject) => {
      setTimeout(resolve, 1000)
    })

    promiseWithTimeout(promise, 500).promise.catch(e => {
      expect(e).toBeTruthy()
      done()
    })
  })

  it('should test promise with timeout with different condition', function (done) {
    const promise = new Promise((resolve, reject) => {
      setTimeout(resolve, 1000)
    })

    promiseWithTimeout(promise, 2000).promise.then(() => {
      expect('done').toBeTruthy()
      done()
    })
  })
})
