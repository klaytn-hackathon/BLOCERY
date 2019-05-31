import TokenGethSC from '../../../contracts/TokenGethSC';
import React, {Fragment, Component } from 'react'
import { Container, Modal, ModalHeader, ModalBody, ModalFooter, Input, Row, Col, Button, Table } from 'reactstrap';
import { Link } from 'react-router-dom'
import { getGoods, getGoodsByGoodsNo, updateGoodsRemained } from '../../../lib/goodsApi'
import { Server, Const } from '../../Properties'
import ComUtil from '../../../util/ComUtil'
import {checkPassPhrase, getLoginUser} from '../../../lib/loginApi'
import { getConsumer } from '../../../lib/shopApi'
import { addOrder } from '../../../lib/shopApi'
import { Webview } from '../../../lib/webviewApi'
import { BLCT_TO_WON, exchangeWon2BLCTComma } from "../../../lib/exchangeApi"
import Style from './Style.module.scss'
import { ShopXButtonNav, ModalWithNav } from '../../common'

import { getBalanceOf, orderGoods, getUserEther } from '../../../lib/smartcontractApi'
import { getProducerByProducerNo } from '../../../lib/producerApi';
import { exchangeWon2BLCT } from '../../../lib/exchangeApi';

import { ToastContainer, toast } from 'react-toastify'                              //토스트
import 'react-toastify/dist/ReactToastify.css'

import InputAddress from '../../../components/shop/buy/InputAddress'

export default class Buy extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modal:false,  //모달 여부
            modalType: '',  //모달 종류
            goods: {},
            images: null,
            loginUser: {},
            tokenBalance: 0,
            order : {  //주문관련 정보 저장
                consumerNo: 0,
                deliveryFee: 0,
                orderPrice: 0,    //최종 가격
                orderCnt: 1,
                deposit:0,
                orderDate:null,
                deliveryMsg: '',

                //Goods에서 copy항목
                goodsNm:null,
                itemNm:null,
                expectShippingStart:null,
                expectShippingEnd:null,
                packUnit:null,
                packAmount:0,
                packCnt:0,

                //Consumer에서 copy
                receiverName: '',
                receiverPhone: '',
                receiverAddr: '',
                receiverAddrDetail: '',
                zipNo: ''
            },
            msgHidden: true,
            directMsg: ''
        }
    }

    componentDidMount() {
        console.log(this.props.location)
        // this.setState({
        //     order:{receiverName: this.props.location.state}
        // })
    }

    //화면이 그려지기 전에 로그인체크 해봄.
    async componentWillMount() {

        //로그인 체크
        const loginUser = await getLoginUser();

        //상품상세에서 구매버튼 클릭시체크하도록 변경
        // if (!loginUser) { //미 로그인 시 로그인 창으로 이동.
        //     this.props.history.push('/login');
        // }
        console.log({loginUser:loginUser})

        // 로그인한 사용자의 consumer 정보
        // loginUser.email로 consumer document 조회
        const loginUserInfo = await getConsumer();

        //파라미터로 상품정보 가져오기
        const params = new URLSearchParams(this.props.location.search)
        const goodsNo = params.get('goodsNo')

        const { data:goods } = await getGoodsByGoodsNo(goodsNo);

        console.log({loginUserInfo:loginUserInfo});

        /**알파서비스 전용, 알파 상품에 대해 3단계 가격정책 적용.*/
        if (Const.IS_ALPHA_SERVICE) {
            goods.reservationPrice = ComUtil.price3StepCurrent(goods);
        }


        //order 가격 등 계산
        let order = Object.assign({}, this.state.order);
        order.orderPrice = goods.reservationPrice - this.state.order.deliveryFee;
        //배송지정보 수정
        order.consumerNo = loginUserInfo.data.consumerNo;
        order.receiverName = loginUserInfo.data.name;
        order.receiverPhone = loginUserInfo.data.phone;
        order.receiverAddr = loginUserInfo.data.addr;
        order.receiverAddrDetail = loginUserInfo.data.addrDetail;
        order.zipNo = loginUserInfo.data.zipNo;

        this.setState({
            goods: goods,
            images: goods.goodsImages,
            loginUser: loginUserInfo.data,
            order: order
        })

        this.initContract();
    }

    initContract = async() => {
        this.tokenGethSC = new TokenGethSC();
        await this.tokenGethSC.initContract('/BloceryTokenSC.json');

        let balance = await getBalanceOf(this.tokenGethSC, this.state.loginUser.account)
        this.setState({
            tokenBalance: balance
        })
    };

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

    //구매 수량 변경.
    onCountChange = (e) => {

        let order = Object.assign({}, this.state.order);
        order.orderCnt = e.target.value;
        order.orderPrice = this.state.goods.reservationPrice * order.orderCnt;

        this.setState({
            order:order
        })
    }

    //배송 메세지 변경
    onMsgChange = (e) => {
        let order = Object.assign({}, this.state.order);

        if (e.target.value == 'direct') {
            this.setState({ msgHidden: false })
        } else {
            this.setState({ msgHidden: true })
            order.deliveryMsg = e.target.selectedOptions[0].label;
        }
        this.setState({
            order:order
        })
    }

    //베송 메시지 직접 입력시
    directChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
        let order = Object.assign({}, this.state.order);
        order.deliveryMsg = e.target.value

        this.setState({
            order:order
        })
    }

    // 필수정보 validation check
    checkValidation = () => {
        const order = Object.assign({}, this.state.order)
        const addr = order.receiverAddr || ''
        const phone = order.receiverPhone || ''
        order.reciverAddr = addr;
        order.reciverPhone = phone;

        this.setState({
            order: order
        })

        if (order.reciverAddr == '' || order.receiverName == '' || order.receiverAddr == '') {
            alert('배송지 정보를 정확하게 입력해주세요.')
            return false;
        }
        return true;
    }

    //react-toastify  usage: this.notify('메세지', toast.success/warn/error);
    notify = (msg, toastFunc) => {
        toastFunc(msg, {
            position: toast.POSITION.TOP_RIGHT
            //className: ''     //클래스를 넣어도 됩니다
        })
    }

    //주문수량 goods잔여 물량등 check
    orderValidate = (order, goods) => {
        if (goods.remainedCnt < order.orderCnt) {
            this.notify('남은 상품수량이 부족합니다. 재고:'+goods.remainedCnt+' 주문:' + order.orderCnt, toast.warn);
            return false;
        }

        if (goods.expectShippingEnd < order.orderDate) {
            this.notify('주문가능한 날짜가 지났습니다', toast.warn);
            return false;
        }

        return true;
    }

    onBuyClick = async () => {

        //order정보 생성.
        let order = Object.assign({}, this.state.order);

        // mongoDB 저장 전에 소비자 토큰잔액 체크
        let balance = await getBalanceOf(this.tokenGethSC, this.state.loginUser.account);
        let priceToken = exchangeWon2BLCT(this.state.order.orderPrice);

        if(balance < priceToken) {
            // TODO 토큰 구매페이지 이동 필요
            alert('토큰이 부족합니다. 토큰추가구매는 베타버전에서 제공예정입니다.');
            return;
        }

        //goods에서 필요한 attr copy
        ComUtil.objectAttrCopy(order, this.state.goods); //동일한 attribute Copy: goodsNm, expect.. packUnit packAmount packCnt

        //order.consumerNo = this.state.loginUser.uniqueNo;
        order.producerNo = this.state.goods.producerNo;
        order.goodsNo = this.state.goods.goodsNo;
        order.orderImg = this.state.goods.goodsImages[0].imageUrl;

        //TODO 위약금 계산로직 개선필요 - 현재는 그냥 비례식
        order.deposit = this.state.order.orderPrice * 0.2;

        //수수료: 현재는 5%일괄 저장
        order.fee = this.state.order.orderPrice * 0.05;

        order.orderDate = ComUtil.getNow();

        if (!this.checkValidation()) {
           return; //배송지 미입력시 중단.
        }

        //남은위약금, 남은수량 세팅
        let goods = Object.assign({}, this.state.goods);
        console.log({goods:goods, order:order });

        goods.remainedCnt = goods.remainedCnt - 1;
        goods.remainedDeposit = goods.remainedDeposit - order.deposit;
        console.log('goods.remainedDeposit;'+ goods.remainedDeposit);

        if (!this.orderValidate(order, goods)) return; //주문 이상없는지 check
        //let passPhrase = prompt('결제비번 6자리숫자를 입력해 주세요.', '숫자 6자리');

        //임시저장
        this.setState({
            goods: goods, //임시저장
            order: order, //임시저장
            modal:true, //결제비번창 오픈.
            modalType: 'pay'
        });


        /* 결재처리 : modalToggleOk로 소스 이동
        */
    }

    modalToggleOk = async () => {

        let goods = Object.assign({}, this.state.goods);
        let order = Object.assign({}, this.state.order);

        //결제 처리
        console.log("modalOK:" + this.state.passPhrase);

        let {data:checkResult} = await checkPassPhrase(this.state.passPhrase);
        console.log('checkResult:' + checkResult);
        if (!checkResult) {
            this.notify('결제 비번이 틀렸습니다.', toast.error);
            return; //결제 비번 오류, stop&stay
        }

        await updateGoodsRemained(goods);
        const {data:orderNo} = await addOrder(order);

        console.log(order)

        if (orderNo) { //구매 성공시 confirm으로 이동.

            this.setState({
                goods: goods,
                order: order,
                modal: false
            });

            // 소비자 토큰 지급
            this.payOrderToken(orderNo);
            this.props.history.push('/buyConfirm?orderNo='+ orderNo);
        }
    }

    modalToggle = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    passPhraseInput = (e) => {
        this.setState({
            passPhrase:e.target.value
        })
    }

    // 배송지 정보 수정 버튼 클릭
    updateAddressClick = () => {

        this.setState({
            modalType: 'delivery'
        })

        this.modalToggle()


        return
        // 가입후 첫구매일 경우 ether check해서 ether 지급

        //05.02 Gary: 이벤트용으로 Join에서 지급하도록 변경.
        //getUserEther(this.tokenGethSC);

        const order = Object.assign({}, this.state.order)
        const addr = order.receiverAddr || ''
        const phone = order.receiverPhone || ''
        order.receiverAddr = addr;
        order.receiverPhone = phone;

        this.setState({
            order: order
        })
        // 배송지 정보 수정 화면으로 consumerNo, addr, phone, name을 param으로 넘김
        Webview.openPopup(`/inputAddress?consumerNo=${order.consumerNo}&receiverAddr=${order.receiverAddr}&receiverPhone=${order.receiverPhone}&receiverName=${order.receiverName}`);//, this.callback)
    }

    // 배송지 정보 수정 화면에서 수정된 내용 callback으로 받아옴
    callback = (data) => {

        if(data){
            const order = Object.assign({}, this.state.order);
            order.receiverName = data.receiverName;
            order.receiverPhone = data.phone;
            order.receiverAddr = data.addr;
            order.receiverAddrDetail = data.addrDetail;
            order.zipNo = data.zipNo;
            this.setState({
                order: order
            })
        }

        this.modalToggle()
    }

    payOrderToken = async(orderNo) => {

        let producer = await getProducerByProducerNo(this.state.goods.producerNo);
        console.log('producer : ', producer);

        console.log('fee???? ', this.state.order.fee);
        let account = producer.data.account;
        let tokenPrice = exchangeWon2BLCT(this.state.order.orderPrice);
        let tokenDeposit = exchangeWon2BLCT(this.state.order.deposit);
        let tokenFee = exchangeWon2BLCT((this.state.order.fee / 5) * 4);
        let tokenCustomerReward = exchangeWon2BLCT(this.state.order.fee / 5);

        await orderGoods(this.tokenGethSC, orderNo, account, this.state.goods.goodsNo, tokenPrice, tokenDeposit, tokenFee, tokenCustomerReward);
    };

    render() {
        return(
            <Fragment>
                <ShopXButtonNav close>구매하기</ShopXButtonNav>
                <Container>
                    {/* 상품 정보 */}
                    <br/>
                    <Row>
                        <Col xs={'12'}> 상품 정보 </Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col xs={3} style={{paddingRight: 0}}>
                            <img className={Style.img} src={this.getFirstImageUrl(this.state.images)} />
                        </Col>
                        <Col xs={9}>
                            {/*<small>{this.state.goods.itemNm} </small><br/>*/}
                            {this.state.goods.goodsNm} {this.state.goods.packAmount + ' ' + this.state.goods.packUnit}<br/>

                            <Row>
                                <Col xs={'8'}> <span className={Style.textSmall}> 구매수량 (잔여:{this.state.goods.remainedCnt})</span> :</Col>
                                <Col xs={'3'}>
                                    <Input type='select' name='select' id='buyCount' onChange={this.onCountChange} style={{width:'60px'}} >
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Input>
                                </Col>
                                <Col xs={'1'}/>
                            </Row>

                            <small>
                                배송예정일: {ComUtil.utcToString(this.state.goods.expectedShippingStart)} ~&nbsp;
                                {ComUtil.utcToString(this.state.goods.expectedShippingStart)}
                            </small>
                        </Col>
                    </Row>
                    <hr className = {Style.hrBold}/>

                    <Row>
                        <Col xs={'5'}/>
                        <Col xs={'7'} className={Style.textNotiR}>
                            <span style={{color:'black', textDecoration:'line-through', fontSize:'small'}} >
                                {ComUtil.addCommas(this.state.goods.shipPrice * this.state.order.orderCnt)}원
                            </span>&nbsp;
                            <b>{ComUtil.addCommas(this.state.order.orderPrice)}원 ({Math.floor(Math.round((this.state.goods.shipPrice-this.state.goods.reservationPrice)*100/this.state.goods.shipPrice))}%)</b>
                        </Col>
                    </Row>

                    {/* 배송지 정보 */}
                    <hr className = {Style.hrBold}/>
                    <Row>
                        <Col xs={'9'}> 배송지 정보 </Col>
                        <Col xs={'3'}>
                            <Button outline color="secondary" size="sm" className="float-right" onClick={this.updateAddressClick}>수정</Button>
                        </Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col xs={'3'}>
                            <small>
                            받는 사람<br/>
                            연락처<br/>
                            주소<br/>
                            </small>
                        </Col>
                        <Col xs={'9'} className={'text-right'}>
                            <small>
                                {this.state.order.receiverName} <br/>
                                {this.state.order.receiverPhone}<br />
                                ({this.state.order.zipNo}){this.state.order.receiverAddr}<br/> {this.state.order.receiverAddrDetail}<br/>
                            </small>
                        </Col>
                    </Row>

                    {/* 배송 메세지 */}
                    <hr className = {Style.hrBold}/>
                    <Row>
                        <Col xs={'12'}> 배송 메세지 </Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col>
                            <Input type='select' name='select' id='deliveryMsg' onChange={this.onMsgChange}>
                                <option name='radio1' value=''>베송 메세지를 선택해 주세요.</option>
                                <option name='radio2' value='radio1'>집 앞에 놔주세요.</option>
                                <option name='radio3' value='radio2'>택배함에 놔주세요.</option>
                                <option name='radio4' value='radio3'>배송 전 연락주세요.</option>
                                <option name='radio5' value='radio4'>부재 시 연락주세요.</option>
                                <option name='radio6' value='radio5'>부재 시 경비실에 맡겨주세요.</option>
                                <option name='radio7' value='direct'>직접 입력</option>
                            </Input>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Input type={this.state.msgHidden? 'hidden':'text'} name='directMsg' placeholder='베송 메세지를 입력해 주세요.' value={this.state.directMsg} onChange={this.directChange}/>
                        </Col>
                    </Row>

                    {/* 총 결제금액 */}
                    <hr className = {Style.hrBold}/>
                    <Row>
                        <Col xs={'12'}> 결제금액</Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col xs={'8'} className={Style.textSmall}> 출하 후 상품금액 </Col>
                        <Col xs={'4'} className={Style.textRs}>
                            {ComUtil.addCommas(this.state.goods.shipPrice * this.state.order.orderCnt)} 원
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={'8'}> <small> 배송비 </small></Col>
                        <Col xs={'4'} className={Style.textRs} > {this.state.goods.deliveryFee} 원 </Col>
                    </Row>

                    <Row>
                        <Col xs={'8'} className={Style.textSmall}> 예약 할인금액 </Col>
                        <Col xs={'4'} className={Style.textNotiRs}>
                            <b>{ComUtil.addCommas(this.state.order.orderPrice - this.state.goods.shipPrice * this.state.order.orderCnt)} 원</b>
                        </Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col xs={'8'}> 총 결제금액 </Col>
                        <Col xs={'4'} className={Style.textRight}>{ComUtil.addCommas(this.state.order.orderPrice)} 원</Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col xs={'8'}> 최종 결제금액(α-BLCT) </Col>
                        <Col xs={'4'} className={(Style.textNotiR)}><b>{exchangeWon2BLCTComma(this.state.order.orderPrice)} α-BLCT</b></Col>
                    </Row>
                    <Row>
                        <Col xs={'8'} className={Style.textSmall}>  1 α-BLCT = { BLCT_TO_WON } 원 </Col>
                        <Col xs={'4'} className={Style.textRs}> 보유 {this.state.tokenBalance} α-BLCT </Col>
                    </Row>

                    <br/>
                    <br/>
                </Container>

                <div className='buy'>
                    <div><Button color='warning' block onClick={this.onBuyClick}> 결 제 </Button></div>
                </div>

                <br/>
                <ToastContainer/>
                <div> {/* 결제비번 입력 모달 */}
                    {

                        <Modal isOpen={this.state.modalType === 'pay' && this.state.modal} toggle={this.toggle} className={this.props.className} centered>
                            <ModalHeader toggle={this.modalToggle}> 결제비밀번호 입력</ModalHeader>
                            <ModalBody>
                                <Input name="inputPassPhrase" type="number" placeholder="숫자 6자리" onChange={this.passPhraseInput} pattern="[0~9]*" />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={this.modalToggleOk}>확인</Button>{' '}
                                <Button color="secondary" onClick={this.modalToggle}>취소</Button>
                            </ModalFooter>
                        </Modal>

                    }

                </div>

                <ModalWithNav show={this.state.modalType === 'delivery' && this.state.modal} title={'배송지입력'} onClose={this.callback} noPadding>
                    <InputAddress
                        consumerNo={this.state.order.consumerNo}
                        receiverAddr={this.state.order.receiverAddr}
                        receiverAddrDetail={this.state.order.receiverAddrDetail}
                        receiverPhone={this.state.order.receiverPhone}
                        receiverName={this.state.order.receiverName}
                        zipNo={this.state.order.zipNo}
                    />
                </ModalWithNav>

            </Fragment>
        )
    }
}




