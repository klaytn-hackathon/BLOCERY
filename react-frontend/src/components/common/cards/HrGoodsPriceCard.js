import React, { Fragment } from 'react'
import Style from './HrGoodsPriceCard.module.scss'
import classNames from 'classnames'
import ComUtil from '../../../util/ComUtil'
import PropTypes from 'prop-types'
const HrGoodsPriceCard = (props) => {
    console.log('props',props)
    return(
        <Fragment>
            {
                props.data.map(item=>{
                  return(
                      <div key={item.toDate} className={classNames(Style.card, item.active && Style.active )}>
                          <div className={Style.percentage}>{item.discountRate}%</div>
                          <div className={Style.date}>{item.toDate} 까지</div>
                          <div className={Style.price}>{ComUtil.addCommas(item.price)}원</div>
                      </div>
                  )
                })
            }
        </Fragment>
    )
}
HrGoodsPriceCard.propTypes = {
    data: PropTypes.array.isRequired
}
HrGoodsPriceCard.defaultProps = {
    data: []
}

export default HrGoodsPriceCard