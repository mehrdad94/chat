import constants from '../../configs/constants'
import uuid from 'uuid/v4'
import moment from 'moment'

export default function messageText (message, senderId, roomId, sentCount) {
  return {
    id: uuid(),
    type: constants.MESSAGE_TYPES[0],
    body: message,
    sentTime: moment().format(),
    senderId,
    status: constants.MESSAGE_STATUS[0],
    roomId,
    sentCount
  }
}
