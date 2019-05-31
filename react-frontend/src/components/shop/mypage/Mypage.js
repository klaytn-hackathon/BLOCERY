import React, { Component, Fragment } from 'react';
import { Container, Row, Col, Button, Card, CardBody, CardTitle, CardSubtitle, CardText, CardFooter} from 'reactstrap'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { OrderList } from '../../common/orderList'
import { Header } from '../Header/index'
import { getConsumer } from '../../../lib/shopApi'
import { getProducer } from '../../../lib/producerApi'
import { doLogout, getLoginUserType } from '../../../lib/loginApi'
import { getBalanceOf } from "../../../lib/smartcontractApi";
import { BLCT_TO_WON } from "../../../lib/exchangeApi"
import { ModalConfirm } from "../../common"

import TokenGethSC from '../../../contracts/TokenGethSC'
import ComUtil from '../../../util/ComUtil'

import Style from '../../../styles/Text.module.scss'
import classNames from 'classnames' //여러개의 css 를 bind 하여 사용할 수 있게함

import { ToastContainer, toast } from 'react-toastify'                              //토스트
import 'react-toastify/dist/ReactToastify.css'
import { Webview } from '../../../lib/webviewApi'

export default class Mypage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tokenBalance: '...',
            loginUser:'',
            copied: false,
            orderList: []
        }
    }

    async componentWillMount() {

        //this.refreshCallback(); //로그인 정보 가져오기
        this.initContract();
    }

    // 화면 로딩시 로그인한 consumer정보 호출
    async componentDidMount() {
        await this.refreshCallback(); //로그인 정보 가져오기

        if (this.state.loginUser && this.state.loginUser.account) {
            let balance = await getBalanceOf(this.tokenGethSC, this.state.loginUser.account)
            this.setState({
                tokenBalance: balance
            })
        }
    }

    // 보유토큰 잔액조회
    initContract = async() => {
        this.tokenGethSC = new TokenGethSC();
        await this.tokenGethSC.initContract('/BloceryTokenSC.json');
    };

    //react-toastify usage: this.notify('메세지', toast.success/warn/error);
    notify = (msg, toastFunc) => {
        toastFunc(msg, {
            position: toast.POSITION.TOP_CENTER
        })
    }

    refreshCallback = async () => {
        const loginUserType = await getLoginUserType();
        let loginUser; // = await getConsumer();

        if(loginUserType.data == 'consumer') {
            console.log('loginUserType', loginUserType.data)
            loginUser = await getConsumer();
        } else if (loginUserType.data == 'producer') {
            console.log('loginUserType', loginUserType.data)
            loginUser = await getProducer();
        }

        this.setState({
            loginUser: (loginUser) ? loginUser.data : '',
            loginUserType: loginUserType.data
        })
    }

    onClickLogin = () => {
        Webview.openPopup('/login');//, this.refreshCallback); //로그인을 팝업으로 변경.
    }

    onClickLogout = async (isConfirmed) => {
        isConfirmed && await doLogout();
        // if (isConfirmed) {
        //     this.setState({
        //         loginUser: ''
        //     })
        // }
        //자기 페이지 강제 새로고침()
        window.location = this.props.history.location.pathname
    }

    onCopy = () => {
        this.setState({copied: true})
        this.notify('클립보드에 복사되었습니다', toast.success);
    }

    // 토큰 상세이력 조회
    getWalletDetail = () => {
        Webview.openPopup(`/tokenHistory?account=${this.state.loginUser.account}`)
    }

    render() {
        const account = ''+this.state.loginUser.account
        const accountHead = account.substr(0,7)
        const accountTail = account.substring(account.length-7,account.length)
        const blct = {BLCT_TO_WON}.BLCT_TO_WON
        return (
            <Fragment>
                <Header />
                <Container fluid>
                    <br />
                    {
                        this.state.loginUser == '' || this.state.loginUser == null ?
                            <Fragment>
                                <Row>
                                    <Col xs="9">
                                        <h6 className='text-secondary'>로그인이 필요한 화면입니다.</h6>
                                    </Col>
                                    <Col xs="3">
                                        <Button color="secondary" size="sm" className="float-right" onClick={this.onClickLogin}>로그인</Button>
                                    </Col>
                                </Row>
                            </Fragment>
                        :
                            <Fragment>
                                <Row>
                                    <Col xs="9">
                                        {
                                            this.state.loginUserType == 'producer' ? <h6 className={Style.textBoldLarge}>{this.state.loginUser.farmName}</h6>
                                                :
                                                <h6 className={Style.textBoldLarge}>{this.state.loginUser.name}님</h6>
                                        }
                                        <h6 className={Style.textMedium}>{this.state.loginUser.email}</h6>
                                    </Col>
                                    <Col xs="3">
                                        <ModalConfirm title={'로그아웃'} content={'로그아웃 하시겠습니까?'} onClick={this.onClickLogout}>
                                            <Button color="secondary" size="sm" className='float-right' style={{marginTop:18, width:'7em'}}>로그아웃</Button>
                                        </ModalConfirm>
                                    </Col>
                                </Row>
                                <p></p>
                                <Row>
                                    <Col>
                                    <Card>
                                        <CardBody>
                                            <CardTitle>Wallet</CardTitle>
                                            <CardSubtitle align={'center'}>
                                                <span className={classNames('text-danger', Style.textBoldLarge)}>{ComUtil.addCommas(this.state.tokenBalance)}</span> α-BLCT
                                                / <span className={Style.textSmall}>
                                                    { (this.state.tokenBalance === '...')? '...' : ComUtil.addCommas(this.state.tokenBalance*blct) }원
                                                  </span>
                                            </CardSubtitle>
                                            <CardText className={Style.textSmallR}>1 α-BLCT = {ComUtil.addCommas(blct)}원</CardText>
                                            Public 계정<span className={Style.textSmall}>(/ropsten.etherscan.io)</span>
                                            <CopyToClipboard text={this.state.loginUser.account} onCopy={this.onCopy}>
                                                <Button outline block size={'md'}>{accountHead} ... {accountTail}</Button>
                                            </CopyToClipboard>
                                        </CardBody>
                                        {/*<CardFooter onClick={this.getWalletDetail}> > 토큰상세내역 </CardFooter>*/}
                                    </Card>
                                    </Col>
                                </Row>
                            </Fragment>
                    }
                    <br />
                    {
                        (this.state.loginUser && this.state.loginUser.consumerNo) ? <OrderList consumerNo={this.state.loginUser.consumerNo} history={this.props.history} /> : '  '
                    }
                </Container>
                <ToastContainer/>
            </Fragment>
        )
    }
}