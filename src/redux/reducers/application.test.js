import application from './application'
import { sharedStateMock } from '../middlewares/actionsSharedState'
import {
  dialogActiveSet,
  connectionStatusActivate,
  connectionStatusDeactivate
} from '../actions'
import constants from '../../configs/constants.json'

describe('application reducer', function () {
  let initialState

  beforeEach(() => {
    initialState = {}
  })
  const currentUserId = '123'
  it('should handle initial state', function () {
    const initialState = {}
    const action = sharedStateMock({}, currentUserId)

    const result = { [currentUserId]: { connectionStatus: constants.CONNECTION_STATUS[0] } }

    expect(application(initialState, action)).toEqual(result)
  })

  it('should show create new room', function () {
    const dialogName = 'a name'

    expect(application(initialState, sharedStateMock(dialogActiveSet(dialogName), currentUserId))).toEqual({
      [currentUserId]: {
        dialogActive: dialogName,
        connectionStatus: constants.CONNECTION_STATUS[0]
      }
    })
  })

  it('should activate connection status', function () {
    expect(application(initialState, sharedStateMock(connectionStatusActivate(), currentUserId))).toEqual({
      [currentUserId]: {
        connectionStatus: constants.CONNECTION_STATUS[1]
      }
    })
  })

  it('should deactivate connection status', function () {
    expect(application(initialState, sharedStateMock(connectionStatusDeactivate(), currentUserId))).toEqual({
      [currentUserId]: {
        connectionStatus: constants.CONNECTION_STATUS[0]
      }
    })
  })
})