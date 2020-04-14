// room name, avatar, room unique id
import React from 'react'
import { connect } from 'react-redux'

import { Dialog } from '../../../components/Dialog/Dialog'
import FormInput from '../../../components/FormInput/FormInput'
import { dialogActiveSet } from '../../../redux/actions'
import constants from '../../../configs/constants'
import { apiRoomCreate } from '../../../api'
import { getDialogActive } from '../../../redux/reducers/application'

const genState = props => {
  const {
    name = '',
    avatar = '',
    publicId = '',
    invalidFeedBacks = {
      name: '',
      avatar: '',
      publicId: '',
    }
  } = props
  return {
    name,
    avatar,
    publicId,
    invalidFeedBacks
  }
}

class RoomCreate extends React.Component {
  state = genState(this.props)

  handleChange = (type, event) => {
    this.setState({
      [type]: event.target.value
    })
  }

  onApiError = (error) => {
    if (error.name === 'ValidationError') {
      this.setState({
        invalidFeedBacks: error.errors
      })
    } else if (error.name === 'RoomDuplicateError') {
      this.setState({
        invalidFeedBacks: {
          publicId: 'This room is taken, please select something else.'
        }
      })
    }
  }

  onAccept = () => {
    apiRoomCreate({
      name: this.state.name,
      avatar: 'sfdsdf',
      publicId: this.state.publicId,
      clb: (payload) => {
        if (payload.type === 'ERROR') this.onApiError(payload)
        else this.props.dialogActiveSet('')
      }
    })
  }

  DialogHeader = () => {
    return (
      <h5 className="m-0 dialog-title">Create A Room</h5>
    )
  }

  DialogBody = () => {
    return (
      <form>
        <div className="form-group">
          <FormInput
            inputLabel={ 'Name' }
            inputValue={ this.state.name }
            inputAriaLabel={ 'InputRoomName' }
            invalidFeedback={ this.state.invalidFeedBacks.name }
            onChange={ event => this.handleChange('name', event) }/>
        </div>

        <div className="form-group">
          <FormInput
            inputLabel={ 'Choose a unique Id for your room' }
            inputValue={ this.state.publicId }
            inputAriaLabel={ 'InputRoomPublicId' }
            invalidFeedback={ this.state.invalidFeedBacks.publicId }
            onChange={ event => this.handleChange('publicId', event) }/>
        </div>
      </form>
    )
  }

  DialogFooter = () => {
    return (
      <div className="w-100">
        <button type="button" className="btn mr-1" data-dismiss="modal">Close</button>
        <button className="btn btn-primary cur-p ml-1" onClick={this.onAccept}>Done</button>
      </div>
    )
  }

  onModalClose = () => {
    this.props.dialogActiveSet('')

    // reset state
    this.setState(genState(this.props))
  }

  render() {
    return (
        <Dialog
          onModalClose={this.onModalClose}
          isActive={this.props.dialogActive === constants.DIALOG_NAMES[0]}
          header={<this.DialogHeader/>}
          body={<this.DialogBody/>}
          footer={<this.DialogFooter/>}/>
    )
  }
}

const mapStateToProps = state => ({
  dialogActive: getDialogActive(state)
})

const mapDispatchToProps = dispatch => {
  return {
    dialogActiveSet: dialogName => dispatch(dialogActiveSet(dialogName))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomCreate)
