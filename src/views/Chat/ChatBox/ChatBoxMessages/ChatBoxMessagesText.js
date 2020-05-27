import React from 'react'
import constants from '../../../../configs/constants'

export function MessageStatus (props) {
  switch (props.status) {
    case constants.MESSAGE_STATUS[0]:
      return <small className="mL-5" title="waiting"><i className="ti-time"/></small>
    case constants.MESSAGE_STATUS[1]:
      return <small className="mL-5" title="sent"><i className="ti-check"/></small>
    default:
      return null
  }
}

function MessageUserBody (props) {
  return (
    <div className="layer">
      <div className="peers fxw-nw ai-c pY-3 pX-10 bgc-white bdrs-2 lh-3/2">
        <div className="peer-greed ord-0">
          <span className="c-blue-grey-900" dir="auto">{props.body}</span>
        </div>
      </div>

      <div className="peers fxw-nw ai-c pY-3 pX-10 bgc-white bdrs-2 lh-3/2">
        <div className="peer-greed ord-0 ta-r">
          <small>{props.sentTime}</small>
          <MessageStatus status={props.status}/>
        </div>
      </div>
    </div>
  )
}
function MessagePartnerBody (props) {
  return (
    <div className="layer">
      <div className="peers fxw-nw ai-c pY-3 pX-10 bgc-white bdrs-2 lh-3/2">
        <div className="peer-greed">
          <span>{props.name}</span>
        </div>
      </div>
      <div className="peers fxw-nw ai-c pY-3 pX-10 bgc-white bdrs-2 lh-3/2">
        <div className="peer-greed">
          <span className="c-blue-grey-900" dir="auto">{props.body}</span>
        </div>
      </div>

      <div className="peers fxw-nw ai-c pY-3 pX-10 bgc-white bdrs-2 lh-3/2">
        <div className="peer-greed ord-0 ta-r">
          <small>{props.sentTime}</small>
        </div>
      </div>
    </div>
  )
}

export function MessagesCurrentUser (props) {
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

export function MessagesPartners (props) {
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
