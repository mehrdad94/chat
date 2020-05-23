import React, { Fragment } from 'react'
import { eventManage } from '../../../helpers/helper'
import $ from "jquery";

export async function waitOnAcceptCall () {
  return new Promise(function(resolve, reject){
    $(document).on('click', '#answer-call-btn', () => {
      resolve()
    })
    $(document).on('click', '#reject-call-btn', () => {
      reject()
    })
  })
}

class ChatBoxIncomingCall extends React.Component {
  state = {
    display: false
  }

  componentDidMount() {
    eventManage.subscribe('ON_OFFER_STREAM', () => {
      this.setState({
        display: true
      })
    })
  }

  render () {
    return (
      <Fragment>
        {
          this.state.display ? (
            <div className="layer pR-15 w-100 pos-a t-0 l-0 zi-3 bgc-white mT-2" id="chat-box-incoming-call">
              <div className="peers ai-c jc-c pL-10 h-100">
                <div className="peer peers peer-greed ai-c jc-fe">
                  <button className="peer btn btn-outline-success cur-p rounded-pill mr-2" id="answer-call-btn">
                    <i className="ti-video-camera mr-2 pos-r t-1"/>Answer
                  </button>

                  <button className="peer btn cur-p btn-outline-danger rounded-pill" id="reject-call-btn">
                    <i className="ti-power-off mr-2 pos-r t-1"/>Decline
                  </button>

                  <div className="peer peers pL-20">
                    <div className="peer">
                      <h6>Mehrdad</h6>
                      <small className="fw-600 c-grey-700">Incoming Call from</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : ''
        }
      </Fragment>
    )
  }
}

export default ChatBoxIncomingCall
