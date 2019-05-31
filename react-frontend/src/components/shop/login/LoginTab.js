import React, { Component, Fragment } from 'react'
import axios from 'axios'
import { Server } from '../../Properties';
import { Container, InputGroup, InputGroupAddon, InputGroupText, Input, Form, Row, Col, FormGroup, Label, Button, Fade } from 'reactstrap'
import { Link } from 'react-router-dom'
import { TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap'
import classnames from 'classnames'
import {Webview} from "../../../lib/webviewApi";
import { ShopXButtonNav, ModalAlert, ModalPopup, BloceryLogoBlack, BlocerySymbolGreen } from '../../common'
import Style from './LoginTab.module.scss'
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import { Info, NotificationsActive } from '@material-ui/icons'

//Tab제목
const TabTitle = (props) => {
    if (props.tabNumber === '1') { //소비자 Tab
        if (props.activeTab === '1') {
            return (
                <h5> <span style={{color: 'black'}}> 소비자 </span> </h5>
            );
        } else {                   //생산자 Tab
            return (
                <h5> 소비자 </h5>
            );
        }
    }
    else {
        if (props.activeTab === '2') {
            return (
                <h5> <span style={{color: 'black'}}> 생산자 </span> </h5>
            );
        } else {
            return (
                <h5> 생산자 </h5>
            );
        }
    }
}

//(소비자 or 생산자) 회원가입
const JoinTitle = (props) => {
    if (props.activeTab === '1') { //소비자 Tab
        return (
            <Button color='link' onClick={props.onClick}>
                <small> <span style={{fontWeight:'bold'}}>소비자<br/>회원가입</span> </small>
            </Button>
        );
    } else {                       //생산자 Tab
        return (
            <Button color='link' onClick={props.onClick}>
                <small> <span style={{fontWeight:'bold'}}>생산자<br/>회원가입</span> </small>
            </Button>
        );
    }
}

/**
 *  소비자 로그인 / 생산자 로그인 탭 및 화면 - 공통 사용
 */

export default class LoginTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: '1', //소비자탭='1', 생산자탭='2'
            fadeEmail: false, //email 미입력시 에러메시지 여부
            fadeEmailType: false,
            fadePassword: false,
            fadeError: false,   //email or pw 가 서버에 없을때 에러메시지 여부
            autoLogin: false,
            isOpen: false
        }
    }

    componentDidMount(){
        //this.storage.getItem('email') && this.props.history.push('/')
    }

    onLoginClicked = async (event) => {
        event.preventDefault();
        //this.storage.setItem('email', 'blocery@ezfarm.co.kr')

        //Fade All reset
        this.setState({
            fadeEmail: false, fadePassword:false, fadeEmailType:false, fadeError:false
        });

        //input ERROR check
        let data = {};
        data.email = event.target[0].value;
        data.valword = event.target[1].value;

        if (!data.email) {
            this.setState({fadeEmail: true});
            return;
        }

        const emailRule = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        if (!emailRule.test(data.email)) {
            this.setState({fadeEmailType: true});
            return;
        }

        if (!data.valword) {
            this.setState({fadePassword: true});
            return;
        }

        //login CALL
        data.userType = (this.state.activeTab === '1')? 'consumer': 'producer';

        await axios(Server.getRestAPIHost() + '/login',
            {
                method: "post",
                data:data,
                withCredentials: true,
                credentials: 'same-origin'
            })
            .then((response) => {
                console.log(response);
                if (response.data.status === Server.ERROR)             //100: login ERROR
                    this.setState({fadeError: true});
                else
                {
                    let loginInfo = response.data;

                    //쿠키(localStorage)에 login된 userType저장. - 필요하려나.
                    localStorage.setItem('userType', data.userType);
                    localStorage.setItem('account', loginInfo.account); //geth Account
                    localStorage.setItem('email', data.email);
                    localStorage.setItem('valword', data.valword);
                    localStorage.setItem('autoLogin', this.state.autoLogin);

                    console.log('loginInfo : ===========================',loginInfo);
                    //self.closePopup();
                }
            })
            .catch(function (error) {
                console.log(error);
                alert('로그인 오류:'+error);
            });

        if (!this.state.fadeError) { //로그인 성공이면
            this.closePopup();
        }
    }

    closePopup = () => { //팝업 close는 axios와 분리.
        Webview.closePopup();  //팝업만 닫음.
        //this.props.history.push('/'); //임시로 메인으로 이동
    }

    autoLoginCheck = (e) => {
        let autoLoginFlag = e.target.checked;
        console.log('autoLoginFlag:' + autoLoginFlag);

        this.setState({autoLogin:autoLoginFlag});
    }
    //아이디 찾기
    onIdSearchClick = () => {
        console.log('not implemented');
        this.setState({
            type: 'id'
        })
        this.togglePopup()
    }

    //비밀번호 찾기
    onPwSearchClick = () => {
        console.log('not implemented');
        this.setState({
            type: 'pw'
        })
        this.togglePopup()
    }

    onJoinClick = () => {
        console.log(this.state.activeTab);

        if (this.state.activeTab === '1') {//소비자탭
            //this.props.history.push('/join');
            Webview.openPopup('/join');
        }
        else {                               //생산자탭
            //this.props.history.push('/producerJoin');
            // Webview.openPopup('/producerJoin');
            this.setState({
                type: 'join'
            })
            this.togglePopup()
        }
    }

    togglePopup = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }


    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    //생산자 가입 막기 alert
    onClose = () => {
        this.setState({
            isOpen: false
        })
    }
    render(){
        return(
            <Fragment>
                <ShopXButtonNav close>로그인</ShopXButtonNav>
                <Container fluid className={Style.wrap}>
                    <p></p>
                    {/*<h3 className={'text-center'}>
                    <Link to='/'> 로그인 </Link>
                </h3>*/}

                    {/*<hr className="my-2" align={'center'}/> /!* gray line *!/*/}

                    {/*<p></p>*/}
                    {/*<p className={'text-center'}> 소비자 및 생산자 선택 후 로그인 해주시기 바랍니다 </p>*/}
                    <BloceryLogoBlack style={{textAlign:'center', width: '7em'}}/>
                    {/*<BlocerySymbolGreen/>*/}
                    <Form onSubmit={this.onLoginClicked}>
                        <Row> {/* Tab */}
                            <Col sm={"12"}>
                                <br/>
                                <Nav tabs>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: this.state.activeTab === '1' })}
                                            onClick={() => { this.toggle('1'); }}
                                        >
                                            <TabTitle tabNumber='1' activeTab={this.state.activeTab}/>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: this.state.activeTab === '2' })}
                                            onClick={() => { this.toggle('2'); }}
                                        >
                                            <TabTitle tabNumber='2' activeTab={this.state.activeTab}/>
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </Col>
                        </Row>
                        <Row> {/* blank line */}
                            <br/>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <FormGroup>
                                    <InputGroup>
                                        {/*<InputGroupAddon addonType="prepend"><Info/></InputGroupAddon>*/}
                                        <Input className={Style.textBox} placeholder="아이디(이메일)" />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col xs={12}>
                                <FormGroup>
                                    <InputGroup>
                                        {/*<InputGroupAddon addonType="prepend">비번</InputGroupAddon>*/}
                                        <Input className={Style.textBox} type="password" placeholder="비밀번호" />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}> {/* 잘못입력 및 로그인 실패시 에러 메시지 */}
                                {
                                    this.state.fadeEmail && <Fade in={true} style={{color:'gray'}}>이메일 주소를 입력해 주세요.</Fade>
                                }
                                {
                                    this.state.fadeEmailType && <Fade in={true} style={{color:'gray'}}>이메일 주소를 양식에 맞게 입력해 주세요.</Fade>
                                }
                                {
                                    this.state.fadePassword && <Fade in={true} style={{color:'gray'}}>비밀번호를 입력해 주세요.</Fade>
                                }
                                {
                                    this.state.fadeError && <Fade in={true} style={{color:'gray'}}>아이디/비밀번호를 확인해 주세요.</Fade>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Button type='submit' color={'info'} block >로그인</Button>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup check>
                                    <Input type="checkbox" name="check" id="autoLogin" onChange={this.autoLoginCheck}/>
                                    <Label for="autoLogin" check> 자동로그인 </Label>
                                </FormGroup>
                            </Col>
                        </Row>
                        <br/>
                        <hr className="my-2" align={'center'}/> {/* gray line */}
                        <br/>
                            <div className={Style.bottomContainer}>
                                <div onClick={this.onIdSearchClick}>
                                    <div>아이디</div>
                                    <div>찾기</div>
                                </div>
                                <div onClick={this.onPwSearchClick}>
                                    <div>비밀번호</div>
                                    <div>찾기</div>
                                </div>
                                <div onClick={this.onJoinClick}>
                                    <div>{this.state.activeTab === '1' ? '소비자' : '생산자'}</div>
                                    <div>회원가입</div>
                                </div>
                            </div>
                        {/*<Row>*/}
                            {/*<Col xs={4} className={'text-center'}>*/}
                                {/*<FormGroup>*/}
                                    {/*<Button color={'link'} onClick={this.onIdSearchClick}>*/}
                                        {/*<small>아이디<br/>찾기</small>*/}
                                    {/*</Button>*/}
                                {/*</FormGroup>*/}
                            {/*</Col>*/}

                            {/*<Col xs={4} className={'text-center'}>*/}
                                {/*<FormGroup>*/}
                                    {/*<Button color={'link'} onClick={this.onPwSearchClick}>*/}
                                        {/*<small>비밀번호<br/>찾기</small>*/}
                                    {/*</Button>*/}
                                {/*</FormGroup>*/}
                            {/*</Col>*/}

                            {/*<Col xs={4} className={'text-center'}>*/}
                                {/*<FormGroup>*/}
                                    {/*<JoinTitle activeTab = {this.state.activeTab} onClick={this.onJoinClick}/>*/}
                                {/*</FormGroup>*/}
                            {/*</Col>*/}

                        {/*</Row>*/}
                    </Form>
                </Container>
                {
                    this.state.isOpen && this.state.type === 'id' && <ModalPopup title={'알림'} content={'가입 시 입력하신 이름을 적어 고객센터로(info@blocery.io) 메일을 보내주시면 답신 드리도록 하겠습니다.'} onClick={this.onClose}></ModalPopup>
                }
                {
                    this.state.isOpen && this.state.type === 'pw' && <ModalPopup title={'알림'} content={'가입 시 입력하신 아이디(이메일)와 이름을 적어 고객센터로(info@blocery.io) 메일을 보내주시면 답신 드리도록 하겠습니다.'} onClick={this.onClose}></ModalPopup>
                }
                {
                    this.state.isOpen && this.state.type === 'join' && <ModalPopup title={'알림'} content={'지금은 생산자 모집 기간이 아닙니다'} onClick={this.onClose}></ModalPopup>
                }

            </Fragment>
        )
    }
}
