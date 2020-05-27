export const createPeerId = (roomId, senderId, receiverId) => `${roomId}/${senderId}/${receiverId}`
export const extractInfoFromPeerId = peerId => peerId.split('/')

// todo add ttl for credentials validate, api request for getting username and credential, ...

export const getIceServers = () => {
  return [{
    urls: 'stun:stun.privatechat.app:5349?transport=udp'
  }, {
    urls: 'turn:turn.privatechat.app:3478?transport=udp',
    username: 'brucewayne',
    credential: 'brucewayne'
  }, {
    urls: 'turn:turn.privatechat.app:3478?transport=tcp',
    username: 'brucewayne',
    credential: 'brucewayne'
  }, {
    urls: 'turn:turn.privatechat.app:5349?transport=tcp',
    username: 'brucewayne',
    credential: 'brucewayne'
  }]
}