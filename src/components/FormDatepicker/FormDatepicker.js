import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'

let datePicker
const defaultEventDateFormat = 'yyyy-mm-dd'
export class FormDatepicker extends React.Component {
  constructor(props) {
    super(props)
    this.pickerRef = React.createRef()
  }

  handleChange = event => {
    if (this.props.onChange) this.props.onChange(event)
  }

  componentDidMount (){
    datePicker = $('.event-date').datepicker({
      format: this.props.defaultEventDateFormat,
      autoclose: true
    }).on('hide', this.handleChange)
  }

  componentDidUpdate (prevProps) {
    // @todo check before update
    this.pickerRef.current.value = this.props.pickerValue

    if (this.props.defaultEventDateFormat !== prevProps.defaultEventDateFormat) {
      datePicker.datepicker('destroy').datepicker({
        updateViewDate: false,
        format: this.props.defaultEventDateFormat || defaultEventDateFormat
      }).on('changeDate', this.handleChange)
    }
  }

  render () {
    return (
      <Fragment>
        <label className="fw-500">{this.props.pickerLabel}</label>

        <div className="timepicker-input input-icon form-group">
          <div className="input-group">
            <div className="input-group-addon bgc-white bd bdwR-0">
              <i className="ti-calendar"/>
            </div>

            <input type="text"
                   className={"form-control bdc-grey-200 event-date" + (this.props.invalidFeedback ? ' is-invalid' : '') }
                   placeholder="Datepicker"
                   data-provide="datepicker"
                   ref={this.pickerRef}
                   onChange={this.handleChange}
                   defaultValue={this.props.pickerValue}/>

            {
              this.props.invalidFeedback ? (
                <div className="invalid-feedback">
                  {this.props.invalidFeedback}
                </div>
              ) : null
            }
          </div>
        </div>
      </Fragment>
    )
  }
}

FormDatepicker.propTypes = {
  defaultEventDateFormat: PropTypes.string,
  pickerValue: PropTypes.string,
  pickerLabel: PropTypes.string,
  invalidFeedback: PropTypes.string,
  onChange: PropTypes.func
}

FormDatepicker.defaultProps = {
  defaultEventDateFormat,
  pickerValue: '',
  pickerLabel: '',
  invalidFeedback: '',
  onChange: () => {}
}

export default FormDatepicker