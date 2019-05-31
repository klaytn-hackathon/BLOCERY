import axios from 'axios'
import { Server } from "../components/Properties";

// 택배회사 리스트 조회
export const getTransportCompanies = () => axios('https://info.sweettracker.co.kr/api/v1/companylist?t_key=s7yjimif8thEQzJVslFs0Q', { method: "get", withCredentials: true, credentials: 'same-origin'})

// 택배회사 리스트 조회
export const getDeliverTrace = (companyCode, invoice) => axios(`https://info.sweettracker.co.kr/api/v1/trackingInfo?t_key=s7yjimif8thEQzJVslFs0Q&t_code=${companyCode}&t_invoice=${invoice}`, { method: "get", withCredentials: true, credentials: 'same-origin'})



// 배송조회
// export const addConsumer = (data) => axios(Server.getRestAPIHost() + '/consumer', { method: "post", data: data, withCredentials: true, credentials: 'same-origin' })


