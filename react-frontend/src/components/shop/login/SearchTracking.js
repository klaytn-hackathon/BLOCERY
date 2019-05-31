import React, { Component } from 'react'
import { getTransportCompanies, getDeliverTrace } from '../../../lib/deliveryOpenApi'
import { Button, Table } from 'reactstrap'
import { BlocerySpinner } from '../../../components/common'
import {BlocerySymbolGreen} from "../../common/logo/Logo";
import ComUtil from '../../../util/ComUtil'

const tempData = {"result":"Y","senderName":"(주*","receiverName":"조준*","itemName":"★식품(닭강정)★보통1","invoiceNo":"623012590022","receiverAddr":"경기도 안양*****","orderNumber":null,"adUrl":null,"estimate":"17∼19시","level":6,"complete":true,"recipient":"조준현","itemImage":"","trackingDetails":[{"time":1557987295000,"timeString":"2019-05-16 15:14:55","code":null,"where":"강원속초설악","kind":"집화처리","telno":"033-636-9726","telno2":"","remark":null,"level":2,"manName":"","manPic":""},{"time":1558000844000,"timeString":"2019-05-16 19:00:44","code":null,"where":"속초","kind":"간선상차","telno":"033-637-0034","telno2":"","remark":null,"level":3,"manName":"","manPic":""},{"time":1558027785000,"timeString":"2019-05-17 02:29:45","code":null,"where":"옥천HUB","kind":"간선하차","telno":"","telno2":"","remark":null,"level":3,"manName":"","manPic":""},{"time":1558028452000,"timeString":"2019-05-17 02:40:52","code":null,"where":"옥천HUB","kind":"간선상차","telno":"","telno2":"","remark":null,"level":3,"manName":"","manPic":""},{"time":1558052933000,"timeString":"2019-05-17 09:28:53","code":null,"where":"동안","kind":"간선하차","telno":"","telno2":"","remark":null,"level":3,"manName":"","manPic":""},{"time":1558052949000,"timeString":"2019-05-17 09:29:09","code":null,"where":"동안","kind":"간선하차","telno":"","telno2":"","remark":null,"level":3,"manName":"","manPic":""},{"time":1558053838000,"timeString":"2019-05-17 09:43:58","code":null,"where":"경기안양동안양","kind":"배달출발\n(배달예정시간\n:17∼19시)","telno":"","telno2":"01083136954","remark":null,"level":5,"manName":"권현성","manPic":""},{"time":1558077968000,"timeString":"2019-05-17 16:26:08","code":null,"where":"경기안양동안양","kind":"배달완료","telno":"","telno2":"01083136954","remark":null,"level":6,"manName":"권현성","manPic":""}],"productInfo":null,"zipCode":null,"completeYN":"Y","firstDetail":{"time":1557987295000,"timeString":"2019-05-16 15:14:55","code":null,"where":"강원속초설악","kind":"집화처리","telno":"033-636-9726","telno2":"","remark":null,"level":2,"manName":"","manPic":""},"lastDetail":{"time":1558077968000,"timeString":"2019-05-17 16:26:08","code":null,"where":"경기안양동안양","kind":"배달완료","telno":"","telno2":"01083136954","remark":null,"level":6,"manName":"권현성","manPic":""},"lastStateDetail":{"time":1558077968000,"timeString":"2019-05-17 16:26:08","code":null,"where":"경기안양동안양","kind":"배달완료","telno":"","telno2":"01083136954","remark":null,"level":6,"manName":"권현성","manPic":""}}

export default class SearchTracking extends Component{
    constructor(props){
        super(props)
        this.state = {
            data: null,
            companyList: [],
            transportCompanyCd: this.props.transportCompanyCd,
            invoiceNo: this.props.trackingNumber
        }
    }
    componentDidMount(){
        // this.getCompanyList()
        this.search()
    }
    getCompanyList = async() => {
        const { data } = await getTransportCompanies()
        this.setState({
            companyList: data.Company
        })
    }
    //택배사 선택
    onTransportCompanyChange = (e) => {
        console.log(e.target.value)
        this.setState({
            transportCompanyCd: e.target.value
        })
    }
    //택배사 조회
    search = async () => {
        console.log(tempData)
        this.setState({
            data: tempData
        })
        return

        const { status, data } = await getDeliverTrace()

        console.log(data)

    }
    render(){

        if(!this.state.data)
            return <BlocerySpinner/>

        const data = this.state.data
        const trackingDetails = ComUtil.sort(data.trackingDetails, 'time', false)


        return(
            <div>
                {/*<select onChange={this.onTransportCompanyChange} defaultValue={this.state.transportCompanyCd}>*/}
                    {/*{*/}
                        {/*this.state.companyList.map((item) => <option value={item.Code}>{item.Name}</option>)*/}
                    {/*}*/}
                {/*</select>*/}
                <div>
                    <Button onClick={this.search}>새로고침</Button>
                </div>
                <div>
                    주문상품 : {data.itemName}
                </div>
                <div>
                    상태 : {data.lastDetail.kind}
                </div>
                <div>
                    배송예정시각 : {data.estimate}
                </div>
                <div>
                    운송장번호 : {data.invoiceNo}
                </div>
                <div>
                    받는사람 : {data.recipient}
                </div>
                <div>
                    배송지 : {data.receiverAddr}
                </div>

                <Table hover>
                    <thead>
                    <tr>
                        <th>처리일시</th>
                        <th>현재위치</th>
                        <th>배송상태</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        trackingDetails.map(item=>{
                            return(
                                <tr>
                                    <td>{item.timeString}</td>
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

