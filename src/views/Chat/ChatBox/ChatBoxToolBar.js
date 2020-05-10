import React, {Fragment} from 'react'
import { connect } from 'react-redux'
import constants from "../../../configs/constants"
import { dialogActiveSet } from '../../../redux/actions'
import { getRoomActive } from '../../../redux/reducers/rooms'
import { getConnectionStatus } from '../../../redux/reducers/application'
import { getProfilesCurrentUserId } from '../../../redux/reducers/profiles'

const isServerDisconnected = status => status === constants.CONNECTION_STATUS[0]

function RoomStatus (props) {
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
    navigator.clipboard.writeText(this.props.roomsActive.publicId).then(() => {
    })
  }
  render () {
    return (
      <Fragment>
        {
          this.props.roomsActive && this.props.roomsActive.meta && (
            <div className="layer w-100">
              <div className="peers fxw-nw jc-sb ai-c pY-20 pX-30 bgc-white">
                <div className="peers ai-c">
                  <div className="peer mR-20">
                    <img src={ this.props.roomsActive.avatar }
                         width="48"
                         height="48"
                         alt="avatar"
                         className="w-3r h-3r bdrs-50p"/>
                  </div>
                  <div className="peer">
                    <h6 className="lh-1 mB-0">{this.props.roomsActive.name} <RoomMembers members={this.props.roomsActive.members}/></h6>
                    <RoomStatus status={this.props.roomsActive.status} membersTyping={this.props.roomsActive.meta.membersTyping}/>
                  </div>
                </div>
                <div className="peers">
                  {/*<a href="" className="peer td-n c-grey-900 cH-blue-500 fsz-md mR-30" title="">*/}
                  {/*  <i className="ti-video-camera"/>*/}
                  {/*</a>*/}
                  {/*<a href="" className="peer td-n c-grey-900 cH-blue-500 fsz-md mR-30" title="">*/}
                  {/*  <i className="ti-headphone"/>*/}
                  {/*</a>*/}
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
              </div>
            </div>
          )
        }
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  roomsActive: getRoomActive(state),
  profileCurrentUserId: getProfilesCurrentUserId(state),
  connectionStatus: getConnectionStatus(state)
})

const mapDispatchToProps = {
    dialogActiveSet
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatBoxToolBar)
