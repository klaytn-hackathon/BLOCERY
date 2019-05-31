import React from 'react'
import { Button } from 'reactstrap'
import Style from './FooterButtons.module.scss'
import PropTypes from 'prop-types'
const FooterButtons = (props) => {
    return(
        <footer className={Style.wrap}>
            {
                props.data.map((item, index)=>{
                    return <div key={index}><Button color={item.color} onClick={item.onClick} block>{item.title}</Button></div>
                })
            }
        </footer>
    )
}

FooterButtons.propTypes = {
    data: PropTypes.array.isRequired
}
FooterButtons.defaultPropTypes = {
    data: []
}

export default FooterButtons