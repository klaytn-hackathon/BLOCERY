import axios from 'axios'
import { Server } from "../components/Properties";


export const getGoods = () => axios(Server.getRestAPIHost() + '/goods', { method: "get", withCredentials: true, credentials: 'same-origin' })
export const getGoodsByGoodsNo = (goodsNo) => axios(Server.getRestAPIHost() + '/goods/goodsNo', { method: "get", params:{ goodsNo: goodsNo }, withCredentials: true, credentials: 'same-origin' })
