import React, { Component } from 'react'
import Style from './DiaryReg.module.scss'
import { Container, FormGroup, Label, FormText } from 'reactstrap'
import { RadioButtons, ImageUploader, FormGroupInput, FooterButtons } from '../../common'
import DatePicker from 'react-date-picker'
import { ToastContainer, toast } from 'react-toastify'                              //토스트
import 'react-toastify/dist/ReactToastify.css'
import { addCultivationDiary, updCultivationDiary } from '../../../lib/producerApi'
import ComUtil from '../../../util/ComUtil'

export default class DiaryReg extends Component{
    constructor(props){
        super(props)

        //쿼리스트링 파싱
        // const params = ComUtil.getParams(this.props)
        const { goodsNo, diaryNo } = this.props

        this.state = {
            bindData: {
                cultivationStep: null  //면적단위
            },
            goodsNo: goodsNo,                    //조회 화면에서 받아야 할 상품번호
            //등록 시 사용
            data: {
                diaryNo: diaryNo,	            //순번 (diaryNo 가 null 일 경우 신규 재배일지 등록, 값이 있을 경우 업데이트)
                diaryRegDate: diaryNo || new Date(),	        //등록일자
                diaryImages: [],	        //재배 현황 이미지
                cultivationStepNm: '파종단계',	//재배단계
                cultivationStepCd: '1',	    //재배단계 코드
                cultivationStepMemo: '',	//재배단계 상세내용
                diaryContent: '',	        //메모
                contractHash: '',	        //블록체인 저장된 해시값
            }
        }
    }

    name = {
        diaryNo: 'diaryNo',	                        //순번
        diaryRegDate: 'diaryRegDate',	            //등록일자
        diaryImages: 'diaryImages',	                //재배 현황 이미지
        cultivationStepNm: 'cultivationStepNm',	    //재배단계
        cultivationStepCd: 'cultivationStepCd',	    //재배단계코드
        cultivationStepMemo: 'cultivationStepMemo',	//재배단계 상세내용
        diaryContent: 'diaryContent',	            //메모
        contractHash: 'contractHash',	            //블록체인 저장된 해시값

    }
    star = <span className='text-danger'>*</span>



    //react-toastify
    notify = (msg, toastFunc) => {
        toastFunc(msg, {
            position: toast.POSITION.TOP_RIGHT
            //className: ''     //클래스를 넣어도 됩니다
        })
    }

    componentDidMount(){
        //TODO 추후 await 처리 필요
        this.searchBindData()

        this.search()
    }

    // 기초데이터 조회
    searchBindData = () => {
        //면적단위
        const cultivationStep = [
            {cultivationStepNm:'파종단계',cultivationStepCd:1},
            {cultivationStepNm:'발아단계',cultivationStepCd:2},
            {cultivationStepNm:'정식단계',cultivationStepCd:3},
            {cultivationStepNm:'수확단계',cultivationStepCd:4},
        ]

        this.setState({
            bindData: {
                cultivationStep: cultivationStep
            }
        })
    }

    // 상품 조회
    search = () => {
        //TODO 목록에서 받은 goodsNo 로 MongoDB 조회
    }
    //등록 | 수정
    save = async () => {

        const checkData = this.state.data
        const validArr = [
            {key: this.name.diaryRegDate, msg: '날짜'},
            {key: this.name.diaryImages, msg: '작물현황 이미지'},
            {key: this.name.cultivationStepMemo, msg: '재배단계 상세내용'}
        ]

        const resultData = ComUtil.validate(checkData, validArr)

        if(!resultData.result)
            return

        const diaryNo = this.state.data.diaryNo

        const goods = {
            goodsNo: this.state.goodsNo,
            cultivationDiaries: [this.state.data]
        }

        const response = diaryNo ? await updCultivationDiary(goods) : await addCultivationDiary(goods)

        this.notify('저장되었습니다', toast.success)

    }

    //달력
    onCalendarChange = (name, date)=> {

        const state = Object.assign({}, this.state)

        // const data = Object.assign({}, this.state.data)

        state.data[name] = date


        this.setState(state)
    }

    //작물현황 이미지
    onDiaryImageChange = (images) => {
        const data = Object.assign({}, this.state.data)
        data.diaryImages = images
        this.setState({
            data: data
        })
    }
    //재배단계
    onCultivationStepClick = (data) => {
        const state = Object.assign({}, this.state)
        state.data.cultivationStepNm = data.cultivationStepNm
        state.data.cultivationStepCd = data.cultivationStepCd
        this.setState(state)
    }
    //재배단계 메모
    onInputChange = (e) => {
        const data = Object.assign({}, this.state.data)
        data[e.target.name] = e.target.value
        this.setState({
            data: data
        })
        // this.setState({
        //     ...this.state,
        //     data: {
        //         [e.target.name]: e.target.value
        //     }
        // })
    }
    //저장
    onBtnSaveClick = (e) => {
        this.save()
    }
    // //목록
    // onBtnListClick = (e) => {
    //     console.log(e)
    // }

    render(){
        return(
            <div className={Style.wrap}>
                <Container>
                    <FormGroup>
                        <Label>날짜{this.star}</Label>
                        <div>
                            <DatePicker
                                onChange={this.onCalendarChange.bind(this, this.name.diaryRegDate)}
                                value={this.state.data.diaryRegDate}
                            />
                            <FormText>{'재배일지의 날짜를 선택해 주세요'}</FormText>
                        </div>
                    </FormGroup>
                    <hr/>
                    <FormGroup>
                        <Label>작물현황 이미지{this.star}</Label>
                        <ImageUploader onChange={this.onDiaryImageChange} multiple={true} limit={10}/>
                        <FormText>이미지는 1장이상 등록해야 합니다</FormText>
                    </FormGroup>
                    <hr/>
                    <FormGroup>
                        <Label>재배단계{this.star}</Label>
                        <RadioButtons nameField={this.name.cultivationStepNm} data={this.state.bindData.cultivationStep || []} onClick={this.onCultivationStepClick} />
                    </FormGroup>
                    <FormGroupInput
                        title={'재배단계 상세내용'}
                        name={this.name.cultivationStepMemo}
                        value={this.state.data.cultivationStepMemo}
                        explain={'파종준비 및 소독, 벌목, 종자준비, 비닐작업 등..'}
                        isRequired
                        onChange={this.onInputChange}
                    />
                    <FormGroupInput
                        title={'메모'}
                        name={this.name.diaryContent}
                        value={this.state.data.diaryContent}
                        explain={'간단한 메모입니다'}
                        onChange={this.onInputChange}
                    />
                </Container>
                <FooterButtons data={[
                    // {title:'목록', onClick:this.onBtnListClick, color:'info'},
                    {title:'저장', onClick:this.onBtnSaveClick, color:'warning'},
                    ]}
                />
                <ToastContainer />  {/* toast 가 그려질 컨테이너 */}


            </div>
        )
    }
}