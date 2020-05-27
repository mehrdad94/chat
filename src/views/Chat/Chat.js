import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import {
  dialogActiveSet,
  connectionStatusActivate,
  connectionStatusDeactivate,
  roomCreate,
  roomUpdate,
  roomCreateBatch,
  roomReset,
  roomDelete,
  roomOnlineCreate,
  roomOnlineCreateBatch,
  roomOnlineDelete,
  roomIsTyping,
  roomStoppedTyping,
  profileCreate,
  profileCurrentUserCreate,
  messageCreate,
  messageUpdate,
  messageSentCreate
} from '../../redux/actions'

import Header from './Header/Header'
import Sidebar from './Sidebar/Sidebar'
import ChatBox from './ChatBox/ChatBox'
import RoomCreate from '../Dialogs/RoomCreate/RoomCreate'
import RoomUpdate from '../Dialogs/RoomUpdate/RoomUpdate'
import RoomDelete from '../Dialogs/RoomDelete/RoomDelete'
import RoomJoin from '../Dialogs/RoomJoin/RoomJoin'
import RoomInfo from '../Dialogs/RoomInfo/RoomInfo'

import { socketConnect, setToken, apiDisconnect } from '../../api'
import { createAnswer, answer, addIceCandidate, closeAPeer, answerCall } from '../../api/webRTC_experimental'
import { createPeerId } from '../../api/webRTC_helpers'
import { eventManage, typingReceivedHelper } from '../../helpers/helper'
import { getProfiles, getProfilesCurrentUserId } from '../../redux/reducers/profiles'
import { waitOnAcceptCall } from './ChatBox/ChatBoxIncomingCall'
// import { treeAdd, treeRemove } from '../../helpers/treeModel'
import VideoCall from './VideoCall/VideoCall'
import constants from '../../configs/constants'

const genState = props => {
  const {
    redirect = false
  } = props
  return {
    redirect,
    mode: constants.MODE[0]
  }
}

class Chat extends React.Component {
  state = {
    redirect: false
  }

  setRedirect = value => {
    this.setState({
      redirect: value
    })
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/login' />
    }
  }

  componentDidMount () {
    socketConnect({
      onSocketConnect: () => {
        this.props.connectionStatusActivate()
      },
      onSocketDisconnect: () => {
        this.props.connectionStatusDeactivate()
      },
      onRoomRead: rooms => {
        this.props.roomReset()
        this.props.roomCreateBatch(rooms)
      },
      onRoomCreate: room => {
        this.props.roomCreate(room)
      },
      onRoomUpdate: room => {
        this.props.roomUpdate(room)
      },
      onRoomDelete: room => {
        this.props.roomDelete(room.id)
      },
      onRoomOnlineUsers: infos => {
        infos.forEach(info => {
          this.props.roomOnlineCreateBatch(info.userIds, info.roomId)
          info.users.forEach(user => this.props.profileCreate(user))
        })
      },
      onErrorAuthenticate: () => {
        setToken('')
        apiDisconnect()

        this.setRedirect(true)

        this.props.profileCurrentUserCreate('')
      },
      onProfileCurrentUser: user => {
        this.props.profileCurrentUserCreate(user.id)
        this.props.profileCreate(user)
        this.props.connectionStatusActivate()
      },
      onProfileJoined: (user, roomId) => {
        this.props.profileCreate(user)

        this.props.roomOnlineCreate(user.id, roomId)
      },
      onProfileDisconnected: (user, roomId) => {
        this.props.roomOnlineDelete(user.id, roomId)

        closeAPeer(createPeerId(roomId, user.id, this.props.profileCurrentUserId))
      },
      onMessageCreate: ({roomId, userId, message}) => {
        this.props.messageCreate(message, roomId)

        eventManage.publish('ON_NEW_MESSAGE', { roomId })

        this.props.roomStoppedTyping(roomId, userId)
      },
      onMessagesReceived: ({ roomId, messageId }) => {
        this.props.messageSentCreate(messageId, roomId)

        eventManage.publish('ON_MESSAGE_STATUS_CHANGE', { roomId })
      },
      onRTCConnectionStateConnected: ({ state, peerId }) => {
        eventManage.publish('ON_RTC_CONNECTION_STATE_CONNECTED', { state, peerId })
      },
      onRTCConnectionStateFailed: ({ state, peerId }) => {
        eventManage.publish('ON_RTC_CONNECTION_STATE_FAILED', { state, peerId })
      },
      onTyping: ({roomId, userId}) => {
        typingReceivedHelper(roomId, userId, () => {
          this.props.roomIsTyping(roomId, userId)
        }, () => {
          this.props.roomStoppedTyping(roomId, userId)
        })
      },
      onSignal: async ({roomId, receiverId, senderId, desc, candidate, offerType}) => {
        if (desc) {
          if (desc.type === 'offer') {
            await createAnswer({ roomId, receiverId, senderId, desc, offerType })
          } else if (desc.type === 'answer') {
            await answer({ roomId, receiverId, senderId, desc })
          }
        } else if (candidate) {
          await addIceCandidate({ roomId, receiverId, senderId, candidate })
        } else if (offerType === constants.OFFER_TYPE[1]) {
          try {
            eventManage.publish('ON_OFFER_STREAM')
            await waitOnAcceptCall()
            await answerCall({ roomId, senderId: receiverId, receiverId: senderId })
          } catch (e) {
            // TODO show proper error
            console.log('reject')
          }
        }
      },
      onLocalStreamCreate: ({ stream, type }) => {
        eventManage.publish('ON_LOCAL_STREAM', { stream, type })
      },
      onRemoteStreamCreate: ({ stream, peerId }) => {
        eventManage.publish('ON_REMOTE_STREAM', { stream, peerId })
      }
    })

    eventManage.subscribe('ON_CAMERA_CLICK', () => {
      this.setState({
        mode: constants.MODE[1]
      })
    })

    eventManage.subscribe('ON_ANSWER_CALL', () => {
      this.setState({
        mode: constants.MODE[1]
      })
    })
  }

  componentWillMount () {
    this.setState(genState(this.props))
  }

  render() {
    const chatWrapperClassNames = 'page-container h-100 ' + (this.state.mode !== constants.MODE[0] ? 'd-none' : '')
    const videoWrapClassNames = 'h-100 bgc-grey-100 p-20 ' + (this.state.mode !== constants.MODE[1] ? 'd-none' : '')

    return (
      <Fragment>
        { this.renderRedirect() }

        <div className="h-100">
          <div className={videoWrapClassNames}>
            <VideoCall/>
          </div>

          <div className={chatWrapperClassNames}>
            <main className="main-content bgc-grey-100">
              <div id="mainContent" className="h-100p">
                <div className="full-container pl-0">
                  <div className="peers fxw-nw pos-a h-100p w-100p">
                    <Sidebar/>

                    <ChatBox/>
                  </div>
                </div>
              </div>
            </main>

            {/* dialogs */}
            <RoomCreate />
            <RoomUpdate />
            <RoomDelete />
            <RoomJoin />
            <RoomInfo />
          </div>
        </div>
      </Fragment>
    )
  }
}

const mapDispatchToProps = {
  dialogActiveSet,
  connectionStatusActivate,
  connectionStatusDeactivate,
  roomCreate,
  roomUpdate,
  roomDelete,
  roomCreateBatch,
  roomOnlineCreateBatch,
  roomReset,
  roomOnlineCreate,
  roomOnlineDelete,
  roomIsTyping,
  roomStoppedTyping,
  profileCreate,
  profileCurrentUserCreate,
  messageCreate,
  messageUpdate,
  messageSentCreate
}

const mapStateToProps = state => ({
  profiles: getProfiles(state),
  profileCurrentUserId: getProfilesCurrentUserId(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
