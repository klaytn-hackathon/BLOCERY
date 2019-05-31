import axios from 'axios'
import { Server } from "../components/Properties";


export const getGoods = () => axios(Server.getRestAPIHost() + '/goods', { method: "get", withCredentials: true, credentials: 'same-origin' })
export const getGoodsByGoodsNo = (goodsNo) => axios(Server.getRestAPIHost() + '/goods/goodsNo', { method: "get", params:{ goodsNo: goodsNo }, withCredentials: true, credentials: 'same-origin' })
export const getGoodsByConfirm = (confirm, sorter) => axios(Server.getRestAPIHost() + '/goods/confirm', { method: "post", params:{confirm:confirm}, data:sorter,  withCredentials: true, credentials: 'same-origin'})
export const getProducerGoods = () => axios(Server.getRestAPIHost() + '/goods/producerGoods', { method: "get", withCredentials: true, credentials: 'same-origin' })

//상품 등록 | 수정 - 주로 등록으로 사용요망
export const addGoods = (goods) => axios(Server.getRestAPIHost() + '/goods', { method: "post", data: goods, withCredentials: true, credentials: 'same-origin' })

//상품 - 남은수량위약금 수정.
export const updateGoodsRemained = (goods) => axios(Server.getRestAPIHost() + '/goods/remained', { method: "put", data: goods, withCredentials: true, credentials: 'same-origin' })
