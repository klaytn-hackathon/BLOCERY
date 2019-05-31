import React from 'react'
import PropTypes from 'prop-types'
import Style from './FarmDiaryCard.module.scss'
import classNames from 'classnames' //여러개의 css 를 bind 하여 사용할 수 있게함
import ComUtil from '../../../util/ComUtil'

const FarmDiaryCard = (props) => {

    const truncate = (text, length) => {
        if(length)
            return text.length > length ? text.substring(0,length) + '...' : text
        return text
    }
    return(
        <div className={Style.card} onClick={props.onClick}>
            <div className={classNames(Style.date, Style.textSmall)}>{ComUtil.utcToString(props.diaryRegDate)}</div>
            <div className={classNames(Style.icon, Style.textSmall, Style.textBoldMedium)}>{props.cultivationStepNm}</div>
            <div className={Style.textWrap}>
                <div className={classNames(Style.textBoldMedium)}>{truncate(props.cultivationStepMemo, props.titleLength)}</div>
                <div className={Style.diaryContent}>{truncate(props.diaryContent, props.contentLength)}</div>
            </div>
            <img className={Style.image} src={props.imageUrl} />
        </div>
    )
}
FarmDiaryCard.propTypes = {
    cultivationStepNm: PropTypes.string.isRequired,     //오른쪽 상단 상태 글씨
    goodsNm: PropTypes.string.isRequired,  //상품명
    cultivationStepMemo: PropTypes.string,              //상태 메모
    imageUrl: PropTypes.string.isRequired,
    diaryRegDate: PropTypes.number.isRequired,       //재배일지 날짜
    titleLength: PropTypes.number,
    contentLength: PropTypes.number
}
FarmDiaryCard.defaultProps = {
}
export default FarmDiaryCard