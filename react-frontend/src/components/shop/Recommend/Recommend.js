import React, { Component, Fragment } from 'react';
// import './Card.scss'

import { Container, Row, Col, Alert } from 'reactstrap'
import { Link } from 'react-router-dom'
import event from '../../../images/event.png'
import event2 from '../../../images/event2.png'
import farmDiary from '../../../images/mainFarmers.jpeg'
import VirtualList from 'react-tiny-virtual-list';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCarrot, faAppleAlt, faCartPlus, faCartArrowDown, faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons'
import { MdCategory } from '../MdCategory'

import { MainGoodsCarousel, BlocerySpinner, RectangleNotice, ModalConfirm, ModalPopup} from '../../common'
import { getGoodsByConfirm, getGoods } from '../../../lib/goodsApi'
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import { Info, NotificationsActive } from '@material-ui/icons'

import { Webview } from '../../../lib/webviewApi'

import { getLoginUserType } from '../../../lib/loginApi'

import { Const } from '../../../components/Properties'
import ComUtil from '../../../util/ComUtil'
import EventPopup from './EventPopup'
import ReactSwipe from 'react-swipe';
let reactSwipeEl;
const style = {
    image: {
        width: '100%',
        height: '170px'
    },
    noPadding: { paddingLeft: 0, paddingRight: 0 }
}



const sectionStyle = {
    width: "100%",
    height: "400px",
    backgroundImage: `url(${farmDiary})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    paddingLeft: '20px',
    paddingTop: '320px'

}

export default class Recommend extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            goods: null,
            userType: ''
        }
    }

    componentDidMount(){
        this.loginCheck()
        this.search()
        window.scrollTo(0,0)
    }
    search = async () => {
        this.setState({loading: true})
        const sorter = [
            {direction: 'ASC', property: 'saleEnd'},            //판매종료일 임박
            {direction: 'DESC', property: 'discountRate'},      //할인율 큰것
            {direction: 'ASC', property: 'reservationPrice'}    //판매가격 낮은것
        ]

        const response = await getGoodsByConfirm(true, sorter)
        this.setState({
            loading: false,
            goods: response.data
        })
    }
    //[onClick] MD 카테고리 클릭
    onMdCategoryClicked = (props) =>{
        console.log(props)
    }

    movePage = (goods) => {

        console.log(goods)

        const pathName = this.props.history.location.pathname
        console.log('pathname:', pathName)
        // this.props.history.push(`${pathName}?goodsNo=3`)
        this.props.history.push(`/goods?goodsNo=${goods.goodsNo}`)
    }

    openLoginPopup = (isConfirmed) => {
        isConfirmed && Webview.openPopup(`/login`);// , this.loginCheck)
    }
    //로그인 여부 조회
    loginCheck = async () => {
        let {data:userType} = await getLoginUserType();
        this.setState({
            userType: userType
        })

    }

    checkLocalStorage =()=>{

    }
    render(){
        // localStorage.removeItem('eventNewPopup')
        console.log('eventNewPopup:',localStorage.getItem('eventNewPopup'))
        return(
            <Fragment>
                {
                    this.state.loading && <BlocerySpinner/>
                }
                <br/>
            <Container fluid>

                <Row>
                    <Col>
                        {/*<h6>오늘의 추천 상품</h6>*/}
                        <h6 className={'text-secondary'}>오늘의 추천 상품</h6>
                    </Col>
                </Row>
                <Row>
                    <Col style={style.noPadding}>
                        {
                            this.state.goods && <MainGoodsCarousel
                                                    data={this.state.goods}
                                                    onClick={this.movePage}
                                                />
                        }
                    </Col>
                </Row>
                <Row>
                    <Col style={style.noPadding}>
                        {
                            this.state.userType === '' && (
                                <ModalConfirm onClick={this.openLoginPopup} title={'α-BLCT 지급 이벤트'} content={<div>회원가입 후 자동 지급됩니다.<br/>회원가입 페이지로 이동 하시겠습니까?</div>}>
                                    <RectangleNotice>
                                        지금 <a className="alert-link">회원가입</a> 하면 <a className="alert-link">{ComUtil.addCommas(Const.INITIAL_TOKEN)}</a> α-BLCT토큰 자동 지급!
                                    </RectangleNotice>
                                </ModalConfirm>
                            )
                        }

                    </Col>
                </Row>

                {/*<h6 className={'text-secondary'}>오늘의 추천상품</h6>*/}
                {/*<Row>*/}
                    {/*<Col style={style.noPadding}>*/}
                        {/*<img src={event} style={style.image} onClick={this.movePage} />*/}
                    {/*</Col>*/}
                {/*</Row>*/}
                {/*<h6 className={'text-secondary'}>농부가 정성으로 재배중인 프리미엄 농산물</h6>*/}
                {/*<MdCategory onClick={this.onMdCategoryClicked} />*/}

                {/*<br/>*/}
                {/*<h6 className={'text-secondary'}>오늘의 파격할인 예약상품</h6>*/}
                {/*<Row>*/}
                    {/*<Col>*/}
                        {/*<Row>*/}
                            {/*<Col style={style.noPadding}><img src={event2} style={style.image} /></Col>*/}
                        {/*</Row>*/}
                        {/*<p></p>*/}
                        {/*<Row>*/}
                            {/*<Col><h6>합천 프리미엄 고구마 2kg</h6></Col>*/}
                            {/*<Col className={'text-right'}><FontAwesomeIcon icon={faCartPlus} color={'#1697ae'} size={'lg'}/></Col>*/}
                        {/*</Row>*/}
                        {/*<Row>*/}
                            {/*<Col><h4><i className={'text-info'}>50%</i> 6,000원</h4></Col>*/}
                            {/*<Col className={'text-right text-danger'}>*/}
                                {/*<FontAwesomeIcon icon={faStar} color={'#1697ae'} size={'lg'}/>*/}
                                {/*<FontAwesomeIcon icon={faStar} color={'#1697ae'} size={'lg'}/>*/}
                                {/*<FontAwesomeIcon icon={faStar} color={'#1697ae'} size={'lg'}/>*/}
                                {/*<FontAwesomeIcon icon={faStar} color={'#1697ae'} size={'lg'}/>*/}
                                {/*<FontAwesomeIcon icon={faStar} color={'#88c4d8'} size={'lg'}/>*/}
                            {/*</Col>*/}
                        {/*</Row>*/}
                        {/*<Row>*/}
                            {/*<Col>*/}
                                {/*<h6>예약특가 남은시간 38:30</h6>*/}
                            {/*</Col>*/}
                            {/*<Col className={'text-right'}>3/2(토) 이후 배송시작</Col>*/}
                        {/*</Row>*/}

                    {/*</Col>*/}
                {/*</Row>*/}

                {/* ========= 생산일지 Start ========= */}
                {/*<br/>*/}
                <Row>
                    <Col className={'text-secondary'}>
                        <h6 className={'text-secondary'}>이번주 재배일지</h6>
                    </Col>
                </Row>
                <Row>
                    <Col style={style.noPadding} className={'text-white'}>
                        <div style={sectionStyle} onClick={()=>{this.movePage({goodsNo:1})}} >
                            <div style={{opacity: 1}}>
                                <h3 style={{textShadow: '2px 2px 4px #000000'}}>
                                    무농약 프리미엄 쌈채소 재배 중!!
                                </h3>
                                <h6 style={{textShadow: '2px 2px 4px #000000'}}>#쌈채소 #무농약 #프리미엄 #팜토리 #farmtory</h6>
                            </div>
                        </div>
                        {/*<img src={farmDiary} style={{width:'100%'}} />*/}
                    </Col>
                </Row>
                <Row>
                    <Col>

                    </Col>
                </Row>
                {/* ========= 생산일지 End ========= */}
            </Container>
                {
                    !localStorage.getItem('eventNewPopup') && (
                        <ModalPopup
                            title={
                                <Fragment>
                                    <div style={{display:'flex', alignItems:'center'}}>
                                        <NotificationsActive/>{' '}
                                        <div>Blocery 상품구매 이벤트 참여방법</div>
                                    </div>
                                </Fragment>
                            }
                            content={
                            <EventPopup/>
                            }
                        >
                        </ModalPopup>
                    )
                }

            </Fragment>
        )
    }
}
