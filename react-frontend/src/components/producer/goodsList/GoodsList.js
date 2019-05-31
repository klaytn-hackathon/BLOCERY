import React, { Component, Fragment } from 'react';
import Style from './GoodsList.module.scss'
import { getProducerGoods } from '../../../lib/goodsApi'
import { Webview } from '../../../lib/webviewApi'
import { Spinner, GoodsItemCard, ProducerFullModalPopupWithNav } from '../../common'
import { Container, Row, Col, Button } from 'reactstrap'
import { GoodsReg, DiaryReg } from '../../../components/producer'

export default class GoodsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isGoodsOpen: false,
            isFarmDiaryOpen: false,
            goodsNo: null,
            loading: true,
            data: []
        }
    }

    componentDidMount(){
        this.search()
    }
    search = async () => {
        this.setState({loading: true})

        const { status, data } = await getProducerGoods()
        if(status !== 200){
            alert('응답이 실패 하였습니다')
            return
        }

        //const data = [{goodsNo: 3, goodsNm:'사과'}];
        this.setState({
            loading: false,
            data: data
        })
    }

    //신규상풍
    onNewGoodsClick = () => {
        console.log(this.props)
        // this.props.history.push('/producer/goodsReg?goodsNo=')
        this.setState({
            isGoodsOpen: true,
            goodsNo: null
        })
        // Webview.openPopup(`/producer/goodsReg`)
    }
    //상품수정
    onGoodsClick = (data) => {
        this.setState({
            isGoodsOpen: true,
            goodsNo: data.goodsNo
        })
        // Webview.openPopup(`/producer/goodsReg?goodsNo=${data.goodsNo}`)
    }
    onFarmDiaryClick = (data) => {
        console.log(data)
        this.setState({
            isFarmDiaryOpen: true,
            goodsNo: data.goodsNo
        })
        // Webview.openPopup(`/producer/diaryReg?goodsNo=${data.goodsNo}`)
    }
    //상품수정 후 refresh
    callbackGoods = (result) => {
        const {url, param} = JSON.parse(result.data)
    }
    //주문
    onOrderClick = () => {

    }
    //주문 확인 후 refresh
    callbackOrder = () => {

    }
    onClose = (data) => {

        console.log('parent onClose data : ', data)
        this.search()
        this.setState({
            isGoodsOpen: false,
            isFarmDiaryOpen: false
        })
    }
    render() {
        return(
            <Fragment>
                <Container fluid>
                    <Row>
                        <Col>
                            <p><Button color={'info'} onClick={this.onNewGoodsClick}>신규</Button></p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {
                                this.state.loading && <div className='text-center'><Spinner/></div>
                            }
                            {
                                this.state.data.map((goods)=>{
                                    return <GoodsItemCard key={`GoodsNo${goods.goodsNo}`} {...goods} onGoodsClick={this.onGoodsClick} onFarmDiaryClick={this.onFarmDiaryClick} onOrderClick={this.onOrderClick}/>
                                })
                            }
                        </Col>
                    </Row>
                </Container>
                <ProducerFullModalPopupWithNav show={this.state.isGoodsOpen} title={this.state.goodsNo ? '상품수정' : '상품등록'} onClose={this.onClose}>
                    <GoodsReg goodsNo={this.state.goodsNo}/>
                </ProducerFullModalPopupWithNav>
                <ProducerFullModalPopupWithNav show={this.state.isFarmDiaryOpen} title={'재배일지등록'} onClose={this.onClose}>
                    <DiaryReg goodsNo={this.state.goodsNo}/>
                </ProducerFullModalPopupWithNav>
            </Fragment>
        )
    }
}