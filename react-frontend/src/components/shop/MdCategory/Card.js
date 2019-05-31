import React from 'react'
import PropTypes from 'prop-types'
import './Card.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Card = (props) => {
    return (
        <div className={`rec-card ${props.active && 'active'}`} onClick={props.onClick.bind(this, {...props})}>
            <FontAwesomeIcon icon={props.icon} size={props.active?'2x':'lg'} />
            <div>{props.name}</div>
        </div>
    )
}
export default Card

Card.propTypes = {
    name: PropTypes.string.isRequired,
    itemCd: PropTypes.string.isRequired,
    active: PropTypes.bool,
    onClick: PropTypes.func
}