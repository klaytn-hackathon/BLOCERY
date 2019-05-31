import React  from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages, faImage } from '@fortawesome/free-solid-svg-icons'


export default class ImageUploadButton extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        return(
        <div className='buttons fadein'>
            {/*<div>*/}
            {/*<label htmlFor='single'>*/}
            {/*<FontAwesomeIcon icon={faImage} color='#3B5998' size='2x' />*/}
            {/*</label>*/}
            {/*<input type='file' id='single' onChange={props.onChange} />*/}
            {/*</div>*/}

            <div className='button'>
                <label htmlFor='multi'>
                    <FontAwesomeIcon icon={faImages} color='#6d84b4' size='lg' />
                </label>
                <input type='file' onChange={this.props.onChange} multiple={this.props.multiple}  accept='image/*'/>
            </div>
        </div>
        )
    }
}

ImageUploadButton.propTypes = {
    multiple: PropTypes.bool,
    onChange: PropTypes.func
}

ImageUploadButton.defaultProps = {
    multiple: false
}