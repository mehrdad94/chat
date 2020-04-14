import rooms from './rooms'
import {
  roomCreate,
  roomCreateBatch,
  roomDelete,
  roomReset,
  roomSelect,
  roomUpdate,
  roomOnlineCreate,
  roomOnlineCreateBatch,
  roomOnlineDelete,
  roomIsTyping,
  roomStoppedTyping
} from '../actions'
import { sharedStateMock } from '../middlewares/actionsSharedState'

import constants from '../../configs/constants.json'

describe('application reducer', function () {
  const room = {
    id: '1',
    name: 'name',
    publicId: 'publicId',
    avatar: 'avatar',
    status: constants.ROOM_STATUS[0],
    notification: 0,
    members: [],
    meta: {
      membersOnline: [],
      membersTyping: {}
    }
  }
  const currentUserId = '123'

  it('should handle initial state', function () {
    const initialState = {}
    const action = sharedStateMock({}, currentUserId)

    const result = { [currentUserId]: { rooms: [], roomsActive: '' }}

    expect(rooms(initialState, action)).toEqual(result)
  })

  it('should handle create room', function () {
    const initialState = {
    }

    const result = rooms(initialState, sharedStateMock(roomCreate(room), currentUserId))

    expect(result).toEqual({[currentUserId]: { rooms: [room], roomsActive: '' }})
  })

  it('should handle create batch rooms', function () {
    const initialState = {}

    const result = rooms(initialState, sharedStateMock(roomCreateBatch([room, room, room]), currentUserId))

    expect(result).toEqual({ [currentUserId]: {rooms: [room, room, room], roomsActive: '' }})
  })

  it('should handle update room', function () {
    const initialState = {
      [currentUserId]: {
        rooms: [room],
        roomsActive: room.id
      }
    }

    const updateRoom = {
      id: '1',
      name: 'name1',
      publicId: 'publicId1',
      avatar: 'avatar1'
    }

    const result = rooms(initialState, sharedStateMock(roomUpdate(updateRoom), currentUserId))

    expect(result).toMatchObject({[currentUserId]:{ rooms: [updateRoom], roomsActive: updateRoom.id }})
  })

  it('should handle delete room', function () {
    const initialState = {
      [currentUserId]: {
        rooms: [room],
        roomsActive: room.id
      }
    }

    const result = rooms(initialState, sharedStateMock(roomDelete(room.id), currentUserId))

    expect(result).toEqual({[currentUserId]: { rooms: [], roomsActive: room.id }})
  })

  it('should handle room select', function () {
    const initialState = {
      [currentUserId]: {
        roomsActive: ''
      }
    }

    const result = rooms(initialState, sharedStateMock(roomSelect(room.id), currentUserId))

    expect(result).toEqual({ [currentUserId]: {roomsActive: room.id }})
  })

  it('should handle room reset', function () {
    const initialState = {
      [currentUserId]: {
        rooms: [room, room]
      }
    }

    const result = rooms(initialState, sharedStateMock(roomReset(), currentUserId))

    expect(result).toEqual({ [currentUserId]: { rooms: []} })
  })

  it('should handle room online add', function () {
    const initialState = {
      [currentUserId]: {
        rooms: [room]
      }
    }
    const userId = '1234'
    const roomId = room.id

    const result = rooms(initialState, sharedStateMock(roomOnlineCreate(userId, roomId), currentUserId))

    expect(result).toEqual( {[currentUserId]: { rooms: [Object.assign({}, room, { meta: {membersOnline:[userId], membersTyping: {}}})] }} )
  })

  it('should handle room online batch add', function () {
    const initialState = {
      [currentUserId]: {
        rooms: [room]
      }
    }
    const userIds = ['1234', '4321']
    const roomId = room.id

    const result = rooms(initialState, sharedStateMock(roomOnlineCreateBatch(userIds, roomId), currentUserId))

    expect(result).toEqual( {[currentUserId]: {rooms: [Object.assign({}, room, { status: 'ONLINE', meta: {membersOnline: userIds, membersTyping: {}}})] }} )
  })

  it('should handle room online remove', function () {
    const userId = '1234'
    const roomId = room.id

    const initialState = {
      [currentUserId]: {
        rooms: [Object.assign({}, room, { meta: {membersOnline:[userId], membersTyping: {}}})]
      }
    }

    const result = rooms(initialState, sharedStateMock(roomOnlineDelete(userId, roomId), currentUserId))

    expect(result).toEqual( {[currentUserId]: { rooms: [room] } })
  })

  it('should handle room add typing', function () {
    const userId = '1234'
    const roomId = room.id

    const initialState = {
      [currentUserId]: {
        rooms: [room]
      }
    }

    const result = rooms(initialState, sharedStateMock(roomIsTyping(roomId, userId), currentUserId))

    expect(result).toEqual( { [currentUserId]: {rooms: [Object.assign({}, room, { meta: {membersOnline: [], membersTyping: {[userId]: 1}}})]} } )
  })

  it('should handle room remove typing', function () {
    const userId = '1234'
    const roomId = room.id

    const initialState = {
      [currentUserId]: {
        rooms: [Object.assign({}, room, { meta: {membersOnline: [], membersTyping: {[userId]: 1}}})]
      }
    }

    const result = rooms(initialState, sharedStateMock(roomStoppedTyping(roomId, userId), currentUserId))

    expect(result).toEqual( {[currentUserId]: { rooms: [room] } })
  })
})
