import curry from 'ramda/src/curry'

// find with binary search
export const findIndexB = curry((compareFn, ar) => {
  let m = 0
  let n = ar.length - 1
  while (m <= n) {
    let k = (n + m) >> 1
    let cmp = compareFn(ar[k])
    if (cmp === undefined) throw new Error('compare function should return a number')
    if (cmp > 0) {
      m = k + 1
    } else if (cmp < 0) {
      n = k - 1
    } else {
      return k
    }
  }

  return -1
})

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON, status from the response
 */
function parseJSON(response) {
  return new Promise((resolve) => response.json()
    .then((json) => resolve({
      status: response.status,
      ok: response.ok,
      json
    })))
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {Promise}           The request promise
 */
export function request (url, options) {
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(parseJSON)
      .then((response) => {
        if (response.ok) {
          return resolve(response.json)
        }
        // extract the error from the server's json
        return reject(response.json.meta.error)
      })
      .catch((error) => reject({
        networkError: error.message
      }))
  })
}

// pubsub
export const eventManage = (function() {
  const events = {}

  const publish = function (name, data) {
    const handlers = events[name]
    if(!!handlers === false) return
    handlers.forEach(function(handler) {
      handler.call(this, data)
    })
  }

  const subscribe = function (name, handler) {
    let handlers = events[name]
    if(!!handlers === false) {
      handlers = events[name] = []
    }
    handlers.push(handler)
  }

  const unsubscribe = function (name, handler) {
    const handlers = events[name]
    if(!!handlers === false) return

    const handlerIdx = handlers.indexOf(handler)
    handlers.splice(handlerIdx)
  }

  return {
    publish,
    subscribe,
    unsubscribe
  }
})()

const receivedTypings = {}

export const typingReceivedHelper = (roomId, userId, startClb, finishClb) => {
  const id = `${roomId}/${userId}`

  if (!receivedTypings[id]) receivedTypings[id] = { period: 3000, timeout: null }

  // reset timeout
  if (receivedTypings[id].timeout) {
    clearTimeout(receivedTypings[id].timeout)
    receivedTypings[id].timeout = null
  } else startClb()

  // start time out
  receivedTypings[id].timeout = setTimeout(() => {
    finishClb()
    receivedTypings[id].timeout = null
  }, receivedTypings[id].period)

  return () => {
    clearTimeout(receivedTypings[id].timeout)
    receivedTypings[id].timeout = null
  }
}

// track typing and send typing request on specific interval
const sentTypings = {}
export const typingSentHelper = (roomId, userId, clb) => {
  const id = `${roomId}/${userId}`

  if (!sentTypings[id]) sentTypings[id] = { period: 3000, timeout: null }

  if (sentTypings[id].timeout) return

  clb()

  sentTypings[id].timeout = setTimeout(() => {
    sentTypings[id].timeout = null
  }, sentTypings[id].period)
}
