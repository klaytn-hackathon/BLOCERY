import React, { Component, Fragment } from 'react';
import { Container, Row, Col } from 'reactstrap'

import GoodsList from '../../common/goodsList';

import { getGoodsByConfirm } from '../../../lib/goodsApi'

import { BlocerySpinner, BasicDropdown } from '../../common'
import { Star, AttachMoney, TrendingDown } from '@material-ui/icons'
import ComUtil from '../../../util/ComUtil'
import { Const } from '../../Properties'

const style = {
    image: {
        width: '100%',
        height: '170px'
    }
}
const sortDropdownData = [
    {value: 0, text: 'Blocery추천', sorter: [
        {direction: 'ASC', property: 'saleEnd'},            //판매마감임박
        {direction: 'DESC', property: 'discountRate'},      //높은할인율
        {direction: 'ASC', property: 'reservationPrice'}    //낮은가격순
    ]},
    {value: 1, text: '낮은가격순', sorter: [{direction: 'ASC', property: 'reservationPrice'}]},     //낮은가격순
    {value: 2, text: '판매마감임박', sorter: [{direction: 'ASC', property: 'saleEnd'}]},             //판매마감임박
    {value: 3, text: '높은할인율', sorter: [{direction: 'DESC', property: 'discountRate'}]},         //높은할인율
    {value: 4, text: '높은가격순', sorter: [{direction: 'DESC', property: 'reservationPrice'}]},     //높은가격순

]
export default class Resv extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowData: [],
            dropdownOpen: false,
            sortIndex: 0,
            loading: true
        }
    }
    componentDidMount() {
        this.search()
    }

    search = async () => {
        this.setState({loading: true})
        const sorter = sortDropdownData[this.state.sortIndex].sorter

        const { data:rowData } = await getGoodsByConfirm(true, sorter)

        /**알파서비스 전용, 알파상품들에 대해 3단계 가격정책 적용.*/
        if (Const.IS_ALPHA_SERVICE) {
            rowData.map( (goods, index) => {
                goods.reservationPrice = ComUtil.price3StepCurrent(goods)
                goods.discountRate = 100 -((goods.reservationPrice / goods.shipPrice) * 100)
                return goods;
            })
        }

        // //price3Step - 알파서비스 전용, 1번상품에 대해 3단계 가격정책 적용.
        // const goodsOne = rowData.find(item => item.goodsNo === 1)
        // if(goodsOne){
        //     goodsOne.reservationPrice = ComUtil.price3StepCurrent(goodsOne)
        //     goodsOne.discountRate = 100 -((goodsOne.reservationPrice / goodsOne.shipPrice) * 100)
        // }

        this.setState({
            loading: false,
            rowData: rowData
        })
    }
    onGoodsClicked = (props) => {
        this.movePage(props)
    }
    movePage = ({goodsNo}) => {
        const pathName = this.props.history.location.pathname
        this.props.history.push(`/goods?goodsNo=${goodsNo}`)
    }
    onSortClick = ({value, text}) => {
        this.setState({
            sortIndex: value
        }, this.search)
    }

    render() {
        return(
            <Container>
                {
                    this.state.loading && <BlocerySpinner/>
                }
                <br/>
                <Row>
                    <Col xs={6}>Best 예약상품</Col>
                    <Col xs={6} className={'text-right'}>
                        { /* 상품목록 */ }
                        <BasicDropdown data={sortDropdownData} defaultValue={this.state.sortIndex} onClick={this.onSortClick}/>
                    </Col>
                </Row>
                { /* 필터링 */ }
                <GoodsList data={this.state.rowData} onGoodsClicked={this.onGoodsClicked} />
            </Container>
        )
    }
}
