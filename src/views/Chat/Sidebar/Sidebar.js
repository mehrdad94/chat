import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import SidebarItem from './SidebarItem'
import PerfectScrollbar from 'perfect-scrollbar'
import { dialogActiveSet } from '../../../redux/actions'
import constants from '../../../configs/constants'
import { getRooms } from '../../../redux/reducers/rooms'
import { getConnectionStatus } from '../../../redux/reducers/application'
import Header from '../Header/Header'
import $ from "jquery";

const isServerDisconnected = status => status === constants.CONNECTION_STATUS[0]

class Sidebar extends React.Component {
  constructor(props) {
    super(props)

    this.scrollableRef = React.createRef()
  }

  state = {
    search: ''
  }

  renderList = () => {
    const search = this.state.search.toLowerCase()

    const filter = room => room.name.toLowerCase().includes(search) || room.status.toLowerCase().includes(search)

    const rooms = search ? this.props.rooms.filter(filter) : this.props.rooms

    return rooms.map(room => <SidebarItem key={room.id} room={room}/>)
  }

  handleChange = (event) => {
    this.setState({ search: event.target.value })
  }

  componentDidMount() {
    new PerfectScrollbar(this.scrollableRef.current)
  }

  onCreateNewRoomClick = () => {
    this.props.dialogActiveSet(constants.DIALOG_NAMES[0])
  }

  onJoinRoomClick = () => {
    this.props.dialogActiveSet(constants.DIALOG_NAMES[3])
  }

  onBackdropClick = () => {
    $('body').toggleClass('is-collapsed')
    $('#sidebar-backdrop').toggleClass('show')
  }

  render() {
    return (
      <Fragment>
        <div className="peer bdR bgc-white sidebar" id="chat-sidebar">
          <div className="layers h-100">
            <Header/>
            <div className="bdB layer w-100 pos-r bgc-white">
              <div className="row mx-0 justify-content-center chat-sidebar-top-buttons">
                <button className="btn cur-p btn-light border rounded-pill bg-white mr-2"
                        disabled={isServerDisconnected(this.props.connectionStatus)}
                        onClick={this.onCreateNewRoomClick}>
                  <i className="ti-plus mr-1"/>
                  New Room
                </button>
                <button className="btn cur-p btn-light border rounded-pill bg-white"
                        disabled={isServerDisconnected(this.props.connectionStatus)}
                        onClick={this.onJoinRoomClick}>
                  <i className="ti-direction mr-1"/>
                  Join a room
                </button>
              </div>
            </div>
            <div className="bdB layer w-100 pos-r">
              {/* search input */}
              <input type="text"
                     placeholder="Search rooms..."
                     name="chatSearch"
                     value={this.state.search}
                     onChange={this.handleChange}
                     className="form-constrol p-15 bdrs-0 w-100 bdw-0"/>
            </div>

            {/* list of items */}
            <div className="layer w-100 fxg-1 scrollable pos-r" ref={this.scrollableRef}>
              { this.renderList() }
            </div>
          </div>
        </div>

        <div id="sidebar-backdrop" className="custom-backdrop fade cur-p" onClick={this.onBackdropClick}/>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  rooms: getRooms(state),
  connectionStatus: getConnectionStatus(state)
})

const mapDispatchToProps = dispatch => {
  return {
    dialogActiveSet: dialogName => dispatch(dialogActiveSet(dialogName))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
