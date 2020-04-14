import update from 'immutability-helper'
import { getProfilesCurrentUserId } from './profiles'
import {
  DIALOG_ACTIVE_SET,
  CONNECTION_STATUS_ACTIVATE,
  CONNECTION_STATUS_DEACTIVATE
} from '../ActionTypes'
import constants from '../../configs/constants.json'
export const initialState = {}

export default function application (state = initialState, action) {
  if (!action.meta) return state

  if (!action.meta.currentUserId) return state
  if (!state[action.meta.currentUserId]) state = update(state, { [action.meta.currentUserId]: { $set: { connectionStatus: constants.CONNECTION_STATUS[0]} } })

  switch (action.type) {
    case DIALOG_ACTIVE_SET:
      return update(state, { [action.meta.currentUserId]: { dialogActive: { $set: action.payload } } })
    case CONNECTION_STATUS_ACTIVATE:
      return update(state, { [action.meta.currentUserId]: { connectionStatus: { $set: constants.CONNECTION_STATUS[1] }}})
    case CONNECTION_STATUS_DEACTIVATE:
      return update(state, { [action.meta.currentUserId]: { connectionStatus: { $set: constants.CONNECTION_STATUS[0] }}})
    default: return state
  }
}

export const getDialogActive = state => state.application[getProfilesCurrentUserId(state)] ? state.application[getProfilesCurrentUserId(state)].dialogActive : ''
export const getConnectionStatus = state => state.application[getProfilesCurrentUserId(state)] ? state.application[getProfilesCurrentUserId(state)].connectionStatus : constants.CONNECTION_STATUS[0]
