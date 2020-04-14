import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

const Component = props => {
  return (
    <div className='pos-a t-0 l-0 bgc-white w-100 h-100 d-f fxd-r fxw-w ai-c jc-c pos-r p-30' style={{zIndex: props.zIndex || 1}}>
      <div className='d-f jc-c fxd-c'>
        <h3 className='mB-10 fsz-lg c-grey-900 tt-c title'>{props.title}</h3>
        <p className='mB-30 fsz-def c-grey-700 description'>{props.description}</p>
      </div>
    </div>
  )
}

export class Unavailable extends React.Component {

  render () {
    const { isActive } = this.props

    return (
      <Fragment>
        { isActive ? <Component {...this.props}/> : null }
      </Fragment>
    )
  }
}

Unavailable.propTypes = {
  isActive: PropTypes.bool,
  description: PropTypes.string,
  zIndex: PropTypes.number
}
