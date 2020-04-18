import update from 'immutability-helper'
import {
  PROFILE_CREATE,
  PROFILE_UPDATE,
  PROFILE_CURRENT_USER_CREATE
} from '../ActionTypes'
import { getRoomActive } from './rooms'

export const initialState = {
  profileCurrentUser: ''
}

export default function profiles (state = initialState, action) {
  if (!action.meta) return state
  if (!state[action.meta.currentUserId]) state = update(state, { [action.meta.currentUserId]: { $set: { profiles: {} } } })

  switch (action.type) {
    case PROFILE_CREATE:
      return update(state, {[action.meta.currentUserId]: { profiles: { [action.payload.id]: { $set: action.payload }} }})
    case PROFILE_UPDATE:
      return update(state, {[action.meta.currentUserId]: { profiles: { [action.payload.id]: { $merge: action.payload } } }})
    case PROFILE_CURRENT_USER_CREATE:
      return update(state, { profileCurrentUser: { $set: action.payload } })
    default:
      return state
  }
}

export const getProfilesCurrentUserId = state => state.profiles.profileCurrentUser

export const getProfileCurrentUser = state => {
  if (state.profiles[getProfilesCurrentUserId(state)] && state.profiles[getProfilesCurrentUserId(state)].profiles[getProfilesCurrentUserId(state)]) {
    return state.profiles[getProfilesCurrentUserId(state)].profiles[getProfilesCurrentUserId(state)]
  } else return {}
}

export const getProfiles = state => state.profiles[getProfilesCurrentUserId(state)] ? state.profiles[getProfilesCurrentUserId(state)].profiles : {}
export const getRoomActiveProfiles = state => getRoomActive(state).members ? getRoomActive(state).members.map(id => getProfiles(state)[id]) : []
