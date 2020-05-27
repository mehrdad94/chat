import React, {Fragment} from 'react'
import { connect } from 'react-redux'
import constants from '../../../configs/constants'
import { dialogActiveSet, } from '../../../redux/actions'
import { getRoomActive, getRoomActiveId, getRoomActiveStatus } from '../../../redux/reducers/rooms'
import { getConnectionStatus } from '../../../redux/reducers/application'
import { getProfilesCurrentUserId } from '../../../redux/reducers/profiles'
import { isDisconnected, isServerDisconnected } from '../../../helpers/helper'
import { call, sendMessage } from '../../../api/webRTC_experimental'
import { eventManage } from '../../../helpers/helper'
import ChatBoxIncomingCall from './ChatBoxIncomingCall'
import messageFile from '../../../api/models/messageFile.model'
import $ from "jquery";

function RoomStatus (props) {
  if (props.connecting) return <i><i className="lh-1">Connecting...</i></i>
  if (Object.keys(props.membersTyping).length > 0) return <i><i className="lh-1">Typing...</i></i>
  if (props.status === constants.ROOM_STATUS[0]) return <i className="lh-1 c-grey-500">Offline</i>
  else if (props.status === constants.ROOM_STATUS[1]) return <i className="lh-1 c-green-500">Online</i>
  else if (props.status === constants.ROOM_STATUS[2]) return <i className="lh-1 c-red-500">Busy</i>
  else if (props.status === constants.ROOM_STATUS[3]) return <i><i className="lh-1">Typing...</i></i>
  else return <i className="lh-1 c-amber-500">Deleted</i>
}

function RoomMembers (props) {
  if (props.members > 1) return <i className="lh-1 c-grey-500">,{props.members.length} members</i>
  else return null
}

class ChatBoxToolBar extends React.Component {
  constructor(props) {
    super(props)

    this.fileInputRef = React.createRef()
  }

  state = {
    dataChannelConnecting: {} // room id
  }

  onEditClick = () => {
    this.props.dialogActiveSet(constants.DIALOG_NAMES[1])
  }

  onDeleteClick = () => {
    this.props.dialogActiveSet(constants.DIALOG_NAMES[2])
  }

  onRoomInfoClick = () => {
    this.props.dialogActiveSet(constants.DIALOG_NAMES[4])
  }

  onCopyRoomIdClick = () => {
    navigator.clipboard.writeText(this.props.roomsActive.publicId).then(() => {})
  }

  onCameraClick = async () => {
    eventManage.publish('ON_CAMERA_CLICK')

    const roomId = this.props.roomsActive.id
    const senderId = this.props.profileCurrentUserId
    const receiverIds = this.props.roomsActive.meta.membersOnline.filter(id => id !== senderId)

    receiverIds.forEach(async receiverId => {
      await call({ type: constants.STREAM_TYPES[2], roomId, senderId, receiverId })
    })
  }

  onAttachClick = () => {
    this.fileInputRef.current.click()
  }

  onAttachFile = event => {
    if (event.target.files) {
      const roomId = this.props.roomsActive.id
      const senderId = this.props.profileCurrentUserId
      const receiverIds = this.props.roomsActive.meta.membersOnline.filter(id => id !== senderId)

      Object.values(event.target.files).forEach(file => {
        const message = messageFile('', senderId, roomId, receiverIds.length, file.name, file.size, file.type, file.lastModified)

        receiverIds.forEach(async receiverId => {
          await sendMessage({ roomId, receiverId, senderId, message, file, type: constants.MESSAGE_TYPES[1] })
        })
      })
    }
    // console.log(event.target.files)
  }
  onChatSidebarToggleClick = () => {
    $('#chat-sidebar').toggleClass('open')
    $('#sidebar-backdrop').toggleClass('show')
  }

  componentDidMount() {
    eventManage.subscribe('ON_DATA_CHANNEL_CONNECTING', roomId => {
      this.setState({
        dataChannelConnecting: {
          ...this.state.dataChannelConnecting,
          [roomId]: true
        }
      })
    })
    eventManage.subscribe('ON_DATA_CHANNEL_CONNECTED', roomId => {
      this.setState({
        dataChannelConnecting: {
          ...this.state.dataChannelConnecting,
          [roomId]: false
        }
      })
    })
  }

  render () {
    return (
      <Fragment>
        <ChatBoxIncomingCall/>
        {
            <div className="layer w-100 zi-2">
              <div className="peers fxw-nw jc-sb ai-c pY-20 pX-30 bgc-white">
                <div className="peers ai-c">
                  <div className="peer">
                    <a id="chat-sidebar-toggle"
                       onClick={this.onChatSidebarToggleClick}
                       className="td-n c-grey-900 cH-blue-500 mR-20 d-n@md+"
                       href="#">
                      <i className="ti-menu"/>
                    </a>
                  </div>
                  { this.props.roomsActive && this.props.roomsActive.meta && (
                    <Fragment>
                      <div className="peer mR-20">
                        <img src={ this.props.roomsActive.avatar }
                             width="48"
                             height="48"
                             alt="avatar"
                             className="w-3r h-3r bdrs-50p"/>
                      </div>
                      <div className="peer">
                        <h6 className="lh-1 mB-0">{this.props.roomsActive.name} <RoomMembers members={this.props.roomsActive.members}/></h6>
                        <RoomStatus status={this.props.roomsActive.status}
                                    connecting={this.state.dataChannelConnecting[this.props.getRoomActiveId]}
                                    membersTyping={this.props.roomsActive.meta.membersTyping}/>
                      </div>
                    </Fragment>
                  )
                }
                </div>
                { this.props.roomsActive && this.props.roomsActive.meta && (
                  <div className="peers">
                  {/*<button className="btn btn-link peer td-n c-grey-900 cH-blue-500 fsz-md mR-30 p-0"*/}
                  {/*        onClick={this.onCameraClick}*/}
                  {/*        disabled={isServerDisconnected(this.props.connectionStatus) || isDisconnected(this.props.roomsActiveStatus)}>*/}
                  {/*  <i className="ti-video-camera"/>*/}
                  {/*</button>*/}

                  {/*<button className="btn btn-link peer td-n c-grey-900 cH-blue-500 fsz-md mR-30 p-0"*/}
                  {/*        disabled={isServerDisconnected(this.props.connectionStatus) || isDisconnected(this.props.roomsActiveStatus)}>*/}
                  {/*  <i className="ti-headphone"/>*/}
                  {/*</button>*/}

                  {/*<button className="btn btn-link peer td-n c-grey-900 cH-blue-500 fsz-md mR-30 p-0"*/}
                  {/*        onClick={this.onAttachClick}*/}
                  {/*        disabled={isServerDisconnected(this.props.connectionStatus) || isDisconnected(this.props.roomsActiveStatus)}>*/}
                  {/*  <i className="ti-clip"/>*/}

                  {/*  <input type="file"*/}
                  {/*         hidden*/}
                  {/*         ref={this.fileInputRef}*/}
                  {/*         onChange={this.onAttachFile}*/}
                  {/*         onClick={event => { event.target.value = null }}/>*/}
                  {/*</button>*/}

                  <a href="" className="peer td-n c-grey-900 cH-blue-500 fsz-md" title="" data-toggle="dropdown">
                    <i className="ti-more"/>
                  </a>
                  <ul className="dropdown-menu fsz-sm">
                    <li onClick={this.onRoomInfoClick}>
                      <button className="btn ta-l w-100 d-b td-n pY-5 bgcH-grey-100 c-grey-700">
                        <i className="ti-info mR-10"/>
                        <span>Room Info</span>
                      </button>
                    </li>

                    {
                      this.props.profileCurrentUserId === this.props.roomsActive.creator ?
                        <Fragment>
                          <li onClick={this.onEditClick}>
                            <button className="btn ta-l w-100 d-b td-n pY-5 bgcH-grey-100 c-grey-700"
                                    disabled={isServerDisconnected(this.props.connectionStatus)}>
                              <i className="ti-pencil mR-10"/>
                              <span>Edit Room</span>
                            </button>
                          </li>

                          <li onClick={this.onDeleteClick}>
                            <button className="btn ta-l w-100 d-b td-n pY-5 bgcH-grey-100 c-grey-700"
                                    disabled={isServerDisconnected(this.props.connectionStatus)}>
                              <i className="ti-trash mR-10"/>
                              <span>Delete Room</span>
                            </button>
                          </li>
                        </Fragment>
                       : null
                    }

                    <li onClick={this.onCopyRoomIdClick}>
                      <button className="btn ta-l w-100 d-b td-n pY-5 bgcH-grey-100 c-grey-700">
                        <i className="ti-slice mR-10"/>
                        <span>Copy Room Id</span>
                      </button>
                    </li>
                  </ul>
                </div>
                )}
              </div>
            </div>
        }
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  roomsActive: getRoomActive(state),
  getRoomActiveId: getRoomActiveId(state),
  roomsActiveStatus: getRoomActiveStatus(state),
  profileCurrentUserId: getProfilesCurrentUserId(state),
  connectionStatus: getConnectionStatus(state)
})

const mapDispatchToProps = {
  dialogActiveSet
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatBoxToolBar)
