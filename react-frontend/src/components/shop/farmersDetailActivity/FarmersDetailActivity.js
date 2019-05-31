import React, { Component, Fragment } from 'react';
import { getGoodsByGoodsNo } from '../../../lib/goodsApi'
import { getProducerByProducerNo } from '../../../lib/producerApi'
import { Server } from '../../../components/Properties'
import ComUtil from '../../../util/ComUtil'
import Style from './FarmersDetailActivity.module.scss'
import { Badge, Progress } from 'reactstrap'
import classNames from 'classnames'
import farmers from '../../../images/farmers.jpg'
import {Webview} from "../../../lib/webviewApi";
import { ShopXButtonNav } from '../../common'
import { Favorite, Star, StarHalf } from '@material-ui/icons'

export default class FarmersDetailActivity extends Component {
    constructor(props) {
        super(props);
        const params = ComUtil.getParams(this.props)
        this.state = {
            goodsNo: params.goodsNo,
            goods: null,
            producer: null
        }
    }
    async componentDidMount (){
        await this.search()
    }
    search = async () => {
        const { data: goods } = await getGoodsByGoodsNo(this.state.goodsNo)
        const { data: producer } = await getProducerByProducerNo(goods.producerNo)
        this.setState({
            goods: goods,
            producer: producer
        })
        console.log(goods, producer)
    }

    diaryImages = (images) => {
        const serverImageUrl = Server.getImageURL()
        return images.map(image => <img key={image.imageUrl} src={serverImageUrl+image.imageUrl}/>)
    }


    onGoodsClick = () => {
        Webview.closePopupAndMovePage('/goods?goodsNo='+this.state.goods.goodsNo)
    }

    render() {

        if(!this.state.goods) return null

        const { goods, producer } = this.state
        const { cultivationDiaries } = goods
        const currentPrice = ComUtil.price3StepCurrent(goods)
        const discountRate = (currentPrice / goods.shipPrice) * 100
        ComUtil.sort(cultivationDiaries, 'diaryRegDate', true)

        return(
            <Fragment>
                <ShopXButtonNav close>생산자 활동내역</ShopXButtonNav>
                <div className={Style.wrap}>
                    <section className={Style.producerBox}>
                        <div className={Style.farmImgBox}>
                            <img src={farmers}/>
                        </div>
                        <div className={Style.farmInfoBox}>
                            <div>{producer.farmName}</div>
                            <div>{producer.name}</div>
                            <div><small>{producer.email}</small></div>
                            {/*<div><small className='text-info'>(1,340)<Star/><Star/><Star/><Star/><StarHalf/></small></div>*/}
                            {/*<div><small>지금까지 156개의 상품을 진행하였습니다</small></div>*/}
                        </div>
                    </section>
                    <section className={Style.goodsBox} onClick={this.onGoodsClick}>
                        <div>
                            <div>
                                <img src={Server.getImageURL() + goods.goodsImages[0].imageUrl}/>
                            </div>
                        </div>
                        <div>
                            <div>{goods.goodsNm}</div>
                            <div><b>{ComUtil.addCommas(currentPrice)}</b> ({Math.round(discountRate*10)/10}%) <small className={Style.strike}>{ComUtil.addCommas(goods.shipPrice)}</small></div>
                            <div>
                                <Badge color={'info'}>{goods.pesticideYn}</Badge>{' '}
                                <Badge color={'info'}>{goods.cultivationNm}</Badge>{' '}
                                <Badge color={'info'}>{goods.productionArea}</Badge>{' '}
                            </div>
                        </div>
                    </section>

                    {
                        cultivationDiaries && (
                            <section className={Style.currentState}>
                                <div className='text-center'>현재 작물상태는 <b>{cultivationDiaries[0].cultivationStepNm}</b> 입니다</div>
                                <div className='text-center'><small>{`예상 재배기간 : ${ComUtil.utcToString(goods.productionStart)} ~ ${ComUtil.utcToString(goods.expectShippingStart)}`}</small></div>
                                <div className='p-1'>
                                    <Progress multi>
                                        <Progress bar color={ cultivationDiaries[0].cultivationStepCd >= 1 ? 'success' : 'secondary' } value="25">파종</Progress>
                                        <Progress bar color={ cultivationDiaries[0].cultivationStepCd >= 2 ? 'success' : 'secondary' } value="25">발아</Progress>
                                        <Progress bar color={ cultivationDiaries[0].cultivationStepCd >= 3 ? 'success' : 'secondary' } value="25">정식</Progress>
                                        <Progress bar color={ cultivationDiaries[0].cultivationStepCd >= 4 ? 'success' : 'secondary' } value="25">수확</Progress>
                                    </Progress>
                                </div>
                            </section>
                        )
                    }

                    {
                        cultivationDiaries && (
                            cultivationDiaries.map((item, index) => {
                                return (
                                    <section key={item.diaryNo+'_'+index} className={Style.diaryBox}>
                                        {this.diaryImages(item.diaryImages)}
                                        <div className={'text-right'}><small>{ComUtil.utcToString(item.diaryRegDate)}</small></div>
                                        <div><small>{item.cultivationStepNm}</small></div>
                                        <div>{item.diaryContent}</div>

                                        <div>
                                            <input type={'text'} className={Style.inputReply} placeholder={'댓글 달기...'} onClick={()=>{alert('베타버전부터 제공됩니다')}}/>
                                        </div>
                                        {
                                            index === 0 && (
                                                <div>
                                                    <div><b>김민재</b> 무럭무럭 자라고 있네요, 얼마나 더 기다려야 할까요? 점점 더 날씨가 더워 지는데 걱정이네요~
                                                    </div>

                                                </div>
                                            )
                                        }
                                    </section>
                                )
                            })
                        )
                    }


                </div>
            </Fragment>
        )
    }
}
