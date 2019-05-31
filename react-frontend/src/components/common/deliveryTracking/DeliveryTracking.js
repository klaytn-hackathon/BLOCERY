import React, { Component } from 'react'
import { getTransportCompanies, getDeliverTrace } from '../../../lib/deliveryOpenApi'
import { Container, Row, Col, Button, Table } from 'reactstrap'
import { Spinner } from '../../../components/common'
import ComUtil from '../../../util/ComUtil'
import Style from './DeliveryTracking.module.scss'
import PropTypes from 'prop-types'
const tempData = {"result":"Y","senderName":"(주*","receiverName":"조준*","itemName":"★식품(닭강정)★보통1","invoiceNo":"623012590022","receiverAddr":"경기도 안양*****","orderNumber":null,"adUrl":null,"estimate":"17∼19시","level":6,"complete":true,"recipient":"조준현","itemImage":"","trackingDetails":[{"time":1557987295000,"timeString":"2019-05-16 15:14:55","code":null,"where":"강원속초설악","kind":"집화처리","telno":"033-636-9726","telno2":"","remark":null,"level":2,"manName":"","manPic":""},{"time":1558000844000,"timeString":"2019-05-16 19:00:44","code":null,"where":"속초","kind":"간선상차","telno":"033-637-0034","telno2":"","remark":null,"level":3,"manName":"","manPic":""},{"time":1558027785000,"timeString":"2019-05-17 02:29:45","code":null,"where":"옥천HUB","kind":"간선하차","telno":"","telno2":"","remark":null,"level":3,"manName":"","manPic":""},{"time":1558028452000,"timeString":"2019-05-17 02:40:52","code":null,"where":"옥천HUB","kind":"간선상차","telno":"","telno2":"","remark":null,"level":3,"manName":"","manPic":""},{"time":1558052933000,"timeString":"2019-05-17 09:28:53","code":null,"where":"동안","kind":"간선하차","telno":"","telno2":"","remark":null,"level":3,"manName":"","manPic":""},{"time":1558052949000,"timeString":"2019-05-17 09:29:09","code":null,"where":"동안","kind":"간선하차","telno":"","telno2":"","remark":null,"level":3,"manName":"","manPic":""},{"time":1558053838000,"timeString":"2019-05-17 09:43:58","code":null,"where":"경기안양동안양","kind":"배달출발\n(배달예정시간\n:17∼19시)","telno":"","telno2":"01083136954","remark":null,"level":5,"manName":"권현성","manPic":""},{"time":1558077968000,"timeString":"2019-05-17 16:26:08","code":null,"where":"경기안양동안양","kind":"배달완료","telno":"","telno2":"01083136954","remark":null,"level":6,"manName":"권현성","manPic":""}],"productInfo":null,"zipCode":null,"completeYN":"Y","firstDetail":{"time":1557987295000,"timeString":"2019-05-16 15:14:55","code":null,"where":"강원속초설악","kind":"집화처리","telno":"033-636-9726","telno2":"","remark":null,"level":2,"manName":"","manPic":""},"lastDetail":{"time":1558077968000,"timeString":"2019-05-17 16:26:08","code":null,"where":"경기안양동안양","kind":"배달완료","telno":"","telno2":"01083136954","remark":null,"level":6,"manName":"권현성","manPic":""},"lastStateDetail":{"time":1558077968000,"timeString":"2019-05-17 16:26:08","code":null,"where":"경기안양동안양","kind":"배달완료","telno":"","telno2":"01083136954","remark":null,"level":6,"manName":"권현성","manPic":""}}

class DeliveryTracking extends Component{
    constructor(props){
        super(props)
        this.state = {
            loading: false,
            data: null,
            companyList: [],
            transportCompanyCd: this.props.transportCompanyCd,
            invoiceNo: this.props.trackingNumber
        }
    }
    async componentDidMount(){
        // this.getCompanyList()
        await this.search()
    }
    //택배사 조회
    // getCompanyList = async() => {
    //     const { data } = await getTransportCompanies()
    //     this.setState({
    //         companyList: data.Company
    //     })
    // }
    //택배사 선택
    // onTransportCompanyChange = (e) => {
    //     console.log(e.target.value)
    //     this.setState({
    //         transportCompanyCd: e.target.value
    //     })
    // }

    search = async () => {
        // console.log(tempData)
        // this.setState({
        //     data: tempData
        // })
        // return

        this.setState({
            loading: true
        })

        const { status, data } = await getDeliverTrace(this.state.transportCompanyCd, this.state.invoiceNo)

        if(status !== 200){
            alert('잘못된 응답입니다')
            return
        }

        //실패 하였을 경우 data.status, data.msg 를 별도로 넣어 보내고 있어 예외 처리를 status 키가 있는지 판별 해야 함
        //정상적으로 조회 되었을 경우는 status, msg와 같은 키는 보내지 않고있음
        if('status' in data){
            //alert(`${data.msg} (${data.code})`)
            this.setState({
                alertText: `${data.msg} (${data.code})`,
                loading: false
            })
            return
        }

        const trackingDetails = ComUtil.sort(data.trackingDetails, 'time', false)

        data.trackingDetails = trackingDetails

        this.setState({
            data: data,
            loading: false
        })

        this.props.onLoad(data)
    }

    render(){

        if(this.state.alertText)
            return this.state.alertText

        if(!this.state.data)
            return null

        if(!this.state.invoiceNo)
            return <div>입력된 운송번호가 없습니다</div>

        if(this.state.loading)
            return <Spinner/>


        // if(this.state.alert)
        //     return <div>{this.state.alert}</div>

        const data = this.state.data
        console.log(data)
        // const trackingDetails = ComUtil.sort(data.trackingDetails, 'time', false)
        const { trackingDetails } = this.state.data

        return(
            <div className={Style.wrap}>

                {/*<select onChange={this.onTransportCompanyChange} defaultValue={this.state.transportCompanyCd}>*/}
                {/*{*/}
                {/*this.state.companyList.map((item) => <option value={item.Code}>{item.Name}</option>)*/}
                {/*}*/}
                {/*</select>*/}
                <Container>
                    <Row>
                        <Col xs={4} >상태</Col>
                        <Col xs={8} className='text-left'>{data.lastDetail.kind}</Col>
                    </Row>
                    <Row>
                        <Col xs={4}>주문상품</Col>
                        <Col xs={8} className='text-left'>{data.itemName}</Col>
                    </Row>
                    <Row>
                        <Col xs={4}>배송예정시각</Col>
                        <Col xs={8} className='text-left'>{data.estimate}</Col>
                    </Row>
                    <Row>
                        <Col xs={4}>운송장번호</Col>
                        <Col xs={8} className='text-left'>{data.invoiceNo}</Col>
                    </Row>
                    {/*<Row>*/}
                    {/*<Col xs={4}>받는 분 : </Col>*/}
                    {/*<Col xs={8} className='text-left'>{data.recipient}</Col>*/}
                    {/*</Row>*/}
                    {/*<Row>*/}
                    {/*<Col xs={4}>배송지 : </Col>*/}
                    {/*<Col xs={8} className='text-left'>{data.receiverAddr}</Col>*/}
                    {/*</Row>*/}
                </Container>
                <br/>
                <Table>
                    <thead>
                    <tr>
                        <th>시간</th>
                        <th>현재위치</th>
                        <th>배송상태</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        trackingDetails.map(item=>{
                            return(
                                <tr key={item.timeString}>
                                    {/*<td>{item.timeString.substr(0,10)}<br/>{item.timeString.substr(11,8)}</td>*/}
                                    <td>{item.timeString.replace(/-/g, '.')}</td>
                                    <td>{item.where}</td>
                                    <td>{item.kind}</td>
                                </tr>
                            )
                        })
                    }

                    </tbody>
                </Table>

            </div>
        )
    }
}
DeliveryTracking.propTypes = {
    transportCompanyCd: PropTypes.string.isRequired,
    trackingNumber: PropTypes.string.isRequired,
}
DeliveryTracking.defaultProps = {
}
export default DeliveryTracking
