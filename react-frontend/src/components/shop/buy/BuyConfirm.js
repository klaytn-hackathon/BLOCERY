import React, {Fragment, Component } from 'react'
import { Container, InputGroup, InputGroupAddon, InputGroupText, Input, Form, Row, Col, FormGroup, Label, Button, Table } from 'reactstrap';
import { Link } from 'react-router-dom'
import { getGoodsByGoodsNo } from '../../../lib/goodsApi'
import { Server } from '../../Properties'
import ComUtil from '../../../util/ComUtil'
import { getLoginUser } from '../../../lib/loginApi'
import { getOrderByOrderNo } from '../../../lib/shopApi'
import { Webview } from '../../../lib/webviewApi'
import { BLCT_TO_WON, exchangeWon2BLCTComma } from "../../../lib/exchangeApi"
import Style from './Style.module.scss'
import { ShopXButtonNav } from '../../common'

import { ToastContainer, toast } from 'react-toastify'     //토스트
import 'react-toastify/dist/ReactToastify.css'

export default class BuyConfirm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            goods: {},
            images: null,
            consumer: {},
            order : {}
        }
    }

    //화면이 그려지기 전에 로그인체크 해봄.
    async componentWillMount() {

        //로그인 체크
        const consumer = await getLoginUser();
        if (!consumer) { //미 로그인 시 로그인 창으로 이동.
            this.props.history.push('/login');
        }

        //파라미터로 주문정보 가져오기
        const params = new URLSearchParams(this.props.location.search)
        const orderNo = params.get('orderNo')

        const { data:order } = await getOrderByOrderNo(orderNo);
        const { data:goods } = await getGoodsByGoodsNo(order.goodsNo);
        //console.log({orderNo: orderNo, order:order, goods:goods});

        this.setState({
            goods: goods,
            images: goods.goodsImages,
            consumer: consumer,
            order: order
        })
    }

    //react-toastify  usage: this.notify('메세지', toast.success/warn/error);
    notify = (msg, toastFunc) => {
        toastFunc(msg, {
            position: toast.POSITION.TOP_RIGHT
            //className: ''     //클래스를 넣어도 됩니다
        })
    }

    componentDidMount() {
        window.scrollTo(0,0)
        this.notify('블록체인에 기록 중입니다.', toast.warn);
    }

    //array의 첫번째 이미지 썸네일 url 리턴
    getFirstImageUrl = (goodsImages) => {
        if (!goodsImages)
            return '';

        const image = goodsImages.filter((v, idx) => { return idx === 0;}) //첫번째 이미지
        if (image.length === 1) {
            return Server.getThumbnailURL() + image[0].imageUrl;
        }
        return '';
    }


    onConfirmClick = () => {
        Webview.closePopupAndMovePage('/mypage')
    }

    onContinueClick = () => {
        // this.props.history.push('/main/recommend');
        Webview.closePopupAndMovePage('/main/recommend')
    }

    render() {
        return(
            <Fragment>
                <ShopXButtonNav home> 구매완료 </ShopXButtonNav>
                <Container>
                    <br/> {/* 구매완료 <h5 className={'text-center'}> 구매완료 </h5>*/}

                    {/* 상품 정보 */}
                    <hr className = {Style.hrBold}/>
                    <Row>
                        <Col xs={'12'} className={Style.textCenter}> 상품 구매가 <span className={Style.textInfoC}>정상적으로 완료</span> 되었습니다.<br/>감사합니다. </Col>
                    </Row>
                    <hr className = {Style.hrBold}/>
                    <Row>
                        <Col xs={'1'}/>
                        <Col xs={'3'} className={Style.textSmallL}> 주문번호 </Col>
                        <Col xs={'7'} className={Style.textBoldS}> {this.state.order.orderNo} </Col>
                    </Row>
                    <hr/>

                    {/* 상품정보 */}
                    <Row>
                        <Col xs={'1'}/>
                        <Col className={Style.textSmallL}> 상품정보 </Col>
                    </Row>
                    <Row>
                        <Col xs={'1'}/>
                        <Col xs={'10'}>
                            <Table bordered>
                                <tr>
                                    <td> <img className={Style.img} src={this.getFirstImageUrl(this.state.images)} /> </td>
                                    <td>
                                        <small>{this.state.goods.itemNm} </small><br/>
                                        {this.state.goods.goodsNm} {this.state.goods.packAmount + ' ' + this.state.goods.packUnit}<br/>

                                        <small>
                                         수량 : {this.state.order.orderCnt} 개 <br/>
                                         배송예정: {ComUtil.utcToString(this.state.goods.expectedShippingStart)} ~&nbsp;
                                         {ComUtil.utcToString(this.state.goods.expectedShippingStart)}
                                        </small>
                                    </td>
                                </tr>
                            </Table>
                        </Col>
                    </Row>



                    {/* 총 결제금액 */}
                    <hr className = {Style.hrBold}/>
                    <Row>
                        <Col xs={'1'}/>
                        <Col xs={'4'}> 최종 결제금액</Col>
                        <Col xs={'4'} className={Style.textNotiL}> {exchangeWon2BLCTComma(this.state.order.orderPrice)} α-BLCT</Col>
                    </Row>

                    <br/>
                    <Row>
                        <Col xs={'1'}/>
                        <Col xs={'10'}>
                            <Table bordered>
                                <tr>
                                    <td>
                                        <Container>
                                            <Row>
                                                <Col xs={'6'} className={Style.textSmall}>
                                                    출하 후 상품금액<br/>
                                                    배송비<br/>
                                                    예약할인금액
                                                </Col>
                                                <Col xs={'6'} className={Style.textSmallR}>
                                                    {ComUtil.addCommas(this.state.goods.shipPrice * this.state.order.orderCnt)} 원 <br/>
                                                    {ComUtil.addCommas(this.state.order.deliveryFee)} 원 <br/>
                                                    <span className={Style.textNotiRs}>
                                                    {ComUtil.addCommas(this.state.order.orderPrice - this.state.goods.shipPrice * this.state.order.orderCnt)} 원
                                                    </span>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Container>
                                            <Row>
                                                <Col xs={'6'} className={Style.textSmall}> 총 결제금액 </Col>
                                                <Col xs={'6'} className={Style.textSmallR}>
                                                    {ComUtil.addCommas(this.state.order.orderPrice)} 원 <br/>
                                                    1 α-BLCT = { BLCT_TO_WON } 원
                                                </Col>
                                            </Row>
                                        </Container>
                                    </td>
                                </tr>
                            </Table>
                        </Col>
                    </Row>

                    <br/>
                    <Row>
                        <Col xs={'1'}/>
                        <Col xs={'5'}>
                            <Button color='dark' block onClick={this.onConfirmClick}> 구매내역 확인 </Button>
                        </Col>
                        <Col xs={'5'}>
                            <Button color='dark' block onClick={this.onContinueClick}> 계속 쇼핑하기 </Button>
                        </Col>

                    </Row>
                </Container>

                <ToastContainer/>
            </Fragment>
        )
    }
}




