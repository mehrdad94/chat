import { request } from '../helpers/helper'
import io from 'socket.io-client'
import roomModel, { updateRoomModel } from './models/room.model'
import profileModel from './models/profile.model'

const baseUrl = 'https://api.privatechat.app' // 'http://localhost:5423'

// handle token
export function setToken (token) {
  localStorage.setItem('TOKEN', token)
}

export function getToken () {
  return localStorage.getItem('TOKEN')
}

// handle auth
export function login ({ email, password }) {
  return request(`${baseUrl}/api/auth/login`,{
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
}

export function signUp ({ name, email, password, rePassword }) {
  return request(`${baseUrl}/api/auth/register`,{
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ name, email, password, rePassword })
  })
}

// handle room socket
let roomSocket

// webRTC listeners
const webRTCListeners = {}

export function socketConnect ({
    onSocketConnect,
    onSocketDisconnect,
    onRoomCreate,
    onRoomRead,
    onRoomUpdate,
    onRoomDelete,
    onRoomOnlineUsers,
    onProfileCurrentUser,
    onProfileJoined,
    onProfileDisconnected,
    onMessageCreate,
    onMessagesReceived,
    onRTCConnectionStateConnected,
    onRTCConnectionStateFailed,
    onTyping,
    onSignal,
    onErrorAuthenticate,
    onLocalStreamCreate,
    onRemoteStreamCreate
  }) {
  if (roomSocket) return

  roomSocket = io.connect(`${baseUrl}/sockets/rooms`, {
    'query': 'token=' + getToken()
  })

  roomSocket.on('connect', () => {
    onSocketConnect()
  })

  roomSocket.on('disconnect', () => {
    onSocketDisconnect()
  })
  roomSocket.on('connect_error', (e) => {
    console.error('connect_error', e)
  })
  roomSocket.on('connect_timeout', (timeout) => {
    console.error('connect_timeout', timeout)
  })

  roomSocket.on('CREATE', room => {
    onRoomCreate(roomModel(room))
  })

  roomSocket.on('READ', data => {
    onRoomRead(data.map(roomModel))
  })

  roomSocket.on('UPDATE', room => {
    onRoomUpdate(updateRoomModel(room))
  })

  roomSocket.on('DELETE', room => {
    onRoomDelete(roomModel(room))
  })

  roomSocket.on('ONLINE_USERS', infos => {
    onRoomOnlineUsers(infos.map(info => {
      return {
        ...info,
        users: info.users.map(profileModel)
      }
    }))
  })

  roomSocket.on('JOINED', (user, roomId) => {
    onProfileJoined(profileModel(user), roomId)
  })

  roomSocket.on('CURRENT_USER', user => {
    onProfileCurrentUser(profileModel(user))
  })

  roomSocket.on('DISCONNECTED', (user, roomId) => {
    onProfileDisconnected(profileModel(user), roomId)
  })

  roomSocket.on('SIGNAL', data => {
    onSignal(data)
  })

  roomSocket.on('error', error => {
    console.error(error)
    if (error.type === 'UnauthorizedError' || error.code === 'invalid_token') {
      onErrorAuthenticate()
    }
  })

  // set webRTC listeners
  webRTCListeners['onmessage'] = onMessageCreate
  webRTCListeners['onTyping'] = onTyping
  webRTCListeners['onMessagesReceived'] = onMessagesReceived
  webRTCListeners['onRTCConnectionStateConnected'] = onRTCConnectionStateConnected
  webRTCListeners['onRTCConnectionStateFailed'] = onRTCConnectionStateFailed
  webRTCListeners['onLocalStreamCreate'] = onLocalStreamCreate
  webRTCListeners['onRemoteStreamCreate'] = onRemoteStreamCreate
}

export function apiDisconnect () {
  roomSocket.disconnect()

  roomSocket = null
}

export function apiRoomCreate ({ name, avatar = '', publicId, clb }) {
  roomSocket.emit('CREATE', { name, avatar, publicId }, clb)
}

export function apiRoomUpdate ({ name, avatar = '', newPublicId, publicId, clb }) {
  if (publicId === newPublicId) roomSocket.emit('UPDATE', { name, avatar, publicId }, clb)
  else roomSocket.emit('UPDATE', { name, avatar, newPublicId, publicId }, clb)
}

export function apiRoomJoin ({ publicId, clb }) {
  roomSocket.emit('JOIN', { publicId }, clb)
}

export function apiRoomDelete ({ publicId, clb }) {
  roomSocket.emit('DELETE', { publicId }, clb)
}

export function apiSendIceCandidate (roomId, receiverId, senderId, candidate) {
  roomSocket.emit('SIGNAL', {
    roomId,
    receiverId,
    senderId,
    candidate
  })
}

export function apiSendDescription (roomId, receiverId, senderId, desc) {
  roomSocket.emit('SIGNAL', {
    roomId,
    receiverId,
    senderId,
    desc
  })
}

export function apiSendOfferType (roomId, receiverId, senderId, offerType) {
  roomSocket.emit('SIGNAL', {
    roomId,
    receiverId,
    senderId,
    offerType
  })
}

export function getWebRTCListeners (key) {
  return webRTCListeners[key]
}
