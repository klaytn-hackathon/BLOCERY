import React from 'react'
const EventPopup = () => {
    const setNoPupup = (e) => {
        e.target.checked ? localStorage.setItem('eventNewPopup', e.target.checked) : localStorage.removeItem('eventNewPopup')
    }
    return (
        <div>
            프리미엄 상품구매 이벤트가 <b className='text-danger'>6/3일</b> 오후부터 시작됩니다. 아래절차에 따라 <b className='text-info'>신규가입 및 재가입</b> 후 참여해주세요<br/><br/>
            ① 하단 <b className='text-info'>마이페이지</b> 선택<br/>
            ② <b className='text-info'>로그인-소비자회원가입</b>에서 신규 회원가입<br/>
            ③ 상품 <b className='text-info'>예약구매</b> 후 <b className='text-info'>이벤트 상품(팜토리 채소) 수령</b> <br/>
            [시럽 토큰뱅크 회원]<br/>
            ④ 마이페이지 <b className='text-info'>주문번호</b>를 <b className='text-info'>시럽 토큰뱅크</b>에 기록하기<br/>
            ⑤ 추첨을 통해 <b className='text-info'>토큰 지급</b><br/>
            <br/>
            <label>
                <input
                    name="isGoing"
                    type="checkbox"
                    // checked={this.state.isGoing}
                    onChange={setNoPupup}
                />
                {' '}지금부터 이창을 보지않음
            </label>
        </div>
    )
}

export default EventPopup