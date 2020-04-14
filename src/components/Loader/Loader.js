import React from 'react'
import PropTypes from 'prop-types'
import './Loader.scss'

export class Loader extends React.Component {
    loaderClassName = () => {
        return this.props.active ? '' : 'fadeOut' // show or hide Loader
    }
    render() {
        return (
            <div id="loader"
                 className={this.loaderClassName()}>
                <div className="spinner"/>
            </div>
        )
    }
}

Loader.propTypes = {
    active: PropTypes.bool
}
Loader.defaultProps = {
    active: false
}