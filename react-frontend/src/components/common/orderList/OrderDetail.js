import React, { Component, Fragment } from 'react'
import { Container, Row, Col, Button, Input, Label } from 'reactstrap'
import { Server } from '../../Properties'
import Style from './OrderDetail.module.scss'
import ComUtil from '../../../util/ComUtil'

import { BLCT_TO_WON } from "../../../lib/exchangeApi"

import { DeliverTracking } from "../deliveryTracking/DeliveryTracking"

import { ShopXButtonNav, ModalConfirm, ModalWithNav } from '../../common'
import { getOrderByOrderNo, updateConsumerOkDate } from '../../../lib/shopApi'
import { getGoodsByGoodsNo } from '../../../lib/goodsApi'
// import { getDeliverTrace } from '../../../lib/deliveryOpenApi'

import classnames from 'classnames'
import DeliveryTracking from "../deliveryTracking/DeliveryTracking";

export default class OrderDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderNo: null,
            orderInfo: {},
            goodsInfo: {},
            confirmHidden: false,
            isOpen: false
        }
    }

    async componentDidMount() {
        await this.getOrderInfo();

        if (this.state.orderInfo.consumerOkDate != null) {
            this.setState({
                confirmHidden: false
            })
        }
    }

    componentWillMount() {
        //파라미터로 주문정보 가져오기
        const params = new URLSearchParams(this.props.location.search)
        const orderNo = params.get('orderNo')

        this.setState({
            orderNo: orderNo
        })
    }

    getOrderInfo = async () => {
        const orderInfo = await getOrderByOrderNo(this.state.orderNo)
        this.setState({
            orderInfo: orderInfo.data
        })

        //console.log(this.state.orderInfo)

        const goodsInfo = await getGoodsByGoodsNo(orderInfo.data.goodsNo)
        this.setState({
            goodsInfo: goodsInfo.data
        })
    }

    // 구매확정 클릭시
    onConfirmed = async (isConfirmed) => {
        const order = this.state.orderInfo

        order.consumerOkDate = ComUtil.getNow();

        if(isConfirmed) {
            if(order.deliveryFinishDate == null) {
                order.deliveryFinishDate = ComUtil.getNow();
            }
            await updateConsumerOkDate(order)   //db에 저장
            this.setState({
                confirmHidden: true
            })
        }
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })

    }

    onClose = (data) => {
        this.toggle();
    }

    // 배송조회시 onLoad(data==true이면
    callback = async (data) => {
        const order = this.state.orderInfo

        console.log(data)
        if (data.complete) {
            order.deliveryFinishDate = data.lastDetail.time
            await updateConsumerOkDate(order)
        }
    }

    render() {
        const order = this.state.orderInfo
        const goods = this.state.goodsInfo
        const blct =  BLCT_TO_WON
        return (
            <Fragment>
                <ShopXButtonNav backclose history={this.props.history}> 구매내역 </ShopXButtonNav>
                <br />
                <Container fluid>
                    <Row>
                        <Col xs="8">
                            <h5>상품정보</h5>
                        </Col>
                        <Col xs="4">
                            <h6 align='right'>주문번호 : {this.state.orderInfo.orderNo}</h6>
                        </Col>
                    </Row>
                    <Row>
                        <Col  style={{padding:0, margin:0}}>
                            <div className={Style.wrap}>
                                <section className={Style.sectionDate}>
                                    <div>{ComUtil.utcToString(order.orderDate)}</div>
                                    {
                                        order.consumerOkDate != null ?
                                            <div>구매확정</div>
                                            :
                                            <div>
                                                {
                                                    order.deliveryFinishDate != null ?
                                                        <div>배송완료</div>
                                                        :
                                                        <div>
                                                            {
                                                                order.deliveryDate != null ?
                                                                    <div>배송중</div> : <div>상품준비중</div>
                                                            }
                                                        </div>
                                                }
                                            </div>
                                    }
                                </section>
                                <section className={Style.sectionContent}>
                                    <div className={Style.img}>
                                        <img className={Style.goodsImg} src={Server.getThumbnailURL()+order.orderImg} />
                                    </div>
                                    <div className={Style.content}>
                                        <div>{order.goodsNm} {order.packAmount}{order.packUnit}</div>
                                        <div><span className={'text-danger'}>{ComUtil.addCommas(order.orderPrice)}</span>원 (<span className={'text-danger'}>
                                                    {ComUtil.addCommas(order.orderPrice/blct)}</span>α-BLCT)</div>
                                        <div>수량 : {order.orderCnt}개</div>
                                    </div>
                                </section>
                            </div>
                        </Col>
                    </Row>

                    <Row style={{marginTop:'1em'}}>
                        <Col xs={6}>
                            <Button block outline color="secondary" onClick={this.toggle}>배송조회</Button>{' '}
                        </Col>
                        <Col xs={6}>
                            <ModalConfirm title={'구매확정'} content={'구매확정 하시겠습니까? 구매확정 후 교환 및 반품이 불가합니다.'} onClick={this.onConfirmed}>
                                <Button disabled={order.consumerOkDate == null? false: true} block outline color="secondary" hidden={this.state.confirmHidden?'true':''}>구매확정</Button>
                            </ModalConfirm>
                        </Col>
                    </Row>

                    <Row>
                        <Col style={{padding:0, margin:0}}><hr className = {Style.hrBold}/></Col>
                    </Row>
                    <Row>
                        <Col> <h6> 배송지 정보 </h6></Col>
                    </Row>
                    <Row>
                        <Col xs="3">
                            <small>
                                받는 사람<br/>
                                연락처<br/>
                                주소<br/>
                            </small>
                        </Col>
                        <Col xs={'9'}>
                            <small>
                                {order.receiverName} <br/>
                                {order.receiverPhone}<br />
                                {order.receiverAddr}<br/>
                            </small>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{padding:0, margin:0}}><hr className = {Style.hrBold}/></Col>
                    </Row>
                    <Row>
                        <Col> <h6> 예상출하기간 </h6></Col>
                        <Col className={'text-right'}>
                            <small>
                                {ComUtil.utcToString(order.expectShippingStart)} ~ {ComUtil.utcToString(order.expectShippingEnd)}
                            </small>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{padding:0, margin:0}}><hr className = {Style.hrBold}/></Col>
                    </Row>

                    <Row>
                        <Col> <h6>결제금액</h6></Col>
                    </Row>
                    <Row>
                        <Col xs="4">
                            <small>
                                출하 후 상품금액<br/>
                                배송비<br/>
                                예약 할인금액<br/>
                            </small>
                        </Col>
                        <Col xs="8" className={'text-right'}>
                            <small>
                                {ComUtil.addCommas(goods.shipPrice)} 원<br/>
                                {ComUtil.addCommas(order.deliveryFee)} 원<br />
                                <span className={'text-danger'}>- {ComUtil.addCommas(goods.shipPrice-order.orderPrice)}</span>원<br/>
                            </small>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{padding:0, margin:0}}><hr/></Col>
                    </Row>
                    <Row>
                        <Col xs="8"><h6>총 결제금액</h6></Col>
                        <Col xs="4" className={classnames('text-right', 'text-danger')}>{ComUtil.addCommas(order.orderPrice+order.deliveryFee)} 원</Col>
                    </Row>
                    <Row>
                        <Col className={classnames('text-right', Style.totalPrice)}>({ComUtil.addCommas(order.orderPrice/blct)} α-BLCT)</Col>
                    </Row>

                    <ModalWithNav show={this.state.isOpen} title={'배송조회'} onClose={this.onClose} onLoad={this.callback}>
                        <DeliveryTracking transportCompanyCd={order.transportCompanyCode} trackingNumber={order.trackingNumber}/>
                    </ModalWithNav>
                </Container>

            </Fragment>

        )
    }
}