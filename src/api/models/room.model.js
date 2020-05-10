import constants from '../../configs/constants'

export default function room (data) {
  return Object.assign({}, data, {
    status: constants.ROOM_STATUS[0],
    id: data._id,
    avatar: `https://api.adorable.io/avatars/48/${data._id}.png`,
    meta: {
      // on updated meta you must update room reducer update section
      membersOnline: [],
      membersTyping: {}
    }
  })
}

export function updateRoomModel (data) {
  return Object.assign({}, data, {
    id: data._id
  })
}
