import { MESSAGE_CREATE, MESSAGE_DELETE, MESSAGE_UPDATE } from '../ActionTypes'
import update from 'immutability-helper'
import { getProfilesCurrentUserId } from './profiles'
import { getRoomActiveId } from './rooms'

export const initialState = {}

export default function messages (state = initialState, action) {
  if (!action.meta) return state
  if (!state[action.meta.currentUserId]) state = update(state, { [action.meta.currentUserId]: { $set: { messages: {} } } })

  switch (action.type) {
    case MESSAGE_CREATE: {
      let newState

      if (!state[action.meta.currentUserId].messages[action.payload.roomId]) {
        newState = update(state, {[action.meta.currentUserId]: { messages: { [action.payload.roomId]: { $set: [] } }}})
      } else {
        newState = state
      }

      if (newState[action.meta.currentUserId].messages[action.payload.roomId].findIndex(m => m.id === action.payload.message.id) !== -1) return state

      return update(newState, {[action.meta.currentUserId]: { messages: {[action.payload.roomId]: { $push: [ action.payload.message ] }} } })
    }

    case MESSAGE_UPDATE: {
      const index = state[action.meta.currentUserId].messages[action.payload.roomId].findIndex(x => x.id === action.payload.message.id)

      return update(state, {[action.meta.currentUserId]: { messages: {[action.payload.roomId]: {[index]: { $merge: action.payload.message }}}}})
    }
    case MESSAGE_DELETE: {
      const index = state[action.meta.currentUserId].messages[action.payload.roomId].findIndex(x => x.id === action.payload.messageId)

      return update(state, {[action.meta.currentUserId]: { messages: {[action.payload.roomId]: { $splice: [[index, 1]] } }} })
    }
    default: return state
  }
}

export const getMessagesFromActiveRoom = state => state.messages[getProfilesCurrentUserId(state)] ? state.messages[getProfilesCurrentUserId(state)].messages[getRoomActiveId(state)] || [] : []
