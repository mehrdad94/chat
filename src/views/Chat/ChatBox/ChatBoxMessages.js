import React  from 'react'
import { connect } from 'react-redux'
import { CellMeasurer, CellMeasurerCache, List, AutoSizer } from 'react-virtualized'
import moment from 'moment'
import PerfectScrollbar from 'perfect-scrollbar'
import { eventManage } from '../../../helpers/helper'
import { getMessagesFromActiveRoom } from '../../../redux/reducers/messages'
import { getProfilesCurrentUserId, getProfiles } from '../../../redux/reducers/profiles'
import { getRoomActiveId } from '../../../redux/reducers/rooms'
import constants from '../../../configs/constants.json'

const cache = new CellMeasurerCache({
  fixedWidth: true
})

let scrollableElement

class ChatBoxMessages extends React.Component {
  constructor (props) {
    super(props)
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
              <span className="notification-counter bgc-red pos-a b-20 r-20">3</span>
              <i className="fa fa-arrow-down"/>
            </button>
          )
        }
      </div>
    )
  }
}

function MessageUserBody (props) {
  return (
    <div className="layer">
      <div className="peers fxw-nw ai-c pY-3 pX-10 bgc-white bdrs-2 lh-3/2">
        <div className="peer-greed ord-0">
          <i className='c-blue-grey-900'>{props.name}</i>
        </div>
      </div>
      <div className="peers fxw-nw ai-c pY-3 pX-10 bgc-white bdrs-2 lh-3/2">
        <div className="peer mL-10 ord-1">
          <small>{props.sentTime}</small>
          <MessageStatus status={props.status}/>
        </div>

        <div className="peer-greed ord-0">
          <span>{props.body}</span>
        </div>
      </div>
    </div>
  )
}

function MessagePartnerBody (props) {
  return (
    <div className="layer">
      <div className="peers fxw-nw ai-c pY-3 pX-10 bgc-white bdrs-2 lh-3/2">
        <div className="peer-greed ta-r">
          <i className='c-blue-grey-900'>{props.name}</i>
        </div>
      </div>
      <div className="peers fxw-nw ai-c pY-3 pX-10 bgc-white bdrs-2 lh-3/2">
        <div className="peer mR-10">
          <small>{props.sentTime}</small>
        </div>
        <div className="peer-greed">
          <span>{props.body}</span>
        </div>
      </div>
    </div>
  )
}

function MessagesCurrentUser (props) {
  return (
    <div className="peers fxw-nw ai-fe my-1">
      <div className="peer ord-1 mL-20">
        <img className="w-2r bdrs-50p"
             width="32"
             height="32"
             src={props.avatar}
             alt=""/>
      </div>
      <div className="peer peer-greed ord-0">
        <div className="layers ai-fe gapY-10">
          <MessageUserBody body={props.body} sentTime={props.sentTime} name={props.displayName} status={props.status} />
        </div>
      </div>
    </div>
  )
}

function MessagesPartners (props) {
  return (
    <div className="peers fxw-nw my-1">
      <div className="peer mR-20">
        <img className="w-2r bdrs-50p"
             width="32"
             height="32"
             src={props.avatar}
             alt=""/>
      </div>
      <div className="peer peer-greed">
        <div className="layers ai-fs gapY-5">
          <MessagePartnerBody body={props.body} sentTime={props.sentTime} name={props.displayName}/>
        </div>
      </div>
    </div>
  )
}

function MessageStatus (props) {
  switch (props.status) {
    case constants.MESSAGE_STATUS[0]:
      return <small className="mL-5" title="waiting"><i className="ti-time"/></small>
    case constants.MESSAGE_STATUS[1]:
      return <small className="mL-5" title="sent"><i className="ti-check"/></small>
    default:
      return null
  }
}

const mapStateToProps = state => ({
  messages: getMessagesFromActiveRoom(state),
  roomsActiveId: getRoomActiveId(state),
  profileCurrentUserId: getProfilesCurrentUserId(state),
  profiles: getProfiles(state)
})

export default connect(mapStateToProps)(ChatBoxMessages)
