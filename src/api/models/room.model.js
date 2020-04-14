import constants from '../../configs/constants'

export default function room (data) {
  return Object.assign({}, data, {
    status: constants.ROOM_STATUS[0],
    id: data._id,
    avatar: `http://api.adorable.io/avatars/48/${data._id}.png`,
    meta: {
      membersOnline: [],
      membersTyping: {}
    }
  })
}