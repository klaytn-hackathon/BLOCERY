import React, { Component, Fragment } from 'react'
import Style from './FarmDiary.module.scss'
import { Container, Row, Col, Button } from 'reactstrap'

import DatePicker from 'react-date-picker'
import { ToastContainer, toast } from 'react-toastify'                              //토스트
import 'react-toastify/dist/ReactToastify.css'
import { addCultivationDiary, updCultivationDiary } from '../../../lib/producerApi'
import ComUtil from '../../../util/ComUtil'
import { getProducerGoods }  from '../../../lib/goodsApi'
import { Webview } from '../../../lib/webviewApi'
import { DiaryReg } from '../../../components/producer'

import { Spinner, ProducerFarmDiaryItemCard, ProducerFullModalPopupWithNav } from '../../common'

export default class FarmDiaryList extends Component{
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false,
            goodsNo: null,
            diaryNo: null,
            loading: true,
            goodsList: []
        }

        // window.document.addEventListener('message', (e) => {
        //     alert('window.document.addEventListener')
        // }, false)

    }
    componentDidMount(){
        this.search()
    }

    // 조회
    search = async () => {
        this.setState({loading: true})
        const { data } = await getProducerGoods()
        console.log(data.cultivationDiaries)

        // const res = data.map(goods => goods.cultivationDiaries)
        // console.log('res', res)

        this.setState({
            loading: false,
            goodsList: data
        })
    }



    getProducerFarmDiaryItemCard = (goods) => {
        return goods.cultivationDiaries.map((cultivationDiary)=>{

            return (
                <ProducerFarmDiaryItemCard key={`id-${goods.goodsNo}-${cultivationDiary.diaryNo}`}
                                           {...cultivationDiary}
                                           {...goods}
                                           onFarmDiaryClick={this.onOpenPopupWithCallbackClick.bind(this, goods.goodsNo, cultivationDiary.diaryNo)}
                />
            )
        })
    }
    onNewClick = (e) => {
        const goodsNo = e.target.name
        this.setState({
            isOpen: true,
            goodsNo: goodsNo,
            diaryNo: null
        })
        // this.onOpenPopupWithCallbackClick(goodsNo)
    }

    //콜백 있는 팝업
    onOpenPopupWithCallbackClick = (goodsNo, diaryNo) => {
        this.setState({
            isOpen: true,
            goodsNo: goodsNo,
            diaryNo: diaryNo
        })
        // console.log(goodsNo, diaryNo)
        // if(diaryNo)
        //     Webview.openPopup(`/producer/diaryReg?goodsNo=${goodsNo}&diaryNo=${diaryNo}`, this.callback)
        // else
        //     Webview.openPopup(`/producer/diaryReg?goodsNo=${goodsNo}`, this.callback)
    }

    // callback = (event) => {
    //     const data = JSON.parse(event.data)
    //
    //     this.search()
    // }

    onClose = (data) => {
        this.setState({
            isOpen: false
        })

        this.search()
    }

    render(){
        return(
            <Fragment>
                <Container>

                    {
                        this.state.loading && <div className='text-center'><Spinner/></div>
                    }
                    {
                        this.state.goodsList.map((goods)=>{
                            return (
                                <div key={`id-${goods.goodsNo}`}>
                                    <Row >
                                        <Col xs={8}>
                                            {goods.goodsNm}
                                        </Col>
                                        <Col xs={4} className={'text-right'}>
                                            <Button color={'info'} name={goods.goodsNo} onClick={this.onNewClick}>신규</Button>
                                        </Col>
                                    </Row>
                                    <br/>
                                    <Row>
                                        <Col>
                                            {
                                                this.getProducerFarmDiaryItemCard(goods)
                                            }
                                        </Col>
                                    </Row>
                                </div>
                            )
                        })

                        // this.state.data.map((farmDiary)=>{
                        //     return(
                        //         <ProducerFarmDiaryItemCard
                        //             {...farmDiary}
                        //             onFarmDiaryClick={()=>{this.onOpenPopupWithCallbackClick()}}
                        //         />
                        //     )
                        // })

                        // this.state.data.map((goods)=>{
                        //     // return <GoodsItemCard key={`GoodsNo${goods.goodsNo}`} {...goods} onGoodsClick={this.onGoodsClick} onFarmDiaryClick={this.onFarmDiaryClick} onOrderClick={this.onOrderClick}/>
                        //     return <div>FarmDiaryItemCard</div>
                        // })
                    }

                </Container>
                <ProducerFullModalPopupWithNav show={this.state.isOpen} title={this.state.diaryNo ? '재배일지수정' : '재배일지등록'} onClose={this.onClose}>
                    <DiaryReg goodsNo={this.state.goodsNo} diaryNo={this.state.diaryNo}/>
                </ProducerFullModalPopupWithNav>
            </Fragment>






        )
    }
}