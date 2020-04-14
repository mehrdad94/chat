import {
  DIALOG_ACTIVE_SET,
  ROOM_CREATE,
  ROOM_CREATE_BATCH,
  ROOM_UPDATE,
  ROOM_DELETE,
  ROOM_SELECT,
  ROOM_RESET,
  ROOM_ONLINE_CREATE,
  ROOM_ONLINE_DELETE,
  ROOM_ONLINE_CREATE_BATCH,
  ROOM_IS_TYPING,
  ROOM_STOPPED_TYPING,
  PROFILE_CREATE,
  PROFILE_CURRENT_USER_CREATE,
  PROFILE_UPDATE,
  MESSAGE_CREATE,
  MESSAGE_UPDATE,
  MESSAGE_DELETE,
  CONNECTION_STATUS_ACTIVATE,
  CONNECTION_STATUS_DEACTIVATE
} from '../ActionTypes'

export const dialogActiveSet = (dialogName) => ({
    type: DIALOG_ACTIVE_SET,
    payload: dialogName
})

export const connectionStatusActivate = () => ({
  type: CONNECTION_STATUS_ACTIVATE
})

export const connectionStatusDeactivate = () => ({
  type: CONNECTION_STATUS_DEACTIVATE
})

export const roomCreate = (room) => ({
    type: ROOM_CREATE,
    payload: room
})

export const roomCreateBatch = (rooms) => ({
    type: ROOM_CREATE_BATCH,
    payload: rooms
})

export const roomUpdate = (room) => ({
    type: ROOM_UPDATE,
    payload: room
})

export const roomDelete = (id) => ({
    type: ROOM_DELETE,
    payload: id
})

export const roomReset = () => ({
    type: ROOM_RESET
})

export const roomSelect = id => ({
    type: ROOM_SELECT,
    payload: id
})

export const roomOnlineCreate = (userId, roomId) => ({
    type: ROOM_ONLINE_CREATE,
    payload: {
      userId,
      roomId
    }
})

export const roomOnlineCreateBatch = (userIds, roomId) => ({
    type: ROOM_ONLINE_CREATE_BATCH,
    payload: {
      userIds,
      roomId
    }
})

export const roomOnlineDelete = (userId, roomId) => ({
    type: ROOM_ONLINE_DELETE,
    payload: {
      userId,
      roomId
    }
})

export const roomIsTyping = (roomId, userId) => ({
    type: ROOM_IS_TYPING,
    payload: {
      userId,
      roomId
    }
})

export const roomStoppedTyping = (roomId, userId) => ({
    type: ROOM_STOPPED_TYPING,
    payload: {
      userId,
      roomId
    }
})

export const profileCreate = payload => ({
    type: PROFILE_CREATE,
    payload
})

export const profileUpdate = payload => ({
    type: PROFILE_UPDATE,
    payload
})

export const profileCurrentUserCreate = id => ({
    type: PROFILE_CURRENT_USER_CREATE,
    payload: id
})

export const messageCreate = (message, roomId) => ({
    type: MESSAGE_CREATE,
    payload: {
      message,
      roomId
    }
})

export const messageUpdate = (message, roomId) => ({
    type: MESSAGE_UPDATE,
    payload: {
      message,
      roomId
    }
})

export const messageDelete = (messageId, roomId) => ({
    type: MESSAGE_DELETE,
    payload: {
      messageId,
      roomId
    }
})
