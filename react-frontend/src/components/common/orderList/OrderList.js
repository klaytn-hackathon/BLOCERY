import React, { Component, Fragment } from 'react'
import { Row, Col, FormGroup, Label, Button } from 'reactstrap'
import Style from './OrderList.module.scss'
import { Server } from '../../Properties'
import ComUtil from '../../../util/ComUtil'

import { BLCT_TO_WON } from "../../../lib/exchangeApi"
import { getOrderByConsumerNo } from '../../../lib/shopApi'

export default class OrderList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            consumerNo : this.props.consumerNo,
            orderList: []
        }
    }

    componentDidMount() {
        this.getOrderList();
    }

    getOrderList = async () => {
        const response = await getOrderByConsumerNo(this.state.consumerNo);
        const sortData = ComUtil.sort(response.data, 'orderDate', false)    // 최근구매내역순으로 정렬

        this.setState({
            orderList: sortData
        })
    }

    // 주문 상세조회
    getOrderDetail = (orderNo) => {
        this.props.history.push('/orderDetail?orderNo='+orderNo)
    }

    render() {
        const data = this.state.orderList
        const blct = {BLCT_TO_WON}.BLCT_TO_WON
        return(
            <Row>
                <Col style={{padding:0, margin:0}}>
                <h5 className={Style.header}>
                    구매내역
                </h5>
                    {
                        data != '' ?
                            data.map(({orderNo, orderCnt, goodsNm, packAmount, packUnit, orderPrice, orderDate, orderImg, deliveryDate, deliveryFinishDate, consumerOkDate}, index)=>{
                                return (
                                    <div className={Style.wrap} key={index}>
                                        <section className={Style.sectionDate}>
                                            <div><small>{ComUtil.utcToString(orderDate)}</small></div>
                                            {
                                                consumerOkDate != null ?
                                                    <div><small><b>구매확정</b></small></div>
                                                    :
                                                    <div>
                                                    {
                                                        deliveryFinishDate != null ?
                                                        <div><small><b>배송완료</b></small></div>
                                                        :
                                                        <div>
                                                            {
                                                                deliveryDate != null ?
                                                                    <div><small><b>배송중</b></small></div> : <div><small><b>상품준비중</b></small></div>
                                                            }
                                                        </div>
                                                    }
                                                    </div>
                                            }
                                        </section>
                                        <section className={Style.sectionContent} onClick={this.getOrderDetail.bind(this, orderNo)}>
                                            <div className={Style.img}>
                                                <img className={Style.goodsImg} src={Server.getThumbnailURL()+orderImg} />
                                            </div>
                                            <div className={Style.content}>
                                                <div>주문번호 : {orderNo}</div>
                                                <div>{goodsNm} {packAmount}{packUnit}</div>
                                                <div><span className={'text-danger'}>{ComUtil.addCommas(orderPrice)}</span>원 (<span className={'text-danger'}>
                                                    {ComUtil.addCommas(orderPrice/blct)}</span>α-BLCT) | 수량 : {orderCnt}개</div>
                                            </div>
                                            <div className={Style.orderDetail}>
                                                <div>{'>'}</div>
                                            </div>
                                        </section>
                                    </div>
                                )
                            })
                        :
                            <div className={Style.noneResult}>구매내역이 없습니다.</div>
                    }
                </Col>
            </Row>
        )
    }
}