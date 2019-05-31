import axios from 'axios'
import { Server } from "../components/Properties";

//전체 생산자 상품 중 최신 재배일지 조회
export const getFarmDiaryNewest = () => axios(Server.getRestAPIHost() + '/farmDiary/newest', { method: "get", withCredentials: true, credentials: 'same-origin' })

//전체 생산자 상품 중 전체 재배일지 조회
export const getFarmDiary = () => axios(Server.getRestAPIHost() + '/farmDiary', { method: "get", withCredentials: true, credentials: 'same-origin' })