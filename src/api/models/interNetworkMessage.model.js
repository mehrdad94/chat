import constants from '../../configs/constants'

export default function interNetworkMessageModel (roomId, owner, sender, message) {
  return {
    type: constants.DATA_CHANNEL_MESSAGE_TYPES[2],
    roomId,
    owner, // who owns the message
    sender, // who sent the message
    message
  }
}