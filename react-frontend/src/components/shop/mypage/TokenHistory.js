import React, { Component, Fragment } from 'react';
import { Container, Row, Col, Card, CardBody, CardText, CardTitle, CardSubtitle, Button } from 'reactstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { BLCT_TO_WON } from "../../../lib/exchangeApi"
import ComUtil from '../../../util/ComUtil'
import Style from '../../../styles/Text.module.scss'
import classNames from 'classnames' //여러개의 css 를 bind 하여 사용할 수 있게함

import { ShopXButtonNav } from '../../common'
import { ToastContainer, toast } from 'react-toastify'                              //토스트
import 'react-toastify/dist/ReactToastify.css'

export default class TokenHistory extends Component {
    constructor(props){
        super(props)
        this.state = {
            tokenBalance: 0,
            account: '',
            copied: false
        }
    }

    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search)
        const account = params.get('account')

        this.setState({
            account: account
        })
    }

    onCopy = () => {
        this.setState({copied: true})
        this.notify('클립보드에 복사되었습니다', toast.success);
    }

    //react-toastify usage: this.notify('메세지', toast.success/warn/error);
    notify = (msg, toastFunc) => {
        toastFunc(msg, {
            position: toast.POSITION.TOP_CENTER
        })
    }

    render() {
        const account = this.state.account
        const accountHead = account.substr(0,7)
        const accountTail = account.substring(account.length-7,account.length)
        const blct = {BLCT_TO_WON}.BLCT_TO_WON
        return (
            <Fragment>
                <ShopXButtonNav close>Wallet</ShopXButtonNav>
                <Container fluid>
                    <br/>
                    <Fragment>
                        <Row>
                            <Col>
                                <Card>
                                    <CardBody>
                                        <CardTitle>Wallet</CardTitle>
                                        <CardSubtitle align={'center'}>
                                            <span className={classNames(Style.textNoti, Style.textBoldLarge)}>{ComUtil.addCommas(this.state.tokenBalance)}</span> α-BLCT
                                            / <span className={Style.textSmall}>{ComUtil.addCommas(this.state.tokenBalance*blct)}원</span>
                                        </CardSubtitle>
                                        <CardText className={Style.textSmallR}>1 α-BLCT = {ComUtil.addCommas(blct)}원</CardText>
                                        Public 계정<span className={Style.textSmall}>(/ropsten.etherscan.io)</span>
                                        <CopyToClipboard text={account} onCopy={this.onCopy}>
                                            <Button outline block size={'md'}>{accountHead} ... {accountTail}</Button>
                                        </CopyToClipboard>

                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Fragment>

                </Container>
                <ToastContainer/>

            </Fragment>
        )
    }


}