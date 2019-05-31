import axios from 'axios'
import { Server } from "../components/Properties";

// export const getFarmDiary = () => {
//     return [
//         {src:'http://localhost:8080/thumbnails/1a8mxPOk1gej.jpg', itemCd: '01', itemNm: '배추', title: '물을 듬뿍 주었어요'},
//         {src:'http://localhost:8080/thumbnails/BYh38iFpyNpN.jpeg', itemCd: '01', itemNm: '배추', title: '무럭무럭~'},
//         {src:'http://localhost:8080/thumbnails/iYPH172GOXHb.jpeg', itemCd: '01', itemNm: '무', title: '새싹이 돋았습니다'},
//         {src:'http://localhost:8080/thumbnails/Ke5jcD72uqmn.jpg', itemCd: '01', itemNm: '무', title: '꽃이 피었어요'},
//         {src:'http://localhost:8080/thumbnails/KOZSl1c3D6VU.jpeg', itemCd: '01', itemNm: '무', title: '날씨가 좋아서 잘 자라고있어요'},
//         {src:'http://localhost:8080/thumbnails/pc6TsQjg6ei1.jpg', itemCd: '01', itemNm: '시금치', title: '무농약 인증'},
//         {src:'http://localhost:8080/thumbnails/rxE35Z7pRC2l.jpg', itemCd: '01', itemNm: '사과', title: '보이시나요?'},
//         {src:'http://localhost:8080/thumbnails/tjYTBL7W6JhG.jpg', itemCd: '01', itemNm: '배추', title: '현재까지 당도가 상당히 높아요'},
//         {src:'http://localhost:8080/thumbnails/ts9cgzVLshSK.jpg', itemCd: '01', itemNm: '배추', title: '물을 듬뿍 주었어요'},
//         {src:'http://localhost:8080/thumbnails/uLZJlqaEOoWK.jpg', itemCd: '01', itemNm: '배추', title: '물을 듬뿍 주었어요'}
//     ]
// }

// 생산자 등록
export const addProducer = (data) => axios(Server.getRestAPIHost() + '/producer', { method: "post", data: data, withCredentials: true, credentials: 'same-origin' })
// 로그인한 생산자  조회
export const getProducer = () => axios(Server.getRestAPIHost() + '/producer', { method: "get", withCredentials: true, credentials: 'same-origin' })
// 생산자 조회
export const getProducerByProducerNo = (producerNo) => axios(Server.getRestAPIHost() + '/producer/producerNo', { method: "get", params: {producerNo: producerNo}, withCredentials: true, credentials: 'same-origin' })
// 생산자 이메일 조회
export const getProducerEmail = (email) => axios(Server.getRestAPIHost() + '/findProducerEmail', { method: "get", withCredentials: true, credentials: 'same-origin', params: { email: email} })

//재배일지 등록
export const addCultivationDiary = (goods) => axios(Server.getRestAPIHost() + '/producer/cultivationDiary', { method: "post", data: goods, withCredentials: true, credentials: 'same-origin' })

//재배일지 수정
export const updCultivationDiary = (goods) => axios(Server.getRestAPIHost() + '/producer/cultivationDiary', { method: "put", data: goods, withCredentials: true, credentials: 'same-origin' })

// 생산자번호로 주문목록 조회
export const getOrderByProducerNo = () => axios(Server.getRestAPIHost() + '/producer/orderByProducerNo', { method: "get", withCredentials: true, credentials: 'same-origin' })

//주문정보 업데이트
export const updOrder = (order) => axios(Server.getRestAPIHost() + '/producer/order', { method: "put", data: order, withCredentials: true, credentials: 'same-origin' })
