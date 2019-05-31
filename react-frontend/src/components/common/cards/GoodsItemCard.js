import React from 'react'
import PropTypes from 'prop-types'
import Style from './GoodsItemCard.module.scss'
import ComUtil from '../../../util/ComUtil'
import { Card, Button, CardImg, CardTitle, CardText, CardDeck,
    CardSubtitle, CardBody, Badge } from 'reactstrap';
const GoodsItemCard = (props) => {

    function onGoodsClick(){
        props.onGoodsClick(props)
    }
    function onFarmDiaryClick(){
        props.onFarmDiaryClick(props)
    }
    function onOrderClick(){
        props.onOrderClick(props)
    }
    const soldCnt = props.packCnt-props.remainedCnt //사용자 주문수량
    return(
        <CardDeck>
            <Card>
                <CardBody>
                    <CardTitle onClick={onGoodsClick}>{props.goodsNm}</CardTitle>
                    <CardSubtitle>{props.searchTag}</CardSubtitle>
                    <CardText>
                        {`수량/판매/재고 : ${props.packCnt}/${soldCnt}/${props.remainedCnt}`}<br/>예약 시 판매가 : {props.reservationPrice}<br/>예상출하 시작일 : {props.expectShippingStart}
                            <br/>
                            <Badge color='success' children={props.itemNm}/>{' '}
                            <Badge color='success' children={props.breedNm} />{' '}
                            <Badge color='success' children={props.pesticideYn} />
                            <Badge color='danger' children={!props.confirm ? '임시저장': ''} />{' '}
                        <br/>
                            <Button color={'warning'} onClick={onGoodsClick}>
                                상품수정
                            </Button>{' '}
                            <Button color={'warning'} onClick={onFarmDiaryClick}>
                                재배일지추가{' '}
                            </Button>{' '}
                            <Button color={'warning'} onClick={onOrderClick}>
                                주문{' '}
                                <Badge pill color='danger'>{soldCnt}</Badge>
                            </Button>

                    </CardText>

                </CardBody>
            </Card>
        </CardDeck>
    )
}
GoodsItemCard.propTypes = {
    goodsNo: PropTypes.number.isRequired,
    goodsNm: PropTypes.string,
    searchTag: PropTypes.string,
    packCnt: PropTypes.number,
    remainedCnt: PropTypes.number,
    reservationPrice: PropTypes.number,
    expectShippingStart: PropTypes.number,
    itemNm: PropTypes.string,
    breedNm: PropTypes.string,
    pesticideYn: PropTypes.string,
    confirm: PropTypes.bool,
    onGoodsClick: PropTypes.func.isRequired,
    onFarmDiaryClick: PropTypes.func.isRequired,
    onOrderClick: PropTypes.func.isRequired,

}
GoodsItemCard.defaultProps = {
    goodsNm: '',
    searchTag: '',
    packCnt: 0,
    remainedCnt: 0,
    reservationPrice: 0,
    expectShippingStart: '',
    itemNm: '',
    breedNm: '',
    pesticideYn: '',
    confirm: false,

}
export default GoodsItemCard