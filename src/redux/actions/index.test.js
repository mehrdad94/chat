import {
  DIALOG_ACTIVE_SET,
  ROOM_CREATE,
  ROOM_UPDATE,
  ROOM_DELETE,
  ROOM_SELECT,
  ROOM_RESET,
  ROOM_CREATE_BATCH,
  ROOM_ONLINE_CREATE,
  ROOM_ONLINE_CREATE_BATCH,
  ROOM_ONLINE_DELETE,
  ROOM_IS_TYPING,
  ROOM_STOPPED_TYPING,
  PROFILE_CREATE,
  PROFILE_UPDATE,
  PROFILE_CURRENT_USER_CREATE,
  MESSAGE_CREATE,
  MESSAGE_UPDATE,
  MESSAGE_DELETE,
  MESSAGE_SENT_CREATE,
  CONNECTION_STATUS_ACTIVATE,
  CONNECTION_STATUS_DEACTIVATE,
  MODE_CREATE
} from '../ActionTypes'

import {
  dialogActiveSet,
  roomCreate,
  roomCreateBatch,
  roomUpdate,
  roomDelete,
  roomSelect,
  roomReset,
  roomOnlineCreate,
  roomOnlineCreateBatch,
  roomOnlineDelete,
  roomIsTyping,
  roomStoppedTyping,
  profileCreate,
  profileUpdate,
  profileCurrentUserCreate,
  messageCreate,
  messageUpdate,
  messageDelete,
  messageSentCreate,
  connectionStatusActivate,
  connectionStatusDeactivate
} from './index'


describe('Actions tests', function () {
  test('It should create an action to show a dialog', function () {
    const dialogName = 'ROOM_DELETE'
    expect(dialogActiveSet(dialogName)).toEqual({
      type: DIALOG_ACTIVE_SET,
      payload: dialogName
    })
  })

  test('It should create an action to create new room', function () {
    const roomInfo = {
      name: 'name',
      publicId: '1234',
      avatar: 'http://...'
    }

    const result = roomCreate(roomInfo)

    delete result.payload.id

    expect(result).toEqual({
      type: ROOM_CREATE,
      payload: roomInfo
    })
  })

  test('It should create an action to create multiple rooms', function () {
    const roomInfo = {
      name: 'name',
      publicId: '1234',
      avatar: 'http://...'
    }

    const result = roomCreateBatch([roomInfo, roomInfo])
    expect(result).toEqual({
      type: ROOM_CREATE_BATCH,
      payload: [roomInfo, roomInfo]
    })
  })

  test('It should create an action to update a room', function () {
    const payload = {
      name: 'name'
    }

    expect(roomUpdate(payload)).toEqual({
      type: ROOM_UPDATE,
      payload
    })
  })

  test('It should create an action to delete a room', function () {
    const id = '123'

    expect(roomDelete(id)).toEqual({
      type: ROOM_DELETE,
      payload: id
    })
  })

  test('It should create an action to select a room', function () {
    const data = '123'

    expect(roomSelect(data)).toEqual({
      type: ROOM_SELECT,
      payload: data
    })
  })

  test('It should create an action to reset room', function () {
    expect(roomReset()).toEqual({
      type: ROOM_RESET
    })
  })

  test('It should create an action to add an online user to his room', function () {
    const userId = '1234'
    const roomId = '1234'
    expect(roomOnlineCreate(userId, roomId)).toEqual({
      type: ROOM_ONLINE_CREATE,
      payload: {
        userId,
        roomId
      }
    })
  })

  test('It should create an action to add online users to their room', function () {
    const userIds = ['1234', '2345']
    const roomId = '1234'
    expect(roomOnlineCreateBatch(userIds, roomId)).toEqual({
      type: ROOM_ONLINE_CREATE_BATCH,
      payload: {
        userIds,
        roomId
      }
    })
  })

  test('It should create an action to delete an online user to his room', function () {
    const userId = '1234'
    const roomId = '1234'
    expect(roomOnlineDelete(userId, roomId)).toEqual({
      type: ROOM_ONLINE_DELETE,
      payload: {
        userId,
        roomId
      }
    })
  })

  test('It should create an action to create typing status', function () {
    const userId = '12'
    const roomId = '21'

    expect(roomIsTyping(roomId, userId)).toEqual({
      type: ROOM_IS_TYPING,
      payload: {
        roomId,
        userId
      }
    })
  })

  test('It should create an action to remove typing status', function () {
    const userId = '12'
    const roomId = '21'

    expect(roomStoppedTyping(roomId, userId)).toEqual({
      type: ROOM_STOPPED_TYPING,
      payload: {
        roomId,
        userId
      }
    })
  })

  test('It should create an action to create a profile', function () {
    const payload = { a: 2 }

    expect(profileCreate(payload)).toEqual({
      type: PROFILE_CREATE,
      payload
    })
  })

  test('It should create an action to update a profile', function () {
    const payload = { a: 2 }

    expect(profileUpdate(payload)).toEqual({
      type: PROFILE_UPDATE,
      payload
    })
  })

  test('It should create an action to create current user profile', function () {
    const payload = '123456'

    expect(profileCurrentUserCreate(payload)).toEqual({
      type: PROFILE_CURRENT_USER_CREATE,
      payload
    })
  })


  test('It should create an action to create new message', function () {
    const messageInfo = {
      name: 'name',
    }
    const roomId = '1'
    const result = messageCreate(messageInfo, roomId)

    delete result.payload.id

    expect(result).toEqual({
      type: MESSAGE_CREATE,
      payload: {
        message: messageInfo,
        roomId
      }
    })
  })

  test('It should create an action to update a message', function () {
    const payload = {
      name: 'name'
    }
    const roomId = '1'

    expect(messageUpdate(payload, roomId)).toEqual({
      type: MESSAGE_UPDATE,
      payload: {
        message: payload,
        roomId
      }
    })
  })

  test('It should create an action to delete a message', function () {
    const id = '123'
    const roomId = '1'

    expect(messageDelete(id, roomId)).toEqual({
      type: MESSAGE_DELETE,
      payload: {
        messageId: id,
        roomId
      }
    })
  })

  test('It should create an action to activate connection status', function () {
    expect(connectionStatusActivate()).toEqual({
      type: CONNECTION_STATUS_ACTIVATE
    })
  })

  test('It should create an action to deactivate connection status', function () {
    expect(connectionStatusDeactivate()).toEqual({
      type: CONNECTION_STATUS_DEACTIVATE
    })
  })

  test('It should create an action to add a seen number to a message', function () {
    const messageId = '1234'
    const roomId = '1234'
    expect(messageSentCreate(messageId, roomId)).toEqual({
      type: MESSAGE_SENT_CREATE,
      payload: {
        messageId,
        roomId
      }
    })
  })
})
