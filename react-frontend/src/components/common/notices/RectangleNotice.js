import React from 'react'
import Style from './RectangleNotice.module.scss'
import classNames from 'classnames'
import PropTypes from 'prop-types'
const RectangleNotice = (props) => {
    return(
        <div className={classNames(Style.wrap, props.className)} onClick={props.onClick}>{props.children}</div>
    )
}
RectangleNotice.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func
}
RectangleNotice.defaultProps = {
    className: null,
    onClick: null
}

export default RectangleNotice