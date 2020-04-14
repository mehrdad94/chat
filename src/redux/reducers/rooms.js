import update from 'immutability-helper'
import {
  ROOM_CREATE,
  ROOM_CREATE_BATCH,
  ROOM_UPDATE,
  ROOM_DELETE,
  ROOM_SELECT,
  ROOM_RESET,
  ROOM_ONLINE_CREATE,
  ROOM_ONLINE_CREATE_BATCH,
  ROOM_ONLINE_DELETE,
  ROOM_IS_TYPING,
  ROOM_STOPPED_TYPING
} from '../ActionTypes'
import constants from '../../configs/constants.json'
import { getProfilesCurrentUserId } from './profiles'

export const initialState = {}

const getRoomStatus = room => {
  if (room.meta.membersOnline.length > 1) return constants.ROOM_STATUS[1]
  else return constants.ROOM_STATUS[0]
}

export default function rooms (state = initialState, action) {
  if (!action.meta) return state
  if (!state[action.meta.currentUserId]) state = update(state, { [action.meta.currentUserId]: { $set: { rooms: [], roomsActive: '' } } })

  switch (action.type) {
    case ROOM_CREATE:
      return update(state, {[action.meta.currentUserId]: {rooms: { $push: [ action.payload ] }}})
    case ROOM_CREATE_BATCH:
      return update(state, {[action.meta.currentUserId]: {rooms: { $push: action.payload }}})
    case ROOM_UPDATE: {
      const index = state[action.meta.currentUserId].rooms.findIndex(x => x.id === action.payload.id)

      return update(state, {[action.meta.currentUserId]: {rooms: {[index]: { $merge: action.payload }}}})
    }
    case ROOM_DELETE: {
      const index = state[action.meta.currentUserId].rooms.findIndex(x => x.id === action.payload)

      return update(state, {[action.meta.currentUserId]: { rooms: { $splice: [[index, 1]] } } })
    }
    case ROOM_SELECT:
      return update(state, {[action.meta.currentUserId]: { roomsActive: { $set: action.payload }}})
    case ROOM_RESET:
      return update(state,  {[action.meta.currentUserId]: { rooms: { $set: [] } }})
    case ROOM_ONLINE_CREATE: {
      const index = state[action.meta.currentUserId].rooms.findIndex(x => x.id === action.payload.roomId)

      const newState = update(state, {[action.meta.currentUserId]: {rooms: {[index]: { meta: { membersOnline: { $push: [action.payload.userId] } } }}}})

      const status = getRoomStatus(newState[action.meta.currentUserId].rooms[index])

      return update(newState, {[action.meta.currentUserId]: {rooms: { [index]: { status: { $set: status } }} }})
    }
    case ROOM_ONLINE_CREATE_BATCH: {
      const index = state[action.meta.currentUserId].rooms.findIndex(x => x.id === action.payload.roomId)

      if (index === -1) return state
      const newState = update(state, {[action.meta.currentUserId]: {rooms: {[index]: { meta: { membersOnline: { $push: action.payload.userIds } } }}}})

      const status = getRoomStatus(newState[action.meta.currentUserId].rooms[index])

      return update(newState, {[action.meta.currentUserId]: {rooms: { [index]: { status: { $set: status } } }}})
    }
    case ROOM_ONLINE_DELETE: {
      const index = state[action.meta.currentUserId].rooms.findIndex(x => x.id === action.payload.roomId)

      const newState = update(state, {[action.meta.currentUserId]: {rooms: {[index]: { meta: { membersOnline: { $splice: [[index, 1]] } }} }}})

      const status = getRoomStatus(newState[action.meta.currentUserId].rooms[index])

      return update(newState, {[action.meta.currentUserId]: {rooms: { [index]: { status: { $set: status } } }}})
    }
    case ROOM_IS_TYPING: {
      const index = state[action.meta.currentUserId].rooms.findIndex(x => x.id === action.payload.roomId)

      if (state[action.meta.currentUserId].rooms[index].meta.membersTyping[action.payload.userId]) return state
      else return update(state, {[action.meta.currentUserId]: {rooms: {[index]: { meta: { membersTyping: {[action.payload.userId]: { $set: 1 }}}}}} })
    }
    case ROOM_STOPPED_TYPING: {
      const index = state[action.meta.currentUserId].rooms.findIndex(x => x.id === action.payload.roomId)
      if (!state[action.meta.currentUserId].rooms[index].meta.membersTyping[action.payload.userId]) return state
      else return update(state, {[action.meta.currentUserId]: { rooms: {[index]: { meta: { membersTyping: {$unset: [action.payload.userId]}}}}} })
    }
    default: return state
  }
}

export const getRooms = state => state.rooms[getProfilesCurrentUserId(state)] ? state.rooms[getProfilesCurrentUserId(state)].rooms : []
export const getRoomActive = state => state.rooms[getProfilesCurrentUserId(state)] ? state.rooms[getProfilesCurrentUserId(state)].rooms.find(x => x.id === getRoomActiveId(state)) || {} : {}
export const getRoomActiveId = state => state.rooms[getProfilesCurrentUserId(state)] ? state.rooms[getProfilesCurrentUserId(state)].roomsActive : ''
export const getRoomActiveStatus = state => getRoomActive(state).status ? getRoomActive(state).status : constants.ROOM_STATUS[0]