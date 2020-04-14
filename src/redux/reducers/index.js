import { combineReducers } from 'redux'
import application from './application'
import rooms from './rooms'
import profiles from './profiles'
import messages from './messages'
export default combineReducers({
  application,
  rooms,
  profiles,
  messages
})
