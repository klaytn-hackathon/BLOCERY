import React, { Component, Fragment } from 'react'
import { updOrder } from '../../../lib/producerApi'
import { getConsumerByConsumerNo, getOrderByOrderNo } from '../../../lib/shopApi'
import { getGoodsByGoodsNo } from '../../../lib/goodsApi'
import { getTransportCompanies } from '../../../lib/deliveryOpenApi'
import { Container, Row, Col, ListGroup, ListGroupItem, FormGroup, Label, Input, Alert, Button, Jumbotron } from 'reactstrap';
import Style from './Order.module.scss'
import ComUtil from '../../../util/ComUtil'

import { FooterButtons, ModalWithNav, DeliveryTracking } from '../../common'
import DatePicker from 'react-date-picker'
import { ToastContainer, toast } from 'react-toastify'                              //토스트
import 'react-toastify/dist/ReactToastify.css'


const transportationCompanies = [
    {value:'', name:'선택하세요'},
    {value:'우체국택배', name:'우체국택배'},
    {value:'CJ대한통운', name:'CJ대한통운'},
    {value:'한진택배', name:'한진택배'},
    {value:'현대택배', name:'현대택배'},
    {value:'로젠택배', name:'로젠택배'},
    {value:'KG로지스', name:'KG로지스'},
    {value:'KGB택배', name:'KGB택배'},
    {value:'경동택배', name:'경동택배'},
]
export default class Order extends Component{
    constructor(props){
        super(props)
        this.state = {
            transportationCompanies: [],
            order: null,
            consumer: null,
            goods: null,
            isOpen: false
        }
    }

    async componentDidMount(){

        await this.initData()

        this.search()
    }
    initData = async () => {
        const { status, data } = await getTransportCompanies()
        if(status !== 200){
            alert('택배사 리스트의 응답이 없습니다')
            return
        }

        const transportationCompanies = data.Company
        transportationCompanies.unshift({Code: '', Name: '배송업체 선택'})

        this.setState({
            transportationCompanies: transportationCompanies
        })

        console.log(data)


    }
    search = async () => {
        const { data: order } = await getOrderByOrderNo(this.props.orderNo)
        const { data: consumer } = await getConsumerByConsumerNo(order.consumerNo)
        const { data: goods } = await getGoodsByGoodsNo(order.goodsNo)

        //DatePicker 의 value 값을 맞춰 주기 위해 Date 객체로 변환 해야 함
        order.deliveryDate = order.deliveryDate ? new Date(order.deliveryDate) : null

        this.setState({
            order,
            consumer,
            goods
        })
    }
    onChange = (e) => {

        const name = e.target.name
        const order = Object.assign({}, this.state.order)

        order[name] = e.target.value

        if(name === 'transportCompanyCode')
            order['transportCompanyNm'] = e.target[e.target.selectedIndex].text

        console.log(e.target)

        this.setState({
            order
        })
    }
    //달력
    onCalendarChange = (date)=> {
        const order = Object.assign({}, this.state.order)
        order.deliveryDate = date
        this.setState({
            order
        })
    }
    onSave = async () => {
        const { status, data } = await updOrder(this.state.order)


        console.log(this.state.order)

        this.notify('저장되었습니다.', toast.success)
        this.props.onClose(true)
    }
    notify = (msg, toastFunc) => {
        toastFunc(msg, {
            position: toast.POSITION.TOP_CENTER
        })
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }
    onClose = () => {
        this.toggle()
    }

    render(){
        if(!this.state.order)
            return null
        const { transportationCompanies, order, consumer, goods  } = this.state
        console.log(order)
        return(
            <Fragment>
                <Container className={Style.wrap}>
                    <br/>
                    <div className={Style.orderBox}>
                        <div>
                            주문번호 : {order.orderNo}
                        </div>
                        <div>
                            {goods.goodsNm}
                        </div>
                        <div>
                            {`${order.packAmount}${order.packUnit} × ${order.orderCnt}`}
                        </div>
                    </div>
                    <div className={Style.invoiceBox}>
                        <FormGroup>
                            <Label><h6>택배사</h6></Label>
                            <p>
                                <select defaultValue={order.transportCompanyCode || ''} name='transportCompanyCode' onChange={this.onChange}>
                                    {
                                        transportationCompanies.map(item => <option key={item.Code} value={item.Code}>{item.Name}</option>)
                                    }
                                </select></p>
                        </FormGroup>
                        <FormGroup>
                            <Label><h6>배송일</h6></Label>
                            <div>
                                <DatePicker
                                    onChange={this.onCalendarChange}
                                    value={order.deliveryDate}
                                />
                            </div>
                        </FormGroup>
                        <FormGroup>
                            <Label><h6>송장번호</h6></Label>
                            <Input name='trackingNumber' onChange={this.onChange} value={order.trackingNumber}/>
                        </FormGroup>
                        <Button color={'warning'} block onClick={this.onSave} disabled={order.transportCompanyCode && order.trackingNumber && order.deliveryDate ? false : true}>저장</Button>
                        <Button outline block onClick={this.toggle} disabled={order.transportCompanyCode && order.trackingNumber && order.deliveryDate ? false : true}>배송조회</Button>
                    </div>
                    <br/>
                    <h6>배송정보</h6>
                    <ListGroup>
                        <ListGroupItem action>
                            <div><small>상품정보</small></div>
                            <div><b>{goods.goodsNm}</b></div>
                            <div>수량 : <b> {`${order.packAmount}${order.packUnit} × ${order.orderCnt}`} </b></div>
                        </ListGroupItem>
                        <ListGroupItem action>
                            <div><small>받는사람</small></div>
                            <b>{order.receiverName}</b>
                        </ListGroupItem>
                        <ListGroupItem action>
                            <div><small>연락처</small></div>
                            <b>{order.receiverPhone}</b>
                        </ListGroupItem>
                        <ListGroupItem action>
                            <div><small>주소</small></div>
                            <b>{`${order.receiverAddr} (${order.zipNo || ''})`}</b>
                        </ListGroupItem>
                        <ListGroupItem action>
                            <div><small>배송메세지</small></div>
                            <b>{order.deliveryMsg}</b>
                        </ListGroupItem>
                    </ListGroup>
                    <br />
                    <h6>주문자정보</h6>
                    <ListGroup>
                        <ListGroupItem action>
                            <div><small>일자</small></div>
                            <b>{ComUtil.utcToString(order.orderDate)}</b>
                        </ListGroupItem>
                        <ListGroupItem action>
                            <div><small>보내는사람</small></div>
                            <b>{consumer.name}</b>
                        </ListGroupItem>
                        <ListGroupItem action>
                            <div><small>연락처</small></div>
                            <b>{consumer.phone}</b>
                        </ListGroupItem>
                        <ListGroupItem action>
                            <div><small>이메일</small></div>
                            <b>{consumer.email}</b>
                        </ListGroupItem>
                    </ListGroup>
                </Container>

                {
                    this.state.isOpen &&(
                        <ModalWithNav show={this.state.isOpen} title={'배송조회'} onClose={this.onClose}>
                            <DeliveryTracking transportCompanyCd={order.transportCompanyCode} trackingNumber={order.trackingNumber}/>
                        </ModalWithNav>
                    )
                }


                <ToastContainer />  {/* toast 가 그려질 컨테이너 */}
            </Fragment>
        )
    }
}