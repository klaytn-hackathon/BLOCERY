import TokenGethSC from '../../../contracts/TokenGethSC';
import React, { Component, Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { Container, Input, FormGroup, Label, Button, Fade, FormFeedback, Badge} from 'reactstrap'
import { RadioButtons, ImageUploader, ModalConfirmButton, ProducerFullModalPopupWithNav } from '../../common'
import DatePicker from 'react-date-picker'
import Style from './GoodsReg.module.scss'

import { addGoods } from '../../../lib/goodsApi'
import { payProducerDeposit, payManagerDeposit, getBalanceOf } from '../../../lib/smartcontractApi'
import { exchangeWon2BLCT } from '../../../lib/exchangeApi';
import { getProducerByProducerNo } from '../../../lib/producerApi';
import { getGoodsByGoodsNo } from '../../../lib/goodsApi';
import { getLoginUser } from '../../../lib/loginApi';
import Goods from '../../../components/shop/goods/Goods'

import { ToastContainer, toast } from 'react-toastify'                              //토스트
import 'react-toastify/dist/ReactToastify.css'
import {Webview} from "../../../lib/webviewApi";
import ComUtil from '../../../util/ComUtil'
import ProducerXButtonNav from "../../common/navs/ProducerXButtonNav";

export default class GoodsReg extends Component {
    constructor(props) {
        super(props);

        // this.toggle = this.toggle.bind(this);

        // const { goodsNo } = ComUtil.getParams(this.props)
        const goodsNo = this.props.goodsNo || null

        this.state = {
            isOpen: false,
            // dropdownOpen: false,
            bindData:{
                cultivationNm: null,//재배방법
                pesticideYn: null,  //농약유무
                item: null,         //품목
                packUnit: null,     //포장단위
            },


            //등록시 사용
            goods: {
                goodsNo: goodsNo || null,
                producerNo: null,          //생산자번호
                goodsNm: '',              //상품명
                goodsImages: [],	        //상품이미지
                searchTag: '',	        //태그
                itemNo: 1,	            //품목번호
                itemNm: '',	            //품목
                breedNm: '',	            //품종
                productionArea: '',	    //생산지
                //cultivationNo: '',	    //재배방법번호
                cultivationNm: '',	    //재배방법명
                saleEnd: '',                //판매마감일
                productionStart: '',      //생산시작일
                expectShippingStart: '',  //예상출하시작일
                expectShippingEnd: '',    //예상출하마감일
                pesticideYn: '',	        //농약유무
                packUnit: 'kg',	            //포장단위
                packAmount: '',	        //포장 양
                packCnt: '',	            //판매개수
                shipPrice: '',	        //출하 후 판매가
                reservationPrice: '',	    //예약 시 판매가
                // cultivationDiary: '',	    //재배일지
                confirm: false,             //상품목록 노출 여부
                contentImages: [],          //상품설명 이미지
                totalDeposit: 0,
                remainedDeposit: 0,
                remainedCnt: 0,
                discountRate: 0,            //할인율
            },

            //밸리데이션 체크 검증
            isValidated: {
                goodsNm: false,
                breedNm: false,
                saleEnd: false,              //판매마감일
                productionStart: false,      //생산시작일
                expectShippingStart: false,  //예상출하시작일
                expectShippingEnd: false,    //예상출하마감일
                goodsImages: false,
                packAmount: false,
                packCnt: false,
                shipPrice: false,
                reservationPrice: false,
                contentImages: false,       //상품설명 이미지
            },

            loginUser: {},


        }
    }

    //input name에 사용
    names = {
        goodsNm: 'goodsNm',              //상품명
        // goodsImages: 'goodsImages',	        //상품이미지
        searchTag: 'searchTag',	        //태그
        itemNo: 'itemNo',	            //품목번호
        // itemNm: 'itemNm',	            //품목
        breedNm: 'breedNm',	                //품종
        productionArea: 'productionArea',	//생산지
        // cultivationNm: 'cultivationNm',	    //재배방법명
        saleEnd: 'saleEnd',                     //판매마감일
        productionStart: 'productionStart',      //생산시작일
        expectShippingStart: 'expectShippingStart',  //예상출하시작일
        expectShippingEnd: 'expectShippingEnd',    //예상출하마감일
        // pesticideYn: 'pesticideYn',	        //농약유무
        // packUnit: 'packUnit',	            //포장단위
        packAmount: 'packAmount',	        //포장 양
        packCnt: 'packCnt',	            //판매개수
        shipPrice: 'shipPrice',	        //출하 후 판매가
        reservationPrice: 'reservationPrice',	    //예약 시 판매가
    }

    componentWillMount() {
        this.tokenGethSC = new TokenGethSC();
        this.tokenGethSC.initContract('/BloceryTokenSC.json');
    }

    componentDidMount(){
        this.bind()


        this.setLoginUserInfo();
    }

    setLoginUserInfo = async() => {
        const loginUser = await getLoginUser();

        const state = Object.assign({}, this.state)
        state.loginUser = loginUser;
        state.goods.producerNo = loginUser.uniqueNo;
        this.setState(state)
    }

    // toggle() {
    //     this.setState(prevState => ({
    //         dropdownOpen: !prevState.dropdownOpen
    //     }));
    // }

    bind = async () => {
        //품목
        const item = [
            {itemNm:'청경채', itemNo:1},
            {itemNm:'시금치', itemNo:2},
            {itemNm:'고수', itemNo:3},
            {itemNm:'비트(근대)', itemNo:4},
            {itemNm:'바질', itemNo:5},
            {itemNm:'상추', itemNo:6},
        ]

        //재배방법
        const cultivationNm = [
            { cultivationNm:'토지'},
            { cultivationNm:'온실'},
            { cultivationNm:'수경재배'}
        ]

        //농약유무
        const pesticideYn = [
            {pesticideYn:'유기농'},
            {pesticideYn:'무농약'},
            {pesticideYn:'농약사용'},
        ]

        const packUnit = [
            {packUnit:'kg'},
            {packUnit:'g'},
            {packUnit:'근'},
        ]

        this.setState({
            bindData:{
                item: item,                     //품목
                cultivationNm: cultivationNm,   //재배방법
                pesticideYn: pesticideYn,       //농약유무
                packUnit: packUnit,             //포장단위
            }
        }, this.search)
    }
    search = async () => {
        if(!this.state.goods.goodsNo)
            return

        const {data:goods} = await getGoodsByGoodsNo(this.state.goods.goodsNo)

        this.setState({
            goods
        })
    }

    //대표상품 이미지
    onGoodsImageChange = (images) => {
        const state = Object.assign({}, this.state)
        state.goods.goodsImages = images

        //validation 체크
        state.isValidated.goodsImages = images.length > 0
        // state.validationCnt = this.getValidationCnt()

        this.setState(state)
    }
    //상품설명 이미지
    onContentImageChange = (images) => {
        const state = Object.assign({}, this.state)
        state.goods.contentImages = images

        //validation 체크
        state.isValidated.contentImages = images.length > 0
        // state.validationCnt = this.getValidationCnt()

        this.setState(state)
    }

    //품목
    onItemClick = ({itemNo, itemNm}) => {
        console.log(itemNm)
        const state = Object.assign({}, this.state)
        state.goods.itemNo = itemNo
        state.goods.itemNm = itemNm
        this.setState(state)
    }

    //재배방법
    onCultivationNmClick = ({cultivationNm}) => {
        const state = Object.assign({}, this.state)
        state.goods.cultivationNm = cultivationNm
        this.setState(state)
    }

    //농약유무
    onPesticideYnClick  = ({pesticideYn}) => {
        const state = Object.assign({}, this.state)
        state.goods.pesticideYn = pesticideYn
        this.setState(state)
    }
    //포장단위
    onPackUnitClick = ({packUnit}) => {
        const state = Object.assign({}, this.state)
        state.goods.packUnit = packUnit
        this.setState(state)
    }
    //달력
    onCalendarChange = (name, date)=> {
        const state = Object.assign({}, this.state)
        state.goods[name] = date

        //validation 체크용
        state.isValidated[name] = date !== null
        // state.validationCnt = this.getValidationCnt()

        this.setState(state)
    }

    //인풋박스
    onInputChange = (e) => {
        const el = e.target
        const state = Object.assign({}, this.state)
        state.goods[el.name] = el.value

        //validation 체크용
        const valStatus = this.checkValidation(e)
        state.isValidated[el.name] = valStatus
        // state.validationCnt = this.getValidationCnt()


        this.setState(state)
    }

    //밸리데이션 체크를 모두 했는지 검증
    checkValidation = (e) => {
        const hasValidKey = Object.keys(this.state.isValidated).some(key=>key === e.target.name)
        return hasValidKey ? e.target.value.trim() !== '' : true
    }

    //임시저장
    onAddTempGoodsClick = async (e) => {
        const goods = Object.assign({}, this.state.goods)

        if(goods.goodsNm.length <= 0){
            this.notify('상품명은 필수 입니다', toast.error)
            return
        }


        this.save(goods)

    }

    //상품노출
    onAddGoodsClick = async (isConfirm, e) => {

        // if(!this.canConfirm()){
        //     this.notify('필수입력이 모두 되어야 노출 가능힙니다', toast.error)
        //     return
        // }

        // if(window.confirm(['상품을 등록 하시겠습니까? 앞으로 수정 및 삭제가 불가능 합니다!'])){

        if(!isConfirm) return

        // 위약금 토큰 납부
        let saveContract = true;
        let depositToken = exchangeWon2BLCT(this.state.goods.totalDeposit);

        // let loginInfo = await getLoginUser();
        let producer = await getProducerByProducerNo(this.state.loginUser.uniqueNo);
        if(producer.data.selfDeposit) {
            let balance = await getBalanceOf(this.tokenGethSC, this.state.loginUser.account);
            if(balance < depositToken) {
                // TODO 토큰 구매페이지 이동 필요
                saveContract = false;
                alert('토큰이 부족합니다. 토큰추가구매는 베타버전에서 제공예정입니다.');
            }
        }

        if(saveContract) {
            // TODO 토큰지급이 실패하면 어떻게 해야할지 대책 필요함. (이미 UI에는 수정 불가 안내메시지가 노출되었음)
            this.payDepositToken(producer.data.selfDeposit, depositToken);

            const goods = Object.assign({}, this.state.goods)
            goods.confirm = true //상품목록에 노출
            console.log(goods)
            this.save(goods)
        }
        // }
    }
    getDiscountRate = (goods) => {
        return (100 - ((goods.reservationPrice / goods.shipPrice) * 100)) || 0
    }

    //저장
    save = async (goods) => {

        goods.discountRate = this.getDiscountRate(goods)    //할인율 계산

        //위약금 remainedCnt추가
        //TODO 위약금 계산로직 개선필요 - 현재는 그냥 비례식
        goods.totalDeposit = goods.shipPrice * goods.packCnt * 0.2;
        goods.remainedDeposit = goods.totalDeposit;
        goods.remainedCnt = goods.packCnt;

        const request = await addGoods(goods)
        if(request.status !== 200) alert('등록이 실패 하였습니다')
        else{
            this.notify('저장되었습니다', toast.success)
            goods.goodsNo = request.data
            this.setState({
                goods: goods
            })
        }
    }

    payDepositToken = async(selfDeposit, depositToken) => {
        console.log('goodsNo : ', this.state.goods.goodsNo, ', depositToken : ', depositToken)
        if(!selfDeposit) {
            await payManagerDeposit(this.tokenGethSC, this.state.goods.goodsNo, depositToken);
        } else {
            await payProducerDeposit(this.tokenGethSC, this.state.goods.goodsNo, depositToken);
        }
    }

    // onInputBlur = (e) => {
    //     const status = e.target.value.replace('', '').length > 0
    //     const valid = Object.assign({}, this.state.valid)
    //     valid[e.target.name] = status
    //
    //     this.setState({
    //         valid:valid
    //     })
    // }

    //상품노출 가능여부
    canConfirm = () => {
        const isValidated = this.state.isValidated
        let isFailed = Object.keys(isValidated).some(key=>isValidated[key] === false)
        return !isFailed
    }

    getValidationCnt = () => {
        let cnt = 0
        Object.keys(this.state.isValidated).map(key=>{
            if(!this.state.isValidated[key])
                cnt++
        })

        return cnt
    }

    //react-toastify
    notify = (msg, toastFunc) => {
        toastFunc(msg, {
            position: toast.POSITION.TOP_RIGHT
            //className: ''     //클래스를 넣어도 됩니다
        })
    }

    onConfirm = (isConfirm) => {
        if(isConfirm)
            this.onAddGoodsClick()
    }
    //미리보기
    onPreviewClick = () => {
        this.toggle()
    }
    //만약 모달 창 닫기를 강제로 하려면 아래처럼 넘기면 됩니다
    onPreviewClose = () => {
        this.toggle()
    }
    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }
    render() {

        const {
            goodsNm,              //상품명
            goodsImages,
            searchTag,	        //태그
            breedNm,	            //품종
            productionArea,	    //생산지
            saleEnd,              //판매마감일
            productionStart,      //생산시작일
            expectShippingStart,  //예상출하시작일
            expectShippingEnd,    //예상출하마감일
            packAmount,	        //포장 양
            packCnt,	            //판매개수
            shipPrice,	        //출하 후 판매가
            reservationPrice,	    //예약 시 판매가
        } = this.state.goods

        console.log('render:', expectShippingEnd)

        const star = <span className='text-danger'>*</span>
        //const validationCnt = this.getValidationCnt()


        return(
            <div className={Style.wrap}>
                {/*<ProducerXButtonNav name={'상품등록'} onClose={this.props.onClose}/>*/}
                {
                    this.state.validationCnt > 0 && (
                        <div className={Style.badge}>
                            <Badge color="danger" pill>필수{this.state.validationCnt}</Badge>
                        </div>
                    )
                }
                {/*<div>*/}
                {/*<NavLink className={'text-info'} to={'/producer/goodsList'} >상품목록</NavLink>*/}
                {/*<NavLink className={'text-info'} to={'/producer/goodsReg'} >상품등록</NavLink>*/}
                {/*<NavLink className={'text-info'} to={'/producer/orderList'} >주문목록</NavLink>*/}
                {/*</div>*/}

                <Container fluid>
                    <FormGroup>
                        <Label>대표상품 이미지</Label>
                        <ImageUploader onChange={this.onGoodsImageChange} multiple={true} limit={10}/>
                        { <Fade in={this.state.goods.goodsImages.length <= 0} className="text-danger" >이미지는 최소 1장이상 필요합니다</Fade> }
                    </FormGroup>
                    <hr/>
                    <FormGroup>
                        <Label>상품설명 이미지</Label>
                        <ImageUploader onChange={this.onContentImageChange} multiple={true} limit={10}/>
                        { <Fade in={this.state.goods.contentImages.length <= 0} className="text-danger" >이미지는 최소 1장이상 필요합니다</Fade> }
                    </FormGroup>
                    <hr/>
                    <FormGroup>
                        <Label>상품명{star}</Label>
                        <Input valid={this.state.isValidated.goodsNm} invalid={!this.state.isValidated.goodsNm} name={this.names.goodsNm} value={goodsNm} onChange={this.onInputChange} />
                        <FormFeedback invalid>필수 입력값입니다</FormFeedback>
                        {/*<FormFeedback valid>성공!</FormFeedback>*/}
                    </FormGroup>
                    <FormGroup>
                        <Label>태그</Label>
                        <Input name={this.names.searchTag} value={searchTag} onChange={this.onInputChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>품목{star}</Label>
                        <RadioButtons nameField='itemNm' data={this.state.bindData.item || []} onClick={this.onItemClick} />
                    </FormGroup>
                    <FormGroup>
                        <Label>품종{star}</Label>
                        <Input valid={this.state.isValidated.breedNm} invalid={!this.state.isValidated.breedNm} name='breedNm' value={breedNm} onChange={this.onInputChange}/>
                        <FormFeedback invalid>필수 입력값입니다</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Label>생산지{star}</Label>
                        <Input valid={this.state.isValidated.productionArea} invalid={!this.state.isValidated.productionArea} name={this.names.productionArea} value={productionArea} placeholder='ex)전남 여수' onChange={this.onInputChange} />
                        <FormFeedback invalid>필수 입력값입니다</FormFeedback>
                        {/*<FormFeedback valid>성공!</FormFeedback>*/}
                    </FormGroup>
                    <FormGroup>
                        <Label>재배방법</Label>
                        <RadioButtons nameField='cultivationNm' defaultIndex={0} data={this.state.bindData.cultivationNm || []} onClick={this.onCultivationNmClick} />
                    </FormGroup>
                    <FormGroup>
                        <Label>판매마감일{star}</Label>
                        <div>
                            <DatePicker
                                onChange={this.onCalendarChange.bind(this, this.names.saleEnd)}
                                value={saleEnd}
                            />
                            <FormFeedback invalid>필수 입력값입니다</FormFeedback>
                            { <Fade in={!this.state.goods.saleEnd} className="text-danger">날짜는 필수입니다</Fade> }
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label>생산시작일{star}</Label>
                        <div>
                            <DatePicker
                                onChange={this.onCalendarChange.bind(this, this.names.productionStart)}
                                value={productionStart}
                            />
                            <FormFeedback invalid>필수 입력값입니다</FormFeedback>
                            { <Fade in={!this.state.goods.productionStart} className="text-danger">날짜는 필수입니다</Fade> }
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label>예상출하시작일{star}</Label>
                        <div>
                            <DatePicker
                                onChange={this.onCalendarChange.bind(this, this.names.expectShippingStart)}
                                value={expectShippingStart}
                            />
                            { <Fade in={!this.state.goods.expectShippingStart} className="text-danger">날짜는 필수입니다</Fade> }
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label>예상출하마감일{star}</Label>
                        <div>
                            <DatePicker
                                onChange={this.onCalendarChange.bind(this, this.names.expectShippingEnd)}
                                value={expectShippingEnd}
                            />
                            { <Fade in={!this.state.goods.expectShippingEnd} className="text-danger">날짜는 필수입니다</Fade> }
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label>농약유무</Label>
                        <RadioButtons nameField='pesticideYn' defaultIndex={0} data={this.state.bindData.pesticideYn || []} onClick={this.onPesticideYnClick} />
                    </FormGroup>
                    <FormGroup>
                        <Label>포장단위{star}</Label>
                        <RadioButtons nameField='packUnit' defaultIndex={0} data={this.state.bindData.packUnit || []} onClick={this.onPackUnitClick} />
                    </FormGroup>
                    <FormGroup>
                        <Label>포장 양{star}</Label>
                        <Input valid={this.state.isValidated.packAmount} invalid={!this.state.isValidated.packAmount} name={this.names.packAmount} value={packAmount} onChange={this.onInputChange} type={'number'}/>
                        <FormFeedback invalid>필수(숫자) 입력값입니다</FormFeedback>
                        {/*<FormFeedback valid>성공!</FormFeedback>*/}
                    </FormGroup>
                    <FormGroup>
                        <Label>판매개수{star}</Label>
                        <Input valid={this.state.isValidated.packCnt} invalid={!this.state.isValidated.packCnt} name={this.names.packCnt} value={packCnt} onChange={this.onInputChange} type={'number'}/>
                        <FormFeedback invalid>필수(숫자) 입력값입니다</FormFeedback>
                        {/*<FormFeedback valid>성공!</FormFeedback>*/}
                    </FormGroup>
                    <FormGroup>
                        <Label>예약 시 판매가{star}</Label>
                        <Input valid={this.state.isValidated.reservationPrice} invalid={!this.state.isValidated.reservationPrice} name={this.names.reservationPrice} value={reservationPrice} onChange={this.onInputChange} type={'number'}/>
                        <FormFeedback invalid>필수(숫자) 입력값입니다</FormFeedback>
                        {/*<FormFeedback valid>성공!</FormFeedback>*/}
                    </FormGroup>
                    <FormGroup>
                        <Label>출하 후 판매가{star}</Label>
                        <Input valid={this.state.isValidated.shipPrice} invalid={!this.state.isValidated.shipPrice} name={this.names.shipPrice} value={shipPrice} onChange={this.onInputChange} type={'number'}/>
                        <FormFeedback invalid>필수(숫자) 입력값입니다</FormFeedback>
                        {/*<FormFeedback valid>성공!</FormFeedback>*/}
                    </FormGroup>
                    {/*<FormGroup>*/}
                    {/*<Label>재배일지xxx</Label>*/}
                    {/*<Input/>*/}
                    {/*</FormGroup>*/}
                </Container>
                <footer className={Style.footer}>

                    {
                        !this.state.goods.confirm && <Button onClick={this.onAddTempGoodsClick} color='warning'>상품저장</Button>
                    }
                    {
                        // this.state.goods.goodsNo && !this.state.goods.confirm && <Button onClick={this.onAddGoodsClick} color='danger'>상품노출</Button>
                        this.state.goods.goodsNo && !this.state.goods.confirm && this.getValidationCnt() === 0 && <ModalConfirmButton color={'danger'} title={'상품을 등록 하시겠습니까?'} content={'앞으로 수정 및 삭제가 불가능 합니다!'} onClick={this.onAddGoodsClick}>상품노출</ModalConfirmButton>
                    }
                    {
                        this.state.goods.confirm && '상품이 노출되어 수정/삭제 불가능 합니다'
                    }
                    {
                        this.state.goods.goodsNo && <Button onClick={this.onPreviewClick} >미리보기</Button>
                    }
                </footer>
                <ToastContainer />  {/* toast 가 그려질 컨테이너 */}
                <ProducerFullModalPopupWithNav show={this.state.isOpen} title={'상품미리보기'} onClose={this.onPreviewClose}>
                    <Goods goodsNo={this.state.goods.goodsNo} />
                </ProducerFullModalPopupWithNav>
            </div>
        )
    }
}
