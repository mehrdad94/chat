import React  from 'react'
import { connect } from 'react-redux'
import { CellMeasurer, CellMeasurerCache, List, AutoSizer } from 'react-virtualized'
import moment from 'moment'
import PerfectScrollbar from 'perfect-scrollbar'
import { eventManage } from '../../../helpers/helper'
import { getMessagesFromActiveRoom } from '../../../redux/reducers/messages'
import { getProfilesCurrentUserId, getProfiles } from '../../../redux/reducers/profiles'
import { getRoomActiveId } from '../../../redux/reducers/rooms'
import { MessagesCurrentUser, MessagesPartners } from './ChatBoxMessages/ChatBoxMessagesText'
import { MessagesFileCurrentUser } from './ChatBoxMessages/ChatBoxMessagesFile'

const cache = new CellMeasurerCache({
  fixedWidth: true
})

let scrollableElement

class ChatBoxMessages extends React.Component {
  constructor (props) {
    super(props)
    this.virtualizedRef = React.createRef()
  }

  state = {
    scrollToIndex: 0,
    isScrollDown: true
  }

  renderMessage = ({ index, key, parent, style }) => {
    const message = this.props.messages[index]
    const currentUserId = this.props.profileCurrentUserId

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}>
        <div style={style}>
          {
            currentUserId === message.senderId ? (
            <MessagesCurrentUser key={message.id}
                                body={message.body}
                                sentTime={moment(message.sentTime).format('LT')}
                                displayName={this.props.profiles[message.senderId].name}
                                status={message.status}
                                avatar={this.props.profiles[message.senderId].avatar}
                />
            ) : (
              <MessagesPartners key={message.id}
                                   body={message.body}
                                   sentTime={moment(message.sentTime).format('LT')}
                                   displayName={this.props.profiles[message.senderId].name}
                                   avatar={this.props.profiles[message.senderId].avatar}/>
            )
          }
        </div>
      </CellMeasurer>
    )
  }

  scrollDown = () => {
    this.setState({
      scrollToIndex: this.props.messages.length
    })

    setTimeout(() => {
      if (!scrollableElement) return

      scrollableElement.scrollTop = scrollableElement.scrollHeight * 2
    })
  }

  componentDidMount () {
    scrollableElement = document.getElementById('chatBoxScrollable')

    new PerfectScrollbar(scrollableElement, { minScrollbarLength: 25 })

    eventManage.subscribe('ON_NEW_MESSAGE', ({ roomId }) => {
      if (roomId === this.props.roomsActiveId && this.state.isScrollDown) this.scrollDown()
    })

    eventManage.subscribe('USER_SENT_NEW_MESSAGE', () => {
      this.scrollDown()
    })

    eventManage.subscribe('ON_MESSAGE_STATUS_CHANGE', () => {
      setTimeout(() => {
        this.virtualizedRef.current.forceUpdateGrid()
      })
    })

    if (this.props.roomsActiveId) this.scrollDown()

    scrollableElement.addEventListener('ps-scroll-y', () => {
      if (this.state.isScrollDown === true) this.setState({ isScrollDown: false })
    })
    scrollableElement.addEventListener('ps-y-reach-end', () => {
      if (this.state.isScrollDown === false) this.setState({ isScrollDown: true })
    })
  }

  componentDidUpdate (prevProps) {
    if (prevProps.roomsActiveId !== this.props.roomsActiveId) {
      this.scrollDown()
    }
  }

  render () {
    return (
      <div className="layer w-100 fxg-1 bgc-grey-200">
        <AutoSizer>
          {({height, width}) => (
            <List className="p-20 scrollable pos-r"
                  id="chatBoxScrollable"
                  ref={this.virtualizedRef}
                  height={height}
                  width={width}
                  rowHeight={cache.rowHeight}
                  rowRenderer={this.renderMessage}
                  rowCount={this.props.messages.length}
                  scrollToIndex={this.state.scrollToIndex}/>
          )}
        </AutoSizer>

        {
          this.state.isScrollDown ? null : (
            <button type="button" className="btn pos-a cur-p btn-light bdrs-50p w-2r p-0 h-2r pos-a b-20 r-20" onClick={this.scrollDown}>
              {/*<span className="notification-counter bgc-red pos-a b-20 r-20">3</span>*/}
              <i className="fa fa-arrow-down"/>
            </button>
          )
        }
      </div>
    )
  }
}

// function MessageTextUser () {
//   <span className="c-blue-grey-900">{props.body}</span>
// }

const mapStateToProps = state => ({
  messages: getMessagesFromActiveRoom(state),
  roomsActiveId: getRoomActiveId(state),
  profileCurrentUserId: getProfilesCurrentUserId(state),
  profiles: getProfiles(state)
})

export default connect(mapStateToProps)(ChatBoxMessages)
