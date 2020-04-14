import React from 'react'
import { connect } from 'react-redux'

import ChatBoxToolBar from './ChatBoxToolBar'
import ChatBoxMessages from './ChatBoxMessages'
import ChatBoxTextArea from './ChatBoxTextArea'

import { Unavailable } from '../../../components/Unavailable/Unavailable'
import { getRoomActive } from '../../../redux/reducers/rooms'

class ChatBox extends React.Component {
  render() {
    return (
      <div className="peer peer-greed" id="chat-box">
        <div className="layers h-100 pos-r">
          <Unavailable isActive={!this.props.roomsActive.publicId}
                       title={'Please create or select a room!'}
                       description={'From top left corner you can create a room or join a room.'}/>

          <ChatBoxToolBar/>

          <ChatBoxMessages/>

          <ChatBoxTextArea/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const roomsActive = getRoomActive(state)
  return {
    roomsActive
  }
}

export default connect(mapStateToProps)(ChatBox)
