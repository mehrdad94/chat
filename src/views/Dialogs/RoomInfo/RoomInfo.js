// room name, avatar, room unique id
import React from 'react'
import { connect } from 'react-redux'
import { Dialog } from '../../../components/Dialog/Dialog'
import { dialogActiveSet, roomUpdate } from '../../../redux/actions'
import constants from '../../../configs/constants'
import { getDialogActive } from '../../../redux/reducers/application'
import { getRoomActive } from '../../../redux/reducers/rooms'
import { getRoomActiveProfiles } from '../../../redux/reducers/profiles'

const genState = props => {
  const {
    name = props.roomsActive.name || '',
    avatar = props.roomsActive.avatar || '',
    publicId = props.roomsActive.publicId || '',
    newPublicId = props.roomsActive.publicId || '',
    invalidFeedBacks = {
      name: '',
      avatar: '',
      newPublicId: ''
    }
  } = props
  return {
    name,
    avatar,
    publicId,
    newPublicId,
    invalidFeedBacks
  }
}

function Member (props) {
  return (
    <li>
      <a href="#!" className="peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100 ai-c">
        <div className="peer mR-15">
          <img className="w-3r bdrs-50p" src={props.avatar} alt="avatar"/>
        </div>
        <div className="peer peer-greed">
          <div>
            <div className="peers jc-sb fxw-nw">
              <div className="peer"><p className="fw-500 mB-0">{props.name}</p></div>
              <div className="peer">
                {/*<small className="fsz-xs">5 mins ago</small>*/}
              </div>
            </div>
            {/*<span className="c-grey-600 fsz-sm">Want to create your own customized data generator for your app...</span>*/}
          </div>
        </div>
      </a>
    </li>
  )
}

class RoomInfo extends React.Component {
  state = genState(this.props)

  onApiError = error => {
    if (error.name === 'ValidationError') {
      this.setState({
        invalidFeedBacks: error.errors
      })
    } else if (error.name === 'RoomDuplicateError') {
      this.setState({
        invalidFeedBacks: {
          newPublicId: 'This room is taken please select something else'
        }
      })
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.roomsActive.id !== this.props.roomsActive.id) {
      // reset state
      this.setState(genState(this.props))
    }
  }

  DialogHeader = () => {
    return (
      <h5 className="m-0 dialog-title">Room Info</h5>
    )
  }

  DialogBody = () => {
    return (
      <ul className="pos-r lis-n p-0 m-0 fsz-sm">
        <li className="pX-20 pY-15 bdB">
          <i className="ti-info pR-10"/>
          <span className="fsz-sm fw-600 c-grey-900">Info</span>
        </li>
        <li className="pX-20 pT-15 pB-10">
          <span className="fsz-sm fw-600 c-grey-900 pR-10">Name:</span>
          <span>{this.props.roomsActive.name}</span>
        </li>
        <li className="pX-20 pT-15 pB-15">
          <span className="fsz-sm fw-600 c-grey-900 pR-10">Room Id:</span>
          <span>{this.props.roomsActive.publicId}</span>
        </li>
        <li className="pX-20 pY-15 bdB bdT">
          <i className="ti-face-smile pR-10"/>
          <span className="fsz-sm fw-600 c-grey-900">Members</span>
        </li>
        {
          this.props.roomActiveProfiles.map(profile => <Member key={profile.id} {...profile}/>)
        }
      </ul>
    )
  }

  DialogFooter = () => {
    return (
      <div className="w-100">
        <button type="button" className="btn mr-1" data-dismiss="modal">Close</button>
      </div>
    )
  }

  onModalClose = () => {
    this.props.dialogActiveSet('')
    this.setState(genState(this.props))
  }

  onModalOpen = () => {
    this.setState(genState(this.props))
  }

  render() {
    return (
      <Dialog
        onModalClose={this.onModalClose}
        onModalOpen={this.onModalOpen}
        isActive={this.props.dialogActive === constants.DIALOG_NAMES[4]}
        header={<this.DialogHeader/>}
        body={<this.DialogBody/>}
        footer={<this.DialogFooter/>}
        modalId={'RoomInfoDialog'}/>
    )
  }
}

const mapStateToProps = state => ({
  dialogActive: getDialogActive(state),
  roomsActive: getRoomActive(state),
  roomActiveProfiles: getRoomActiveProfiles(state)
})

const mapDispatchToProps = dispatch => {
  return {
    dialogActiveSet: () => dispatch(dialogActiveSet()),
    roomUpdate: (payload) => dispatch(roomUpdate(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomInfo)
