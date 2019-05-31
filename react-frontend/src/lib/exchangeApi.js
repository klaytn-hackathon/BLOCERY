import axios from 'axios'
import { Server } from '../components/Properties'
import ComUtil from '../util/ComUtil'

/* 향후 환전관련 추가예정 */

export const BLCT_TO_WON = 20; //won
/**
 * @param 원
 * @returns BLCT
 */
export const exchangeWon2BLCTComma = (won) =>  {return ComUtil.addCommas(Math.floor(won/BLCT_TO_WON));} //BLCT 리턴
export const exchangeWon2BLCT = (won) =>  {return Math.floor(won/BLCT_TO_WON);} //BLCT 리턴
