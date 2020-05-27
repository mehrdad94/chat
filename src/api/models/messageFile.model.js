import constants from '../../configs/constants'
import uuid from 'uuid/v4'
import moment from 'moment'

export default function messageFile (message, senderId, roomId, sentCount, name, size, fileType, lastModified) {
  return {
    id: uuid(),
    type: constants.MESSAGE_TYPES[1],
    sentTime: moment().format(),
    body: message,
    senderId,
    name,
    size,
    fileType,
    lastModified,
    status: constants.MESSAGE_STATUS[0],
    roomId
  }
}

export function messageFileBeforeSend (message) {
  return Object.assign(message, {
    uploading: true
  })
}

export function messageFileAfterReceive (message) {
  return Object.assign(message, {
    downloading: false
  })
}
