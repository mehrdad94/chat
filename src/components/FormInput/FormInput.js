import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

export class FormInput extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  componentDidUpdate (prevProps) {
    // @todo check before update
    this.inputRef.current.value = this.props.inputValue
  }

  render () {
    return (
      <Fragment>
        <label className="text-normal text-dark" dangerouslySetInnerHTML={{__html: this.props.inputLabel}}/>

        <input className={"form-control" + (this.props.invalidFeedback ? ' is-invalid' : '') }
               onChange={this.props.onChange}
               aria-label={this.props.inputAriaLabel}
               ref={this.inputRef}
               placeholder={this.props.inputPlaceholder}
               type={this.props.inputType}
               defaultValue={this.props.inputValue}/>

        {
          this.props.invalidFeedback ? (
            <div className="invalid-feedback">
              {this.props.invalidFeedback}
            </div>
          ) : null
        }
      </Fragment>
    )
  }
}

FormInput.propTypes = {
  inputValue: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  inputLabel: PropTypes.string,
  inputType: PropTypes.string,
  inputPlaceholder : PropTypes.string,
  inputAriaLabel: PropTypes.string,
  invalidFeedback: PropTypes.string,
  onChange: PropTypes.func
}

FormInput.defaultProps = {
  inputType: 'text',
  inputPlaceholder: ''
}

export default FormInput
