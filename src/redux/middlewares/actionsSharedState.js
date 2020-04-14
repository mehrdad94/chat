import { getProfilesCurrentUserId } from '../reducers/profiles'

export default store => next => action => {
  if (!action.meta) action.meta = {}

  action.meta.currentUserId = getProfilesCurrentUserId(store.getState())

  return next(action)
}

export const sharedStateMock = (action, userId) => {
  if (!action.meta) action.meta = {}

  action.meta.currentUserId = userId

  return action
}
