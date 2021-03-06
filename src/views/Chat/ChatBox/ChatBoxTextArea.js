import React from 'react'
import { connect } from 'react-redux'
import { messageCreate } from '../../../redux/actions'
import { sendMessage } from '../../../api/webRTC_experimental'
import messageTextModel from '../../../api/models/messageText.model'
import { eventManage } from '../../../helpers/helper'
import { queueAdd, queueRun } from '../../../helpers/queue'
import { typingSentHelper, isDisconnected, isServerDisconnected } from '../../../helpers/helper'
import constants from '../../../configs/constants.json'
import { getProfiles, getProfilesCurrentUserId } from '../../../redux/reducers/profiles'
import { getRoomActive, getRoomActiveStatus } from '../../../redux/reducers/rooms'
import { getConnectionStatus } from '../../../redux/reducers/application'

// import { getNodeConnections } from '../../../helpers/treeModel'

const textAreaPlaceHolder = (connectionStatus, roomStatus) => {
  if (isServerDisconnected(connectionStatus)) return "You're offline, please check your internet connection!"
  else if (isDisconnected(roomStatus)) return 'No one is online to talk to...'
  else return 'Say something...'
}

class ChatBoxTextArea extends React.Component {
  constructor(props) {
    super(props)

    this.sendInoutRef = React.createRef()
    this.sendBtnRef = React.createRef()
  }

  state = {
    message: ''
  }

  handleChange = (type, event) => {
    this.setState({
      [type]: event.target.value
    })
  }

  onKeyDown = async event => {
    const roomId = this.props.roomsActive.id
    const senderId = this.props.profileCurrentUserId
    const receiverIds = this.props.roomsActive.meta.membersOnline.filter(id => id !== senderId) // getNodeConnections(roomId, senderId)

    // send typing message
    if (event.key === 'Enter') await this.onSendClick()
    else {
      receiverIds.forEach(receiverId => {
        typingSentHelper(roomId, receiverId, async () => {
          await sendMessage({
            roomId,
            receiverId,
            senderId,
            type: constants.DATA_CHANNEL_MESSAGE_TYPES[0]
          })
        })
      })
    }
  }

  onTextBoxBlur = event => {
    if (event && event.relatedTarget && event.relatedTarget.isSameNode(this.sendBtnRef.current)) {
      this.sendInoutRef.current.focus()
    }
  }
  onSendClick = async () => {
    if (!this.state.message.trim()) return
    const roomId = this.props.roomsActive.id
    const senderId = this.props.profileCurrentUserId
    const receiverIds = this.props.roomsActive.meta.membersOnline.filter(id => id !== senderId) // getNodeConnections(roomId, senderId)

    const message = messageTextModel(this.state.message, senderId, roomId, receiverIds.length)
    receiverIds.forEach(async receiverId => {
      this.props.messageCreate(message, roomId)
      eventManage.publish('USER_SENT_NEW_MESSAGE')

      this.setState({
        message: ''
      })
      queueAdd({
        task: async () => {
          await sendMessage({
            roomId,
            receiverId,
            senderId,
            message
          })
        }
      })

      queueRun({})
    })
  }

  componentDidMount() {
    eventManage.subscribe('ON_RTC_CONNECTION_STATE_CONNECTED', ({ peerId }) => {
    })
  }

  render () {
    return (
      <div className="layer w-100">
        <div className="pX-20 pY-10 bdT bgc-white">
          <div className="pos-r">
            <input type="text"
                   className="form-control bdrs-10em m-0 pR-40"
                   dir="auto"
                   ref={this.sendInoutRef}
                   onBlur={this.onTextBoxBlur}
                   disabled={isServerDisconnected(this.props.connectionStatus) || isDisconnected(this.props.roomsActiveStatus)}
                   value={this.state.message}
                   onChange={ event => this.handleChange('message', event) }
                   onKeyDown={this.onKeyDown}
                   placeholder={textAreaPlaceHolder(this.props.connectionStatus, this.props.roomsActiveStatus)}/>
            <button type="button"
                    ref={this.sendBtnRef}
                    disabled={isServerDisconnected(this.props.connectionStatus) || isDisconnected(this.props.roomsActiveStatus)}
                    onClick={ this.onSendClick }
                    className="btn btn-primary bdrs-50p w-2r p-0 h-2r pos-a r-1 t-1">
              <i className="fa fa-paper-plane-o"/>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  roomsActive: getRoomActive(state),
  roomsActiveStatus: getRoomActiveStatus(state),
  profileCurrentUserId: getProfilesCurrentUserId(state),
  profiles: getProfiles(state),
  connectionStatus: getConnectionStatus(state)
})

const mapDispatchToProps = dispatch => {
  return {
    messageCreate: (message, roomId) => dispatch(messageCreate(message, roomId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatBoxTextArea)
