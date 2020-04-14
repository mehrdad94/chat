import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import constants from '../../../configs/constants.json'
import { roomSelect } from '../../../redux/actions'
import { getRooms } from '../../../redux/reducers/rooms'

// add BUSY, ONLINE, OFFLINE, DELETED, TYPING
function RoomStatus(props) {
  if (props.status === constants.ROOM_STATUS[0]) {
    return <small className="lh-1 c-grey-500">Offline</small>
  } else if (props.status === constants.ROOM_STATUS[1]) {
    return <small className="lh-1 c-green-500">Online</small>
  } else if (props.status === constants.ROOM_STATUS[2]) {
    return <small className="lh-1 c-red-500">Busy</small>
  } else if (props.status === constants.ROOM_STATUS[3]) {
    return <small><i className="lh-1">Typing...</i></small>
  } else {
    return <small className="lh-1 c-amber-500">Deleted</small>
  }
}

function Notification (props) {
  if (props.notification && props.notification > 0) {
    return (
      <div className="peers">
        <div className="peer">
            <span className="c-white rounded-circle notification" data-testid="notification">
              { props.notification }
            </span>
        </div>
      </div>
    )
  } else return null
}

class SidebarItem extends React.Component {
  onItemClick = () => {
    this.props.roomSelect(this.props.room.id)
  }

  render() {
    return (
      <div className={'peers fxw-nw ai-c p-20 bdB bgc-white bgcH-grey-50 cur-p' + (this.props.room.id === this.props.roomsActive.id ? ' bgc-grey-50' : '')} onClick={this.onItemClick}>
        <div className="peer">
          <img src={ this.props.room.avatar }
               width="48"
               height="48"
               alt="avatar"
               className="w-3r h-3r bdrs-50p"/>
        </div>
        <div className="peer peer-greed pL-20">
          <h6 className="mB-0 lh-1 fw-400">{this.props.room.name}</h6>
          <RoomStatus status={this.props.room.status}/>
        </div>

        { <Notification notification={this.props.room.notification}/> }
      </div>
    )
  }
}

SidebarItem.propTypes = {
  room: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    status: PropTypes.oneOf(constants.ROOM_STATUS),
    notification: PropTypes.number
  })
}

const mapStateToProps = state => ({
  roomsActive: getRooms(state)
})

const mapDispatchToProps = dispatch => {
  return {
    roomSelect (payload) {
      dispatch(roomSelect(payload))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarItem)
