import { apiSendDescription, apiSendIceCandidate, getWebRTCListeners, apiSendOfferType } from './index'
import { getIceServers, createPeerId, extractInfoFromPeerId } from './webRTC_helpers'
import { queueRemove } from '../helpers/queue'
import typingModel from './models/typing.model'
import replyModel from './models/reply.model'
import constants from '../configs/constants.json'
import { eventManage, retryOperation } from '../helpers/helper'

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

const dataChannelText = 'sctp-channel'
const dataChannelFile = 'sctp-file-channel'

const peerConnectionConfig = { iceServers: getIceServers() }

const peerConnections = {}
const dataChannels = {}
const peerConnectionDoubleChannelCreate = {} // prevent creating more than one offer, ...
const peerConnectionDoubleOfferCreate = {}

let localStream
let localDisplayStream

export async function getStream (type = constants.STREAM_TYPES[0]) {
  let constraints
  let displayConstraints
  if (type === constants.STREAM_TYPES[0]) {
    constraints = { video: false, audio: true }
  } else if (type === constants.STREAM_TYPES[1]) {
    constraints = { video: true, audio: false }
  } else {
    constraints = { video: { width: 1280, height: 720 }, audio: true }
    displayConstraints = { video: { width: 250, height: 125 }, audio: true }
  }

  if (!localStream) localStream = await navigator.mediaDevices.getUserMedia(constraints)
  if (!localDisplayStream) localDisplayStream = await navigator.mediaDevices.getUserMedia(displayConstraints)

  return {
    localStream,
    localDisplayStream
  }
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
    console.log(message, channel)
    if (channel.label === dataChannelText) {
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
    } else {
      console.log(message.data)
    }
  }

  channel.onopen = () => {
    if (!dataChannels[peerId]) dataChannels[peerId] = {}

    dataChannels[peerId][channel.label] = channel

    if (onopen) onopen(channel)
  }
  channel.onclose = () => {
    if (dataChannels[peerId] && dataChannels[peerId][channel.label]) delete dataChannels[peerId][channel.label]
  }

  channel.onerror = event => {
    if (event.target.readyState === 'closed') {
      if (dataChannels[peerId] && dataChannels[peerId][channel.label]) delete dataChannels[peerId][channel.label]
    }
    console.error('WebRTC DataChannel error', event)
  }
}
export function closeAPeer (peerId) {
  if (!peerConnections[peerId]) return

  peerConnections[peerId].close()
  if (dataChannels[peerId]) {
    Object.values(dataChannels[peerId]).forEach(channel => {
      channel.close()
    })
  }
  // stop streams too
  delete peerConnections[peerId]
  delete dataChannels[peerId]
  delete peerConnectionDoubleChannelCreate[peerId]
  delete peerConnectionDoubleOfferCreate[peerId]
}

export function createDataChannel (peerId, channelName = dataChannelText) {
  if (!dataChannels[peerId]) dataChannels[peerId] = {}
  if (!peerConnectionDoubleChannelCreate[peerId]) peerConnectionDoubleChannelCreate[peerId] = {}

  return new Promise((resolve, reject) => {
    function checkDataChannelReadyState () {
      if (!dataChannels[peerId][channelName]) reject('Data Channel does not exist')
      if (dataChannels[peerId][channelName].readyState === 'open') resolve(dataChannels[peerId][channelName])
      else setTimeout(checkDataChannelReadyState, 1000)
    }

    if (dataChannels[peerId][channelName]) {
      checkDataChannelReadyState()
    } else if (!peerConnectionDoubleChannelCreate[peerId][channelName]) {
      peerConnectionDoubleChannelCreate[peerId][channelName] = true

      dataChannels[peerId][dataChannelText] = peerConnections[peerId].createDataChannel(dataChannelText, {})
      dataChannels[peerId][dataChannelFile] = peerConnections[peerId].createDataChannel(dataChannelFile, {})

      eventManage.publish('ON_DATA_CHANNEL_CONNECTING', extractInfoFromPeerId(peerId)[0])

      setChannelEvents({ channel: dataChannels[peerId][dataChannelText], peerId, onopen: (channel) => {
          resolve (channel)
          eventManage.publish('ON_DATA_CHANNEL_CONNECTED', extractInfoFromPeerId(peerId)[0])
        } })
      setChannelEvents({ channel: dataChannels[peerId][dataChannelFile], peerId }) // TODO check your assumption
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

export async function sendMessage ({
  roomId,
  receiverId,
  senderId,
  ownerId = senderId,
  message,
  file,
  type = constants.MESSAGE_TYPES[0]
}) {
  const peerId = `${roomId}/${receiverId}/${senderId}`

  if (!peerConnections[peerId]) createPeerConnection({ peerId })

  createDataChannel(peerId, dataChannelText).then( channel => {
    if (type === constants.MESSAGE_TYPES[0]) channel.send(JSON.stringify(message))
    else if (type === constants.MESSAGE_TYPES[1]) {
      channel.send(JSON.stringify(message))
      sendFile({ peerId, file })
    } else if (type === constants.DATA_CHANNEL_MESSAGE_TYPES[0]) channel.send(JSON.stringify(typingModel(roomId, senderId, ownerId)))
    else if (type === constants.DATA_CHANNEL_MESSAGE_TYPES[1]) channel.send(JSON.stringify(replyModel(roomId, message.id)))
  }).catch(e => {
    console.error(e)
  })

  if (peerConnections[peerId].iceConnectionState === 'new' && !peerConnectionDoubleOfferCreate[peerId]) {
    peerConnectionDoubleOfferCreate[peerId] = true
    await createOffer({ peerId })
  }
}

export function sendFile ({ peerId, file }) {
  createDataChannel(peerId, dataChannelFile).then(channel => {
    const chunkSize = 16384
    let offset = 0
    const fileReader = new FileReader()

    function readSlice (o) {
      const slice = file.slice(offset, o + chunkSize)

      fileReader.readAsArrayBuffer(slice)
    }

    if (file instanceof File) {
      // fileReader.addEventListener('error', error => console.error('Error reading file:', error));
      // fileReader.addEventListener('abort', event => console.log('File reading aborted:', event));

      fileReader.addEventListener('load', e => {
        channel.send(e.target.result)

        offset += e.target.result.byteLength

        if (offset < file.size) {
          readSlice(offset)
        }
      })

      readSlice(0)
    }
  })
}

export async function call ({ roomId, receiverId, senderId, type = constants.STREAM_TYPES[2] }) {
  const peerId = `${roomId}/${receiverId}/${senderId}`

  const streams = await getStream(type)

  if (!streams.localStream) return // TODO show proper Error

  getWebRTCListeners('onLocalStreamCreate')({ stream: streams.localDisplayStream, type })

  apiSendOfferType(roomId, receiverId, senderId, constants.OFFER_TYPE[1])

  if (!peerConnections[peerId]) createPeerConnection({ peerId })

  peerConnections[peerId].addStream(streams.localStream)
}

export async function answerCall ({ roomId, receiverId, senderId, type = constants.STREAM_TYPES[2] }) {
  const peerId = `${roomId}/${receiverId}/${senderId}`

  const streams = await getStream(type)

  if (!streams.localStream) return

  getWebRTCListeners('onLocalStreamCreate')({ stream: streams.localDisplayStream, type })

  if (!peerConnections[peerId]) createPeerConnection({ peerId })

  peerConnections[peerId].addStream(streams.localStream)

  await createOffer({ peerId, offerType: constants.OFFER_TYPE[1] })
}
