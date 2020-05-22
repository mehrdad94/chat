export const createPeerId = (roomId, senderId, receiverId) => `${roomId}/${senderId}/${receiverId}`
export const extractInfoFromPeerId = peerId => peerId.split('/')

export const getIceServers = () => {
  // resiprocate: 3344+4433
  // pions: 7575
  var iceServers = [{
    urls: 'stun:stun.privatechat.app:5349'
  }, {
    urls: 'turn:turn.privatechat.app:5349',
    username: 'brucewayne',
    credential: 'brucewayne'
  }]

  return iceServers;
}