import React from 'react'
import PropTypes from 'prop-types'
import Style from './FarmDiaryCard.module.scss'
import ComUtil from '../../../util/ComUtil'
import { Card, Button, CardImg, CardTitle, CardText, CardDeck,
    CardSubtitle, CardBody, Badge, Row, Col, CardHeader, Label, Form, FormGroup, Input } from 'reactstrap';
const ProducerFarmDiaryItemCard = (props) => {

    function onFarmDiaryClick(){
        props.onFarmDiaryClick(props)
    }
    /*
    *
diaryNo	순번
diaryRegDate	등록일자
cultivationStepNm	재배단계
cultivationStepCd	재배단계코드
cultivationStepMemo	재배단계 상세내용
diaryContent	메모
diaryImages	재배 현황 이미지
contractHash	블록체인 저장된 해시값
    *
    *
    * */

    return(
        <CardDeck>
            <Card>
                <CardBody>
                    <CardText>
                        <Badge color={props.cultivationStepCd === '1' ? 'success' : 'light'} children={'파종'}/>{' '}
                        <Badge color={props.cultivationStepCd === '2' ? 'success' : 'light'} children={'정식'}/>{' '}
                        <Badge color={props.cultivationStepCd === '3' ? 'success' : 'light'} children={'관리'}/>{' '}
                        <Badge color={props.cultivationStepCd === '4' ? 'success' : 'light'} children={'수확'}/>{' '}
                        <span className='small'>{ComUtil.utcToString(props.diaryRegDate)}</span>
                    </CardText>
                    <CardTitle onClick={onFarmDiaryClick}>
                        <Row>
                            <Col className={'text-info'}>
                                {props.cultivationStepMemo}
                            </Col>
                            {/*<Col xs={4} className={'text-right small'}>*/}
                            {/*{ComUtil.utcToString(props.diaryRegDate)}*/}
                            {/*</Col>*/}
                        </Row>
                    </CardTitle>
                    <CardText>{props.diaryContent}</CardText>
                </CardBody>
            </Card>
        </CardDeck>

    )
}
ProducerFarmDiaryItemCard.propTypes = {
    goodsNo: PropTypes.number.isRequired,
    goodsNm: PropTypes.string,
    diaryNo: PropTypes.number.isRequired,
    diaryRegDate: PropTypes.number.isRequired,  //날짜
    cultivationStepNm: PropTypes.string,	    //재배단계
    cultivationStepCd: PropTypes.string,	    //재배단계코드
    cultivationStepMemo: PropTypes.string,	    //재배단계 상세내용
    diaryContent: PropTypes.string,	            //메모
    diaryImages: PropTypes.array,	            //재배 현황 이미지
    onFarmDiaryClick: PropTypes.func.isRequired,
}
ProducerFarmDiaryItemCard.defaultProps = {
    goodsNm: '',
    cultivationStepNm: '',	    //재배단계
    cultivationStepCd: '',	    //재배단계코드
    cultivationStepMemo: '',	    //재배단계 상세내용
    diaryContent: '',	            //메모
    diaryImages: [],	            //재배 현황 이미지
}
export default ProducerFarmDiaryItemCard