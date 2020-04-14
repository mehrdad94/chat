import constants from '../../configs/constants'

export default function typingModel (roomId, userId) {
  return {
    type: constants.DATA_CHANNEL_MESSAGE_TYPES[0],
    roomId,
    userId
  }
}
