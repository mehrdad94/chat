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
import { createAnswer, answer, addIceCandidate } from '../../api/webRTC_experimental'
import { eventManage, typingReceivedHelper } from '../../helpers/helper'
import { getProfiles, getProfilesCurrentUserId } from '../../redux/reducers/profiles'
// import { treeAdd, treeRemove } from '../../helpers/treeModel'

const genState = props => {
  const {
    redirect = false
  } = props
  return {
    redirect
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
        this.props.profileCreate(user)
        this.props.profileCurrentUserCreate(user.id)
        this.props.connectionStatusActivate()
      },
      onProfileJoined: (user, roomId) => {
        this.props.profileCreate(user)

        this.props.roomOnlineCreate(user.id, roomId)
      },
      onProfileDisconnected: (user, roomId) => {
        this.props.roomOnlineDelete(user.id, roomId)
      },
      onMessageCreate: ({roomId, userId, message}) => {
        this.props.messageCreate(message, roomId)

        eventManage.publish('ON_NEW_MESSAGE', { roomId })

        this.props.roomStoppedTyping(roomId, userId)
      },
      onMessagesReceived: ({ roomId, messageId }) => {
        this.props.messageSentCreate(messageId, roomId)
      },
      onTyping: ({roomId, userId}) => {
        typingReceivedHelper(roomId, userId, () => {
          this.props.roomIsTyping(roomId, userId)
        }, () => {
          this.props.roomStoppedTyping(roomId, userId)
        })
      },
      onSignal: async ({roomId, receiverId, senderId, desc, candidate}) => {
        if (desc) {
          if (desc.type === 'offer') {
            await createAnswer({ roomId, receiverId, senderId, desc })
          } else if (desc.type === 'answer') {
            await answer({ roomId, receiverId, senderId, desc })
          }
        } else if (candidate) {
          await addIceCandidate({ roomId, receiverId, senderId, candidate })
        }
      }
    })
  }

  componentWillMount () {
    this.setState(genState(this.props))
  }

  render() {
    return (
      <Fragment>
        { this.renderRedirect() }

        <div className="h-100">
          <div className="h-100">
            <div className="page-container h-100">
              <Header/>

              <main className='main-content bgc-grey-100'>
                <div id='mainContent'>
                  <div className="full-container pl-0">
                    <div className="peers fxw-nw pos-r">
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
