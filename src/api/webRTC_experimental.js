import { apiSendDescription, apiSendIceCandidate, getWebRTCListeners } from './index'
import { getIceServers, createPeerId, extractInfoFromPeerId } from './webRTC_helpers'
import { queueRemove } from '../helpers/queue'
import typingModel from './models/typing.model'
import replyModel from './models/reply.model'
import constants from '../configs/constants.json'

const RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription
const RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate

let RTCPeerConnection00
if (typeof window.RTCPeerConnection !== 'undefined') {
  RTCPeerConnection00 = window.RTCPeerConnection
} else if (typeof window.mozRTCPeerConnection !== 'undefined') {
  RTCPeerConnection00 = window.mozRTCPeerConnection
} else if (typeof window.webkitRTCPeerConnection !== 'undefined') {
  RTCPeerConnection00 = window.webkitRTCPeerConnection
}

const peerConnectionConfig = { iceServers: getIceServers() }

const peerConnections = {}
const dataChannels = {}
const peerConnectionDoubleChannelCreate = {} // prevent creating more than one offer, ...
const peerConnectionDoubleOfferCreate = {}
const peerConnectionIceQueue = {}

let localStream

export async function getStream (type = constants.STREAM_TYPES[0]) {
  let constraints

  if (type === constants.STREAM_TYPES[0]) {
    constraints = { video: false, audio: true }
  } else if (type === constants.STREAM_TYPES[1]) {
    constraints = { video: true, audio: false }
  } else {
    constraints = { video: true, audio: true }
  }

  if (!localStream) localStream = await navigator.mediaDevices.getUserMedia(constraints)

  return localStream
}

export function createPeerConnection({ peerId }) {
  const peerConnection = new RTCPeerConnection00(peerConnectionConfig)

  peerConnection.onicecandidate = ({ candidate }) => {
    const [roomId, receiverId, senderId] = extractInfoFromPeerId(peerId)

    if (candidate) apiSendIceCandidate(roomId, receiverId, senderId, candidate)
  }

  peerConnection.onconnectionstatechange = () => {
    switch(peerConnection.connectionState) {
      case 'connected':
        // The connection has become fully connected
        getWebRTCListeners('onRTCConnectionStateConnected')({ state: peerConnection.connectionState, peerId })
        break
      case 'disconnected':
      case 'failed':
      case 'closed':
        closeAPeer(peerId)

        getWebRTCListeners('onRTCConnectionStateFailed')({ state: peerConnection.connectionState, peerId })
        break
      default:
        break;
    }
  }

  peerConnection.ondatachannel = event => {
    setChannelEvents({ channel: event.channel, peerId })
  }

  peerConnection.onaddstream = event => {
    getWebRTCListeners('onRemoteStreamCreate')({ stream: event.stream, peerId })
  }

  peerConnections[peerId] = peerConnection

  return peerConnection
}

function setChannelEvents ({ channel, peerId, onopen }) {
  const [roomId, receiverId, senderId] = extractInfoFromPeerId(peerId)

  channel.onmessage = async message => {
    const data = JSON.parse(message.data)
    const type = data.type

    switch (type) {
      case constants.MESSAGE_TYPES[0]:
        getWebRTCListeners('onmessage')({roomId: data.roomId, userId: data.senderId, message: data})

        // // send that message to others on networks
        // const nodeConnections = getNodeConnections(roomId, senderId)
        // const nodeReceivers = nodeConnections.filter(id => id !== receiverId)
        // nodeReceivers.forEach(async id => {
        //   await sendMessage({
        //     roomId,
        //     receiverId: id,
        //     senderId,
        //     type: data.type,
        //     message: data
        //   })
        // })

        // send a reply
        await sendMessage({ roomId, senderId, receiverId, message: { id: data.id }, type: constants.DATA_CHANNEL_MESSAGE_TYPES[1] })
        break
      case constants.DATA_CHANNEL_MESSAGE_TYPES[0]:
        getWebRTCListeners('onTyping')(data)
        break
      case constants.DATA_CHANNEL_MESSAGE_TYPES[1]:
        // sent message response
        getWebRTCListeners('onMessagesReceived')({ ...data })

        queueRemove({})
        break
      default:
        throw new Error('unknown data type')
    }
  }

  channel.onopen = () => {
    dataChannels[peerId] = channel

    if (onopen) onopen(channel)
  }
  channel.onclose = () => {
    delete dataChannels[peerId]
  }

  channel.onerror = event => {
    if (event.target.readyState === 'closed') {
      if (dataChannels[peerId]) delete dataChannels[peerId]
    }
    console.error('WebRTC DataChannel error', event)
  }
}
export function closeAPeer (peerId) {
  if (!peerConnections[peerId]) return

  peerConnections[peerId].close()
  if (dataChannels[peerId]) dataChannels[peerId].close()
  // stop streams too
  delete peerConnections[peerId]
  delete dataChannels[peerId]
  delete peerConnectionDoubleChannelCreate[peerId]
  delete peerConnectionDoubleOfferCreate[peerId]
}

export function createDataChannel (peerId, channelName = 'sctp-channel') {
  return new Promise((resolve, reject) => {
    function checkDataChannelReadyState () {
      if (!dataChannels[peerId]) reject('Data Channel does not exist')
      if (dataChannels[peerId].readyState === 'open') resolve(dataChannels[peerId])
      else setTimeout(checkDataChannelReadyState, 1000)
    }

    if (dataChannels[peerId]) {
      checkDataChannelReadyState()
    } else if (!peerConnectionDoubleChannelCreate[peerId]) {
      console.log('data channel create')
      peerConnectionDoubleChannelCreate[peerId] = true

      dataChannels[peerId] = peerConnections[peerId].createDataChannel(channelName, {})

      setChannelEvents({ channel: dataChannels[peerId], peerId, onopen: (channel) => { resolve (channel) } })
    }
  })
}

export async function createOffer ({ peerId, offerType = constants.OFFER_TYPE[0] }) {
  const peerConnection = peerConnections[peerId]

  const desc = await peerConnection.createOffer()

  await peerConnection.setLocalDescription(desc)

  const [roomId, receiverId, senderId] = peerId.split('/')

  apiSendDescription(roomId, receiverId, senderId, desc, offerType)
}

export async function createAnswer ({roomId, receiverId, senderId, desc}) {
  // receiver is current user sender is opponent so we switch ids so in create message have save id
  const peerId = createPeerId(roomId, senderId, receiverId)

  if (!peerConnections[peerId]) createPeerConnection({ peerId })

  const peerConnection = peerConnections[peerId]

  await peerConnection.setRemoteDescription(new RTCSessionDescription(desc))

  const localDesc = await peerConnection.createAnswer()

  await peerConnection.setLocalDescription(localDesc)

  // we switch sender and receiver again because we are answering
  apiSendDescription(roomId, senderId, receiverId, localDesc)
}

export async function answer ({roomId, receiverId, senderId, desc}) {
  const peerId = createPeerId(roomId, senderId, receiverId)

  const peerConnection = peerConnections[peerId]

  await peerConnection.setRemoteDescription(new RTCSessionDescription(desc))
}

export async function addIceCandidate ({roomId, receiverId, senderId, candidate}) {
  const peerId = createPeerId(roomId, senderId, receiverId)

  const peerConnection = peerConnections[peerId]

  if (!peerConnection) throw new Error('unknown candidate')

  peerConnection.addIceCandidate(new RTCIceCandidate({
    sdpMLineIndex: candidate.sdpMLineIndex,
    candidate: candidate.candidate
  })).then(() => {
  }).catch(error => {
    console.error('Ice candidate failed', error)
  })
}

export async function sendMessage ({ roomId, receiverId, senderId, ownerId = senderId, message, type = constants.MESSAGE_TYPES[0] }) {
  const peerId = `${roomId}/${receiverId}/${senderId}`

  if (!peerConnections[peerId]) createPeerConnection({ peerId })

  createDataChannel(peerId).then( channel => {
    if (type === constants.MESSAGE_TYPES[0]) channel.send(JSON.stringify(message))
    else if (type === constants.DATA_CHANNEL_MESSAGE_TYPES[0]) channel.send(JSON.stringify(typingModel(roomId, senderId, ownerId)))
    else if (type === constants.DATA_CHANNEL_MESSAGE_TYPES[1]) channel.send(JSON.stringify(replyModel(roomId, message.id)))
  })

  if (peerConnections[peerId].iceConnectionState === 'new' && !peerConnectionDoubleOfferCreate[peerId]) {
    peerConnectionDoubleOfferCreate[peerId] = true
    await createOffer({ peerId })
  }
}

export async function call ({ roomId, receiverId, senderId, type = constants.STREAM_TYPES[0] }) {
  const peerId = `${roomId}/${receiverId}/${senderId}`

  const stream = await getStream(type)

  if (!stream) return

  getWebRTCListeners('onLocalStreamCreate')({ stream, type })

  if (!peerConnections[peerId]) createPeerConnection({ peerId })

  peerConnections[peerId].addStream(stream)

  await createOffer({ peerId, offerType: constants.OFFER_TYPE[1] })
}
