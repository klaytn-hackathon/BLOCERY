import React, { Component } from 'react'

import GoodsDetail from '../../common/goodsDetail'
import { ShopXButtonNav, ShopOnlyXButtonNav } from '../../common'
import { getGoods, getGoodsByGoodsNo } from '../../../lib/goodsApi'
import { getProducerByProducerNo } from '../../../lib/producerApi'
import ComUtil from '../../../util/ComUtil'
import { Server } from '../../../components/Properties'
import { BlocerySpinner } from '../../common'
export default class Goods extends Component {
    constructor(props) {
        super(props)

        // const search = this.props.location.search
        // const params = new URLSearchParams(search)
        // const goodsNo = params.get('goodsNo')

        console.log('goods props : ', this.props)

        let goodsNo = this.props.goodsNo ||  ComUtil.getParams(this.props).goodsNo

        this.state = {
            goodsNo: goodsNo,
            loading: true,
            goods: null,
            producer: null,
            farmDiaries: [],
            images: null
        }
    }

    componentDidMount(){
        window.scrollTo(0,0)
        this.search()
    }
    search = async () => {

        this.setState({loading: true})
        const goodsNo = this.state.goodsNo

        const { data:goods } = await getGoodsByGoodsNo(goodsNo)
        console.log('goods:',goods)
        const { data:producer } = await getProducerByProducerNo(goods.producerNo)

        //this.sortDesc(goods.cultivationDiaries)

        const farmDiaries = this.getFilteredData(goods)

        this.sortDesc(farmDiaries)

        this.setState({
            loading: false,
            goods: goods,
            producer: producer,
            images: goods.goodsImages,
            farmDiaries: farmDiaries.splice(0, 3)   //3건만
        })
    }
    //재배일지 등록일자 내림차순 정렬
    sortDesc = (data) => {
        data.sort((a,b)=>{
            //return a.diaryRegDate < b.diaryRegDate ? -1 : a.diaryRegDate > b.diaryRegDate ? 1 : 0
            return b.diaryRegDate - a.diaryRegDate
        })
    }
    //goods 에서 card 에 바인딩 할 object 반환
    getFilteredData = (goods) => {
        const { goodsNo, goodsNm } = goods
        const serverImageUrl = Server.getImageURL()
        console.log('getFileterdData', goods)
        return goods.cultivationDiaries.map((cultivationDiary)=>{
            return {
                goodsNo: goodsNo,
                goodsNm: goodsNm,
                imageUrl: serverImageUrl+cultivationDiary.diaryImages[0].imageUrl,
                ...cultivationDiary
            }
        })
    }


    render() {
        return(
            <div>
                {/*<ShopXButtonNav history={this.props.history}>상품목록</ShopXButtonNav>*/}
                {/*<ShopXButtonNav close history={this.props.history}>상품목록</ShopXButtonNav>*/}
                <ShopOnlyXButtonNav back history={this.props.history}/>
                {
                    this.state.loading ? (<BlocerySpinner/>) :
                        (
                            <GoodsDetail
                                goods={this.state.goods}
                                producer={this.state.producer}
                                farmDiaries={this.state.farmDiaries}
                                images={this.state.images}
                                history={this.props.history}
                            />
                        )
                }

            </div>
        )
    }
}