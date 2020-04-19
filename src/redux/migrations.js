export default {
  2: state => {
    // migration to add sentCount to messages Object
    try {
      const messagesPerUser = Object.values(state.messages)
      const messagesPerUserPerRoom = messagesPerUser.map(perUser => Object.values(perUser.messages))

      if (!messagesPerUserPerRoom.length) return state

      messagesPerUserPerRoom.forEach(perUser => {
        perUser.forEach(perRoom => {
          perRoom.forEach(message => {
            message.sentCount = 0
          })
        })
      })

      return state
    } catch (e) {
      return state
    }
  }
}
