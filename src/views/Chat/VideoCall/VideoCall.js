import React from 'react'
import { connect } from 'react-redux'
import { eventManage } from '../../../helpers/helper'

class VideoCall extends React.Component {
  constructor(props) {
    super(props)
    this.userVideo = React.createRef()
    this.videosWrap = React.createRef()
  }

  state = {
    streams: []
  }

  componentDidMount() {
    eventManage.subscribe('ON_LOCAL_STREAM', ({ stream }) => {
      this.userVideo.current.srcObject = stream
    })

    eventManage.subscribe('ON_REMOTE_STREAM', ({ stream, peerId }) => {
      console.log('find me')

      const video = document.createElement('video')
      video.srcObject = stream
      video.className = 'peer peer-greed h-100'
      video.id = `video${peerId}`
      video.autoplay = true

      this.videosWrap.current.appendChild(video)
    })
  }

  render () {
    return (
      <div id="video-call-wrap" className="h-100 bgc-white shadow">
        <div id="videos-container" className="p-20 pos-r">

          <div className="h-100 peers" ref={this.videosWrap}>
          </div>

          <div id="user-video-container" className="pos-a r-70 b-70">
            <video className="fl-r" ref={this.userVideo} autoPlay muted/>
          </div>
        </div>
        <div className="layer bdT p-20 w-100">
          <div className="peers ai-c jc-c pX-10">
            <div className="peer peers peer-greed">
              <div className="peer">
                <h6>00:32</h6>
                <small className="fw-600 c-grey-700">Time</small>
              </div>

              <div className="peer pL-50">
                <h6 className="">Mehrdad</h6>
                <small className="fw-600 c-grey-700">Video Call with</small>
              </div>
            </div>
            <div className="peer peers ai-c">
              <a href="" className="peer td-n c-grey-900 cH-blue-500 fsz-md mR-30" title="">
                <i className="ti-comments"/>
              </a>

              <a href="" className="peer td-n c-grey-900 cH-blue-500 fsz-md mR-30" title="">
                <i className="ti-video-camera"/>
              </a>
              <a href="" className="peer td-n c-grey-900 cH-blue-500 fsz-md mR-30" title="">
                <i className="ti-headphone"/>
              </a>

              <button className="peer btn cur-p btn-light bg-white px-0 border-0 cH-blue-500">
                <i className="ti-loop mr-2 pos-r t-1"/>Reconnect
              </button>
            </div>
            <div className="peer peers peer-greed ai-c jc-fe">
              <button className="peer btn cur-p btn-light border rounded-pill bg-white cH-blue-500">
                <i className="ti-power-off mr-2 pos-r t-1"/>End Session
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(VideoCall)
