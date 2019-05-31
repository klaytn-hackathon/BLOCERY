import React, { Fragment, Component } from 'react'
//import './GoodsDetail.scss'
import Style from './GoodsDetail.module.scss'
import { Button, Table, Container, Row, Col } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faShoppingCart, faCarrot, faAppleAlt, faCartPlus, faCartArrowDown, faStar, faStarHalf,
    faShareAlt

} from '@fortawesome/free-solid-svg-icons'
import ComUtil from '../../../util/ComUtil'
import { Const } from '../../Properties'

//Open source 로 대체. 기존 컴포넌트는 사용중지
// import GoodsImage from './GoodsImage'

import TabSection from './TabSection'

import { FarmDiaryCard, HrGoodsPriceCard } from '../../common/cards'
import { Server } from '../../../components/Properties'

import { Webview } from '../../../lib/webviewApi'
import {getLoginUserType} from '../../../lib/loginApi'


import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css"
import { TimeText, ModalAlert } from '../../common'
import classNames from 'classnames'
import customerReview from '../../../images/customerReview.jpeg'

const GoodsDetail = (props) => {

    const serverImageUrl = Server.getImageURL()
    const serverThumbnailUrl = Server.getImageURL()

    const addCart = () => {
        console.log('장바구니 alert callback ')
    }
    const onBuyClick = async () => {

        //로그인 check
        const {data:loginUserType} = await getLoginUserType();

        // 상품상세에서 구매버튼 클릭시 체크하도록 이동.
        if (loginUserType === 'consumer') { //미 로그인 시 로그인 창으로 이동.
            Webview.openPopup('/buy?goodsNo='+props.goods.goodsNo, true); //구매로 이동 //구매로 이동팝업
        }
        else {
            Webview.openPopup('/login',  true); //로그인으로 이동팝업
        }

    }


    let {
        goodsNo,            //순번
        // producerNo,         //생산자번호
        goodsNm,            //상품명
        goodsImages,        //상품이미지
        searchTag,          //태그
        // itemNo,             //품목번호
        itemNm,             //품목명
        breedNm,            //품종
        productionArea,     //생산지
        // cultivationNo,      //재배방법번호
        cultivationNm,      //재배방법명
        saleEnd,            //판매마감일
        productionStart,    //생산시작일
        expectShippingStart,//예상출하시작일
        expectShippingEnd,  //예상출하마감일
        pesticideYn,        //농약유무
        packUnit,           //포장단위
        packAmount,         //포장 양
        packCnt,            //판매개수
        shipPrice,          //출하 후 판매가
        reservationPrice,   //예약 시 판매가
        //cultivationDiary  //재배일지
        // contractHash,       //블록체인 저장된 해시값
        discountRate,       //할인율
        remainedCnt         //남은판매개수
    } = props.goods

    let goodsPriceInfo


    /**알파서비스 전용, 모든 상품에 대해 3단계 가격정책 적용.*/
    //price3Step - 알파서비스 전용, 1번상품에 대해 3단계 가격정책 적용.
    if (Const.IS_ALPHA_SERVICE) {
        reservationPrice = ComUtil.price3StepCurrent(props.goods);
        discountRate = 100 - ((reservationPrice / shipPrice) * 100)

        goodsPriceInfo = ComUtil.price3StepAll(props.goods)

        goodsPriceInfo.map(item=>{
            item.discountRate = Math.round(100 - ((item.price / shipPrice) * 100))
            if(item.price === reservationPrice)
                item.active = true
        })
    }




    const { name, farmName } = props.producer

    const getTabSection = (index) => {
        //상품설명
        if(index === 0){
            return (
                <div className={Style.containerGoodsDetail}>
                    {
                        props.goods.contentImages.map(image => <img className={Style.contentImage} key={image.imageUrl} src={serverImageUrl+image.imageUrl}/>)
                    }
                </div>
            )
        }
        //구매안내
        else if(index === 1){
            return (
                <div className={Style.containerGoodsPurcaseInfo}>
                    <p>
                        <b>1. 예약상품 구매란?</b><br/>
                        예약상품은 농부가 재배중인 프리미엄 상품을 미리 팔아 고품질의 농산물을 싸게 미리 살 수 있는 상품입니다.<br/>
                        Blocery에서는 이른 시점에 구매할 수록 더 싼값에 구매하여 농부들을 도우며, 생산과정을 모두 공개하여 소비자가 안전하게 믿고 살 수 있는 농산물 상품을 제공합니다.<br/><br/>

                        <b>2. 구매방법</b><br/>
                        상품의 구매 시점이 빠를수록 더 큰 할인율이 적용되며, 할인율은 상품설명 메뉴에서 확인이 가능합니다.<br/>
                        각 상품의 가격 확인 후 [즉시구매] 시 해당 가격만큼이 α-BLCT로 결제가 이루어 집니다.<br/>
                        (1α-BLCT = 20원)<br/><br/>

                        <b>3. 환불 규정</b><br/>
                        블록체인 기반의 토큰 시스템 및 예약상품의 특성상 구매(결제) 후 취소는 불가능합니다.<br/>
                        해당 구매내역은 양도거래소를 통해 다른 사용자에게 양도할 수 있습니다.<br/>
                        단, 생산자(농부)가 약속된 상품을 제공하지 못했을 경우 구매(결제)한 토큰과 함께 추가 보상토큰으로 환불 받으실 수 있습니다.<br/><br/>

                        <b>4. 배송관련</b><br/>
                        배송은 예약상품의 수확 및 출하기간 이후에 배송이 됩니다.<br/>
                        배송은 각 예상상품마다 다르며 해당 상품에 대한 배송관련 내용은 상품설명 메뉴에서 확인이 가능하오니 참고해 주시기 바랍니다.<br/><br/>
                    </p>

                </div>

            )
        }
        //재배일지
        else if(index === 2){
            return (
                <div className={Style.containerGoodsFarmDiary}>
                    {
                        props.farmDiaries.map((farmDiary, index)=>{
                            return <FarmDiaryCard key={farmDiary.imageUrl + index} {...farmDiary} />
                        })
                    }
                </div>

            )
        }
        //후기
        else if(index === 3){
            return (
                <div className={Style.containerGoodsReview}>
                    <img style={{
                        width: '100%',
                        height: '100%'
                    }}  src={customerReview} />
                </div>

            )
        }
    }

    const tabSectionData = [
        {name:'상품설명', content: getTabSection(0)},
        {name:'구매안내', content: getTabSection(1)},
        {name:'재배일지', content: getTabSection(2)},
        {name:'후기', content: getTabSection(3)}
    ]

    const images = goodsImages.map((image)=>{
        return {
            original: serverImageUrl + image.imageUrl,
            thumbnail: serverThumbnailUrl + image.imageUrl,
        }
    })

    return(
        <div className={Style.wrap}>


            {/* 상품이미지 */}
            {
                // goodsImages && <GoodsImage images={goodsImages} />
                <ImageGallery
                    showNav={true}
                    autoPlay={true}
                    showIndex={true}
                    showBullets={true}
                    showPlayButton={true}
                    showFullscreenButton={false}
                    showThumbnails={true}
                    items={images}
                />
            }

            {/* 상품정보 */}
            <div className={Style.containerGoods}>

                <div className={Style.title}>{goodsNm} {packAmount}{packUnit}</div>
                <div className={classNames(Style.price, Style.bold)}>{ComUtil.addCommas(reservationPrice)}원
                    <span className='text-danger'> {Math.round(discountRate)}% </span>
                    <small>
                        <strike>{ComUtil.addCommas(shipPrice)}</strike>
                    </small>
                </div>

                <div className={Style.space}/>

                <div className={Style.time}><TimeText date={saleEnd}/></div>
                {/*{ComUtil.utcToString(expectShippingStart)} 부터 배송시작<br/>*/}
                <div className={Style.boughtCnt}>
                    <FontAwesomeIcon icon={faStar} color={'#1697ae'} size={'lg'}/>
                    <FontAwesomeIcon icon={faStar} color={'#1697ae'} size={'lg'}/>
                    <FontAwesomeIcon icon={faStar} color={'#1697ae'} size={'lg'}/>
                    <FontAwesomeIcon icon={faStar} color={'#1697ae'} size={'lg'}/>
                    <FontAwesomeIcon icon={faStar} color={'#88c4d8'} size={'lg'}/>
                    {` ${ComUtil.addCommas(packCnt - remainedCnt)}개 구매 (잔여 ${ComUtil.addCommas(remainedCnt)}개)`}
                </div>
                <div className={Style.sharpTag}>
                    #{searchTag}
                </div>
                <div className={Style.space}/>
            </div>

            {/* 상품정보(원산지) */}
            {/*<div className='container-goods-trace'>*/}
            {/*<h6>생산자 : {`${name}(${farmName})`}</h6>*/}
            {/*<h6>생산지 : {productionArea}</h6>*/}
            {/*<h6>품목 품종 : {itemNm} {breedNm}</h6>*/}
            {/*<h6>재배방법 : {cultivationNm}</h6>*/}
            {/*<h6>생산시작 : {ComUtil.utcToString(productionStart)}</h6>*/}
            {/*<h6>예상출하시작 : {ComUtil.utcToString(expectShippingStart)}</h6>*/}
            {/*<h6>예상출하마감 : {ComUtil.utcToString(expectShippingEnd)}</h6>*/}
            {/*<h6>농약유무 : {pesticideYn === 'Y' ? '농약' : '무농약'}</h6>*/}
            {/*<h6>포장단위 : {packUnit}</h6>*/}
            {/*<h6>포장 양 : {packAmount}</h6>*/}
            {/*<h6>판매개수 : {packCnt}</h6>*/}
            {/*</div>*/}

            {/* 기본정보 */}
            <Container>
                {/*<h6>가격정보</h6>*/}
                {
                    goodsPriceInfo && (
                        <Fragment>
                            <div className={Style.goodsPriceCardWrap}>
                                <HrGoodsPriceCard data={goodsPriceInfo}/>
                            </div>
                            <br/>
                        </Fragment>
                    )
                }
                <h6>기본정보</h6>
                <table className={Style.table}>
                    <tbody>
                    <tr>
                        <td className={Style.title}>생산자</td>
                        <td>{name}</td>
                        <td className={Style.title}>생산지</td>
                        <td>{farmName}</td>
                    </tr>
                    <tr>
                        <td className={Style.title}>품목</td>
                        <td>{itemNm}</td>
                        <td className={Style.title}>품종</td>
                        <td>{breedNm}</td>
                    </tr>
                    <tr>
                        <td className={Style.title}>재배방법</td>
                        <td>{cultivationNm}</td>
                        <td className={Style.title}>농약유무</td>
                        <td>{pesticideYn}</td>
                    </tr>
                    <tr>
                        <td className={Style.title}>포장단위</td>
                        <td>{packUnit}</td>
                        <td className={Style.title}>배송방법</td>
                        <td>택배</td>
                    </tr>
                    </tbody>
                </table>
                <br/>
                <h6>생산일정</h6>
                <table className={Style.table}>
                    <tbody>
                    <tr>
                        <td className={Style.title}>판매마감</td>
                        <td >{ComUtil.utcToString(saleEnd)}</td>
                    </tr>
                    <tr>
                        <td className={Style.title}>수확시작</td>
                        <td >{ComUtil.utcToString(productionStart)}</td>
                    </tr>
                    <tr>
                        <td className={Style.title}>출하기간(예상)</td>
                        <td >{ComUtil.utcToString(expectShippingStart)} ~ {ComUtil.utcToString(expectShippingEnd)}</td>
                    </tr>
                    </tbody>
                </table>
            </Container>
            <br/>

            <TabSection items={tabSectionData}/>



            <br/>
            <br/>
            <br/>
            <div className={Style.buy}>
            {
                remainedCnt > 0 ? (
                    <Fragment>
                        <div>
                            <ModalAlert title={'알림'} content={'장바구니 기능은 GRAND OPEN 때 제공될 예정입니다'} onClick={addCart} >
                                <Button color='info' block>장바구니</Button>
                            </ModalAlert>
                        </div>
                        <div><Button color='warning' block onClick={onBuyClick}>즉시구매</Button></div>
                    </Fragment>
                ) : (
                    <div><Button color='secondary' block disabled>품절</Button></div>
                )
            }
            </div>
        </div>
    )

}
export default GoodsDetail