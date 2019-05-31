import axios from 'axios'
import { Server } from "../components/Properties";

// 소비자 회원가입
export const addConsumer = (data) => axios(Server.getRestAPIHost() + '/consumer', { method: "post", data: data, withCredentials: true, credentials: 'same-origin' })
// 소비자 중복이메일 체크
export const getConsumerEmail = (email) => axios(Server.getRestAPIHost() + '/findConsumerEmail', { method: "get", withCredentials: true, credentials: 'same-origin', params: { email: email} })
// 소비자 정보 찾기
export const getConsumer = () => axios(Server.getRestAPIHost() + '/consumer', { method: "get", withCredentials: true, credentials: 'same-origin' })

// 소비자 정보 조회(consumerNo로)
export const getConsumerByConsumerNo = (consumerNo) => axios(Server.getRestAPIHost() + '/consumer/consumerNo', { method: "get", params: {consumerNo: consumerNo}, withCredentials: true, credentials: 'same-origin' })

export const addOrder = (data) => axios(Server.getRestAPIHost() + '/order', { method: "post", data: data, withCredentials: true, credentials: 'same-origin' })

// 주문정보 조회
export const getOrderByOrderNo = (orderNo) => axios(Server.getRestAPIHost() + '/order', { method: "get", params: { orderNo: orderNo} , withCredentials: true, credentials: 'same-origin' })

// 주문 - 배송지정보 수정
export const updateDeliverInfo = (data) => axios(Server.getRestAPIHost() + '/deliverInfo', { method: "put", data:data, withCredentials: true, credentials: 'same=origin' })

// 주문 - 소비자 구매확정 날짜 저장
export const updateConsumerOkDate = (data) => axios(Server.getRestAPIHost() + '/consumerOk', { method: "put", data:data, withCredentials: true, credentials: 'same=origin' })

// 소비자별 주문정보 조회
export const getOrderByConsumerNo = (consumerNo) => axios(Server.getRestAPIHost() + '/orderByConsumerNo', { method: "get", params: { consumerNo: consumerNo} , withCredentials: true, credentials: 'same-origin' })
