import messages from './messages'
import { sharedStateMock } from '../middlewares/actionsSharedState'

import {
  messageCreate,
  messageDelete,
  messageUpdate,
  messageSentCreate
} from '../actions'

describe('application reducer', function () {
  const message = {
    id: "1",
    senderId: "Profile Id",
    receiverId: "Room Id",
    type: "TEXT",
    body: "dummy text",
    sentTime: "10:00 AM",
    sentCount: 1
  }
  const roomId = '3'
  const currentUserId = '123'
  it('should handle initial state', function () {
    const initialState = {}
    const action = sharedStateMock({}, currentUserId)

    const result = { [currentUserId]: { messages: {} } }

    expect(messages(initialState, action)).toEqual(result)
  })

  it('should handle create message', function () {
    const initialState = {
      [currentUserId]: {
        messages: {}
      }
    }

    const result = messages(initialState, sharedStateMock(messageCreate(message, roomId), currentUserId))

    expect(result).toEqual({ [currentUserId]: { messages: { [roomId]: [message] } } })
  })

  it('should handle update message', function () {
    const initialState = {
      [currentUserId]: {
        messages: {
          [roomId]: [message]
        }
      }
    }

    const updateMessage = {
      id: "1",
      senderId: "Profile Id",
      receiverId: "Room Id 222",
      type: "TEXT",
      body: "dummy text",
      sentTime: "10:00 AM",
      sentCount: 1
    }

    const result = messages(initialState, sharedStateMock(messageUpdate(updateMessage, roomId), currentUserId))

    expect(result).toMatchObject({ [currentUserId]: { messages: {[roomId]: [updateMessage]} } })
  })

  it('should handle delete message', function () {
    const initialState = {
      [currentUserId]: {
        messages: {
          [roomId]: [message]
        }
      }
    }

    const result = messages(initialState, sharedStateMock(messageDelete(message.id, roomId), currentUserId))

    expect(result).toEqual({ [currentUserId]: { messages: { [roomId]: [] } } })
  })

  it('should minus one to message sent count ', function () {
    const initialState = {
      [currentUserId]: {
        messages: {
          [roomId]: [message]
        }
      }
    }

    const updateMessage = {
      id: "1",
      senderId: "Profile Id",
      receiverId: "Room Id",
      type: "TEXT",
      body: "dummy text",
      sentTime: "10:00 AM",
      status: "SENT",
      sentCount: 0
    }

    const result = messages(initialState, sharedStateMock(messageSentCreate(message.id, roomId), currentUserId))

    expect(result).toEqual({ [currentUserId]: { messages: {[roomId]: [updateMessage]} } })
  })
})
