import profiles from './profiles'
import { profileCreate, profileUpdate, profileCurrentUserCreate } from '../actions'
import { sharedStateMock } from '../middlewares/actionsSharedState'

describe('profiles reducer', function () {
  const profile = {
    id: '1234',
    firstName: 'firstName',
    lastName: 'lastName',
    avatar: '',
    email: ''
  }
  const currentUserId = '123'

  it('should handle initial state', function () {
    const initialState = {  profileCurrentUser: '' }
    const action = sharedStateMock({}, currentUserId)

    const result = { [currentUserId]: { profiles: {} }, profileCurrentUser: '' }

    expect(profiles(initialState, action)).toEqual(result)
  })

  it('should handle create a room', function () {
    const initialState = {}

    const result = profiles(initialState, sharedStateMock(profileCreate(profile), currentUserId))

    expect(result).toEqual({ [currentUserId]: { profiles: { [profile.id]: profile } } })
  })

  it('should handle update a room', function () {
    const initialState = {
      [currentUserId]: {
        profiles: { [profile.id]: profile }
      },
      profileCurrentUser: ''
    }

    const newProfile = {
      id: '1234',
      firstName: 'firstName2',
      lastName: 'lastName2',
      avatar: '2',
      email: '2'
    }

    const result = profiles(initialState, sharedStateMock(profileUpdate(newProfile), currentUserId))

    expect(result).toEqual({ [currentUserId]: { profiles: { [profile.id]: newProfile } }, profileCurrentUser: '' })
  })

  it('should handle create current user profile', function () {
    const initialState = {
        profileCurrentUser: ''
    }

    const id = '123456'

    const result = profiles(initialState, sharedStateMock(profileCurrentUserCreate(id), currentUserId))

    expect(result).toEqual({ [currentUserId]:{ profiles: {} }, profileCurrentUser: id})
  })
})
