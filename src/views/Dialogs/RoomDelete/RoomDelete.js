import React from 'react'
import { connect } from 'react-redux'
import { ConfirmModal } from '../../../components/ConfirmDialog/ConfirmModal'
import constants from '../../../configs/constants'
import { dialogActiveSet } from '../../../redux/actions'
import { apiRoomDelete } from '../../../api'
import { getDialogActive } from '../../../redux/reducers/application'
import { getRoomActive } from '../../../redux/reducers/rooms'

const deleteConfirmModalQuestion = 'Are you sure that you want to delete this Room?'

class RoomDelete extends React.Component {
  onModalClose = () => {
    this.props.dialogActiveSet('')
  }

  onApiError = error => {
    if (error.name === 'ValidationError') {
      this.setState({
        invalidFeedBacks: error.errors
      })
    }
  }

  onAccept = () => {
    apiRoomDelete({
      publicId: this.props.roomsActive.publicId,
      clb: payload => {
        if (payload.type === 'ERROR') this.onApiError(payload)
        else this.props.dialogActiveSet('')
      }
    })
  }

  render() {
    return (
      <ConfirmModal isActive={this.props.dialogActive === constants.DIALOG_NAMES[2]}
                    onModalClose={this.onModalClose}
                    onAccept={this.onAccept}
                    question={deleteConfirmModalQuestion}/>
    )
  }
}

const mapStateToProps = state => ({
  dialogActive: getDialogActive(state),
  roomsActive: getRoomActive(state)
})

const mapDispatchToProps = dispatch => {
  return {
    dialogActiveSet: dialogName => dispatch(dialogActiveSet(dialogName))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomDelete)
