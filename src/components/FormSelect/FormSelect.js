import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

export class FormSelect extends React.Component {
  constructor(props) {
    super(props)
    this.selectRef = React.createRef()
  }

  componentDidUpdate (prevProps) {
    this.selectRef.current.value = this.props.selectValue
  }

  genOptions = () => {
    return this.props.selectOptions.map(({ label, value, id }, index) => <option value={value} key={id || index}>{label}</option>)
  }

  render () {
    return (
      <Fragment>
        <label className="mr-sm-2 fw-500" htmlFor="inlineFormCustomSelect">{this.props.selectLabel}</label>

        <select className={"custom-select bdc-grey-200 mr-sm-2" + (this.props.invalidFeedback ? ' is-invalid' : '')}
                id="inlineFormCustomSelect"
                ref={this.selectRef}
                onChange={this.props.onChange}
                defaultValue={this.props.selectValue}>
          <option disabled>Choose...</option>

          { this.genOptions() }
        </select>

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

FormSelect.propTypes = {
  selectValue: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  selectLabel: PropTypes.string,
  selectOptions: PropTypes.array,
  invalidFeedback: PropTypes.string,
  onChange: PropTypes.func
}

FormSelect.defaultProps = {
  selectValue: '',
  selectLabel: '',
  selectOptions: [],
  invalidFeedback: '',
  onChange: () => {}
}
export default FormSelect
