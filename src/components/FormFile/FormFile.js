import React from 'react'
import PropTypes from 'prop-types'

export class FormFile extends React.Component {
  handleChange = event => {
    if (this.props.onChange) this.props.onChange(event)
  }

  render () {
    return (
      <div className="custom-file">
        <input type="file"
               accept={ this.props.accept }
               onClick={e => { e.target.value = null }}
               onChange={this.handleChange}
               className={"custom-file-input form-control-file bdc-grey-200" + (this.props.invalidFeedback ? ' is-invalid' : '') }
               id={this.props.identifier}/>
        <label className="fw-500 custom-file-label" htmlFor={this.props.identifier}>{this.props.inputLabel}</label>
        {
          this.props.invalidFeedback ? (
            <div className="invalid-feedback">
              {this.props.invalidFeedback}
            </div>
          ) : null
        }
      </div>
    )
  }
}

FormFile.propTypes = {
  inputLabel: PropTypes.string,
  invalidFeedback: PropTypes.string,
  onChange: PropTypes.func,
  accept: PropTypes.string,
  identifier: PropTypes.string
}

export default FormFile
