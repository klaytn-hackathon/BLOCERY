import React, { Fragment } from 'react'
import { Link, NavLink as RouterLink } from 'react-router-dom'
import Style from './ProducerNav.module.scss'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { ProducerMenuList } from '../../Properties'

const ProducerNav = (props) => {
    return(
        <div className={Style.wrap}>
            {
                ProducerMenuList.map(menu => {
                    return(
                        menu.visibility &&
                        (
                            <div key={menu.route+menu.id} className={props.id === menu.id ? Style.active : null}>
                                <RouterLink to={`/${menu.route}/${menu.id}` }>{menu.name}</RouterLink>
                            </div>
                        )
                    )
                })
            }
        </div>
    )
}

ProducerNav.propTypes = {

}
ProducerNav.defaultProp = {
}

export default ProducerNav