import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export default (props) =>
    props.isLoading &&
    <div className='fadein'>
        <FontAwesomeIcon icon={faSpinner} spin />
    </div>