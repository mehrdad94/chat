import constants from '../../configs/constants'

export default function replyModel (roomId, messageId) {
  return {
    type: constants.DATA_CHANNEL_MESSAGE_TYPES[1],
    roomId,
    messageId
  }
}
