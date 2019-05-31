import React, {Fragment} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { MainGoodsCard } from '../cards'
import ReactSwipe from 'react-swipe'
import Style from './MainGoodsCarousel.module.scss'
import { Badge } from 'reactstrap'
import { NavigateBefore, NavigateNext } from '@material-ui/icons'
import { Server, Const } from '../../Properties'
import ComUtil from '../../../util/ComUtil'

const myDiv = <Fragment><div style={{background: 'gray'}}>test</div><div style={{background: 'gray'}}>test</div><div style={{background: 'gray'}}>test</div><div style={{background: 'gray'}}>test</div></Fragment>

const MainGoodsCarousel = (props) => {
    const serverImageUrl = Server.getImageURL()
    let reactSwipeEl
    return (
        <div className={Style.container}>
            <i className={Style.btnBefore} onClick={() => reactSwipeEl.prev()}><NavigateBefore fontSize={'large'}/></i>
            <i className={Style.btnNext} onClick={() => reactSwipeEl.next()}><NavigateNext fontSize={'large'}/></i>
            <ReactSwipe
                className="carousel"
                swipeOptions={{ continuous: false }}
                ref={el => (reactSwipeEl = el)}
            >

                {/* react-swipe 에서 컴포넌트를 사용하려면 div 를 감싸줘야 함 */}
                {
                    props.data.map((goods)=>{

                        let item = Object.assign({}, goods);
                        /**알파서비스 전용, 알파서비스 상품에 대해 3단계 가격정책 적용.*/
                        //price3Step - 알파서비스 전용, 1번상품에 대해 3단계 가격정책 적용.
                        if (Const.IS_ALPHA_SERVICE) {
                            item.reservationPrice = ComUtil.price3StepCurrent(item)
                            item.discountRate = 100 -((item.reservationPrice / item.shipPrice) * 100)
                        }

                        return (
                            <div key={'goodsNo_'+item.goodsNo}>
                                <MainGoodsCard
                                    {...item}
                                    imageUrl={serverImageUrl+item.goodsImages[0].imageUrl}
                                    onClick={props.onClick.bind(this, item)}
                                />
                            </div>
                        )
                    })
                }


            </ReactSwipe>
        </div>
    )
}

MainGoodsCarousel.propTypes = {
    data: PropTypes.array.isRequired
}
MainGoodsCarousel.defaultProps = {
    data: []
}
export default MainGoodsCarousel