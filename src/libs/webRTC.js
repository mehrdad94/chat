/* global MediaRecorder */
// TODO dataChannel ordered (TCP, UDP)
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

let globalInfo = {
  constraints: {
    audio: true,
    video: true
  },
  localStream: null,
  displayMediaStream: null,
  peerConfiguration: { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] },
  peerConnection: null,
  signalingOptions: null,
  textDataChannel: null
}

// getters to global info
const getConstraints = () => globalInfo.constraints
const setConstraints = constraints => { globalInfo.constraints = constraints }
const getLocalStream = () => globalInfo.localStream
const setLocalStream = stream => { globalInfo.localStream = stream }
const getDisplayMediaStream = () => globalInfo.displayMediaStream
const setDisplayMediaStream = stream => { globalInfo.displayMediaStream = stream }
const getPeerConfiguration = () => globalInfo.peerConfiguration
const setPeerConfiguration = config => { globalInfo.peerConfiguration = config }
const getPeerConnection = () => globalInfo.peerConnection
const setPeerConnection = peerConnection => { globalInfo.peerConnection = peerConnection }
const getSignalingOptions = () => globalInfo.signalingOptions
const setSignalingOptions = options => { globalInfo.signalingOptions = options }
const getTextDataChannel = () => globalInfo.textDataChannel
const setTextDataChannel = channel => { globalInfo.textDataChannel = channel }

// helpers
const negotiationTypes = ['CALL', 'CHAT']
const getNegotiationType = desc => {
  if (desc.includes('m=audio') || desc.includes('m=video')) return negotiationTypes[0]
  else return negotiationTypes[1]
}

// get user media
async function getUserMedia (constraints = getConstraints()) {
  return new Promise(async (resolve, reject) => {
    let localStream = getLocalStream()

    if (localStream) {
      resolve(localStream)
      return
    }

    try {
      localStream = await navigator.mediaDevices.getUserMedia(constraints)

      setLocalStream(localStream)
      resolve(getLocalStream())
    } catch (e) {
      reject(e)
    }
  })
}

async function getUserDisplayMedia (constraints = getConstraints()) {
  return new Promise(async (resolve, reject) => {
    let displayStream = getDisplayMediaStream()

    if (displayStream) {
      resolve(displayStream)
      return
    }

    try {
      displayStream = await navigator.mediaDevices.getDisplayMedia(constraints)

      setDisplayMediaStream(displayStream)
      resolve(getDisplayMediaStream())
    } catch (e) {
      reject(e)
    }
  })
}

function disableAudio () {
  const localStream = getLocalStream()

  if (!localStream) throw new Error('Stream does not exist')

  const audioTracks = localStream.getAudioTracks()

  if (audioTracks.length === 0) return

  for (let i = 0; i < audioTracks.length; ++i) {
    audioTracks[i].enabled = false
  }
}

function enableAudio () {
  const localStream = getLocalStream()

  if (!localStream) throw new Error('Stream does not exist')

  const audioTracks = localStream.getAudioTracks()

  if (audioTracks.length === 0) return

  for (let i = 0; i < audioTracks.length; ++i) {
    audioTracks[i].enabled = true
  }
}

function disableVideo () {
  const localStream = getLocalStream()

  if (!localStream) throw new Error('Stream does not exist')

  const videoTracks = localStream.getVideoTracks()

  if (videoTracks.length === 0) return

  for (let i = 0; i < videoTracks.length; ++i) {
    videoTracks[i].enabled = false
  }
}

function enableVideo () {
  const localStream = getLocalStream()

  if (!localStream) throw new Error('Stream does not exist')

  const videoTracks = localStream.getVideoTracks()

  if (videoTracks.length === 0) return

  for (let i = 0; i < videoTracks.length; ++i) {
    videoTracks[i].enabled = true
  }
}

// take screen shot
function takeScreenShot (stream) {
  const setting = stream.getVideoTracks()[0].getSettings()
  const video = document.createElement('video')
  video.srcObject = stream
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  canvas.width = setting.width
  canvas.height = setting.height

  context.drawImage(video, 0, 0, setting.width, setting.height)

  const data = canvas.toDataURL('image/png')

  return data
}

// get media devices
async function getMediaDevices () {
  return new Promise(async (resolve, reject) => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      return devices
    } catch (e) {
      reject(e)
    }
  })
}

// record media
function recordMedia (stream) {
  const recordedBlobs = []
  let mediaRecorder

  let options = {mimeType: 'video/webmcodecs=vp9'}
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${options.mimeType} is not Supported`)
    options = {mimeType: 'video/webmcodecs=vp8'}
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not Supported`)
      options = {mimeType: 'video/webm'}
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not Supported`)
        options = {mimeType: ''}
      }
    }
  }

  try {
    mediaRecorder = new MediaRecorder(stream, options)
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e)
    return
  }

  mediaRecorder.ondataavailable = function (event) {
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data)
    }
  }

  mediaRecorder.start(10) // collect 10ms of data

  // stop recording
  return function stopRecording () {
    mediaRecorder.stop()
    return new Blob(recordedBlobs, {type: 'video/webm'})
  }
}

// signaling
const receiveBuffer = []
let fileInfo
let receivedSize = 0

function onDataChannelMessage (event) {
  if (typeof event.data === 'object') { // file is comming
    receiveBuffer.push(event.data)
    receivedSize += (event.data.byteLength || event.data.size)

    if (receivedSize === fileInfo.size) {
      receiveBuffer.length = 0
      receivedSize = 0
    }
  } else {
    const message = JSON.parse(event.data)

    if (message.type === 'META_TEXT') { // file info
      fileInfo = message.value
    } else {
      console.log(message.value)
    }
  }
}

function createPeerConnection({ onicecandidate, onLocalDescription, onRemoteStream }) {
  if (getPeerConnection()) throw new Error('a peer connection is already there')

  setPeerConnection(new RTCPeerConnection(getPeerConfiguration()))

  let pc = getPeerConnection()

  pc.onicecandidate = ({ candidate }) => {
    if (candidate) onicecandidate(candidate)
  }

  pc.onnegotiationneeded = async function () {
    try {
      await pc.setLocalDescription(await pc.createOffer())

      onLocalDescription(pc.localDescription)
    } catch (e) {
      console.error(e)
    }
  }

  pc.ontrack = e => {
    onRemoteStream(e.streams[0])
  }

  pc.onconnectionstatechange = event => {
    console.log(pc.connectionState)
    switch(pc.connectionState) {
      case 'connected':
        // The connection has become fully connected
        break
      case 'disconnected':
      case 'failed':
        closeSignaling()
        break
      case 'closed':
        // The connection has been closed
        break
    }
  }

  pc.ondatachannel = event => {
    setTextDataChannel(event.channel)
    event.channel.onmessage = onDataChannelMessage
  }

  return pc
}

export function startSignaling (signalingOption) {
  setSignalingOptions(signalingOption)

  createPeerConnection(getSignalingOptions())

  function createTextChannel () {
    return new Promise((resolve, reject) => {
      const pc = getPeerConnection()
      setTextDataChannel(pc.createDataChannel('chat'))
      const tempChannel = getTextDataChannel()

      tempChannel.onopen = () => {
        resolve(tempChannel)
      }
    })
  }

  async function prepareForSend () {
    let textDataChannel = getTextDataChannel()

    if (!textDataChannel) {
      textDataChannel = await createTextChannel()
      textDataChannel.onmessage = onDataChannelMessage
    }
  }

  async function sendMessage (value, type = 'TEXT') {
    await prepareForSend()

    const textDataChannel = getTextDataChannel()

    textDataChannel.send(JSON.stringify({
      type,
      value
    }))
  }


  async function sendFile (file) {
    const chunkSize = 16384
    let offset = 0
    const fileReader = new FileReader()

    function readSlice (o) {
      const slice = file.slice(offset, o + chunkSize)

      fileReader.readAsArrayBuffer(slice)
    }

    await prepareForSend()

    const textDataChannel = getTextDataChannel()

    if (file instanceof File) {
      // send meta data
      sendMessage({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }, 'META_TEXT')

      // fileReader.addEventListener('error', error => console.error('Error reading file:', error));
      // fileReader.addEventListener('abort', event => console.log('File reading aborted:', event));

      fileReader.addEventListener('load', e => {
        textDataChannel.send(e.target.result)

        offset += e.target.result.byteLength

        if (offset < file.size) {
          readSlice(offset)
        }
      })

      readSlice(0)
    }
  }

  return {
    call,
    shareScreen,
    answer,
    hangUp,
    enableAudio,
    disableAudio,
    enableVideo,
    disableVideo,
    closeSignaling,
    sendMessage,
    sendFile
  }
}


async function call () {
  const stream = await getUserMedia()
  let pc = getPeerConnection()

  if (!pc) {
    pc = createPeerConnection(getSignalingOptions())
  }

  pc.addStream(stream)

  return hangUp
}

async function shareScreen () {
  const stream = await getUserDisplayMedia()
  const localStream = getLocalStream()

  let pc = getPeerConnection()

  if (!pc) {
    pc = createPeerConnection(getSignalingOptions())
  }

  if (localStream) {
    pc.removeStream(localStream)
  }

  pc.addStream(stream)

  stream.getVideoTracks()[0].onended = function () {
    pc.removeStream(stream)
    stopSharing()
    pc.addStream(localStream)
  }
}

function hangUp () {
  const stream = getLocalStream()

  if (stream) stream.getTracks().forEach(track => track.stop())
  setLocalStream(null)
}

function stopSharing () {
  const stream = getDisplayMediaStream()

  if (stream) stream.getTracks().forEach(track => track.stop())
  setDisplayMediaStream(null)
}

function closeSignaling () {
  hangUp()

  const pc = getPeerConnection()
  if (!pc) return
  pc.close()

  setPeerConnection(null)
}

async function answer ({ desc, candidate, onDesc, negotiationType }) {
  let pc = getPeerConnection()
  if (!pc) pc = createPeerConnection(getSignalingOptions())

  if (desc) {
    // if apponent call us when we are calling
    if (desc.type === 'offer' && pc.signalingState === 'have-local-offer') {
      closeSignaling()

      pc = createPeerConnection(getSignalingOptions())
    }

    if (desc.type === 'offer') {
      await pc.setRemoteDescription(desc)

      if (getNegotiationType(desc.sdp) === negotiationTypes[0]) {
        const stream = await getUserMedia()

        const senders = pc.getSenders()
        const sendersTracksById = senders.reduce((a, b) => {
          if (b.track) a[b.track.id] = b.track
          return a
        }, {})

        stream.getTracks().forEach(track => {
          if (!sendersTracksById[track.id]) {
            pc.addTrack(track, stream)
          }
        })
      }

      await pc.setLocalDescription(await pc.createAnswer())

      onDesc(pc.localDescription)
    } else if (desc.type === 'answer') {
      await pc.setRemoteDescription(desc)
    } else {
      console.error('unknown description type')
    }
  } else {
    pc.addIceCandidate(candidate).then(() => {
    }).catch(error => {
      console.error('Ice candidate failed', error)
    })
  }
}
