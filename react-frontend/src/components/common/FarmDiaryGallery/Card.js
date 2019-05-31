import React, {Component, Fragment} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeaf, faDolly, faTruckMoving } from '@fortawesome/free-solid-svg-icons'

// const Card = ({src, itemNm, title, onImageClicked}) => {
const Card = ({src, itemNm, title, onImageClicked}) => {
    return(
        <div>
            <span className='grow-state'>
                <FontAwesomeIcon icon={faLeaf} size={'2x'} inverse/>
            </span>
            <img src={src} onClick={onImageClicked}/>
            <div className='grow-title'>{itemNm}<br/><small>{title}</small></div>
        </div>
    )
}

export default Card
