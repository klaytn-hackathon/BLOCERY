import React, { Component } from 'react';
import TokenGethSC from '../contracts/TokenGethSC';

import { getUserEther, getBalanceOf, initUserToken, buyProducerToken, payProducerDeposit, payManagerDeposit, getManagerTotalDeposit, getGoodsDepositInfo,
    orderGoods, finishDelivery, rewardCustomerNotDelivery, returnDepositFinal, getManagerTotalPurchase, getGoodsTotalPaidDeposit, getOrderInfo,
    getGoodsRemainDeposit, getOrderTokenHistory } from "../lib/smartcontractApi";

export default class TokenTest extends Component {

    componentWillMount() {
        this.tokenGethSC = new TokenGethSC();
        this.tokenGethSC.initContract('/BloceryTokenSC.json');
    }

    // 사용자 이더받기
    onCheckEther = async () => {
        await getUserEther(this.tokenGethSC);
    };

    // 관리자가 사용자에게 토큰 지급하기 (test page 용)
    onGiveUserToken = async() => {
        await this.tokenGethSC.giveUserToken(this.giveUserAddress.value, this.giveUserAmount.value);
    }

    // 회원가입시 토큰 지급
    onInitUserToken = async () => {
        let manager = '0x49db1cf1e722c4088f638b7cb1c1a88db8fec2ea';
        let result = await initUserToken(this.tokenGethSC, manager, this.initUserAddress.value, this.initUserAmount.value);
        console.log('onInitUserToken front : ', result);
    };

    // 생산자 토큰 추가구입
    onBuyProducerToken = async () => {
        let result = await buyProducerToken(this.tokenGethSC, this.buyTokenAmount.value);
        console.log('onBuyProducerToken front : ', result);
    };

    // 생산자 위약금 납부
    onPayProducerDeposit = async () => {
        let result = await payProducerDeposit(this.tokenGethSC, this.payProducerDepositProdNo.value, this.payProducerDepositAmount.value);
        console.log('onPayProducerDeposit front : ', result);
    };

    // 관리자 위약금 납부
    onPayManagerDeposit = async () => {
        await payManagerDeposit(this.tokenGethSC, this.payManagerDepositProdNo.value, this.payManagerDepositAmount.value);
    };

    // 물품 주문
    onOrderGoods = async () => {
        let result = await orderGoods(this.tokenGethSC, this.orderGoodsOrderNo.value, this.orderGoodsProducer.value, this.orderGoodsgoodsNo.value,
            this.orderGoodsPrice.value, this.orderGoodsDeposit.value, this.orderGoodsFee.value, this.orderGoodsReward.value);
        console.log('onOrderGoods front : ', result);
    };

    // 배송완료(정산)
    onFinishDelivery = async () => {
        let result = await finishDelivery(this.tokenGethSC, this.finishDeliveryOrderNo.value, this.finishDeliveryPenalty.value);
        console.log('onFinishDelivery front : ', result);
    };

    // 배송안될시 고객보상
    onRewardCustomerNotDelivery = async () => {
        let result = await rewardCustomerNotDelivery(this.tokenGethSC, this.rewardCustomerOrderNo.value, this.rewardCustomergoodsNo.value);
        console.log('onRewardCustomerNotDelivery front : ', result);
    };

    // 모든 정산 후 남은 위약금 환불
    onReturnDepositFinal = async () => {
        let result = await returnDepositFinal(this.tokenGethSC, this.returnDepositgoodsNo.value);
        console.log('onReturnDepositFinal front : ', result);
    };

    // 매니저에게 적립왼 총 위약금 조회
    onGetManagerTotalDeposit = async () => {
        let result = await getManagerTotalDeposit(this.tokenGethSC);
        console.log('Page Result : ', result);
    };

    // 매니저에게 적립된 총 물품구매금액 조회
    onGetManagerTotalPurchase = async () => {
        let result = await getManagerTotalPurchase(this.tokenGethSC);
        console.log('Page Result : ', result);
    }

    // 위약금 정보 조회 - 위약금 건 사람, 금액
    onGetGoodsDepositInfo = async () => {
        let result = await getGoodsDepositInfo(this.tokenGethSC, this.getGoodsDepositNo.value);
        console.log('Page Result : ', result);
    }

    // 상품별 소비자 구매로 묶인 위약금 총금액 조회
    onGetGoodsTotalDeposit = async () => {
        let result = await getGoodsTotalPaidDeposit(this.tokenGethSC, this.getGoodsTotalDepositNo.value);
        console.log('Page Result : ', result);
    }

    onGetGoodsRemainDeposit = async () => {
        let result = await getGoodsRemainDeposit(this.tokenGethSC, this.getGoodsRemainDepositNo.value);
        console.log('Page Result : ', result);
    }


    // 주문정보 조회
    onGetOrderInfo = async () => {
        let result = await getOrderInfo(this.tokenGethSC, this.getOrderInfoNo.value);
        console.log('Page Result : ', result);
    }


    // 주문에 따른 소비자 토큰내역 조회
    onGetOrderTokenHistory = async () => {
        let result = await getOrderTokenHistory(this.tokenGethSC, this.getOrderTokenHistoryNo.value);
        console.log('Page Result : ', result);
    }

    // 토큰 잔액조회
    onGetBalanceOf = async () => {
        let result = await getBalanceOf(this.tokenGethSC, this.getBalanceOfAccount.value);
        console.log('Page Result : ', result);
    }


    render() {
        return (
            <div>

                <h5> Geth서버 Token Test</h5>
                1.
                <button onClick = {this.onCheckEther}> 사용자 이더받기 </button>
                <br/>
                <br/>

                2.
                <input type="text" placeholder="address"
                       ref = {(input) => {this.giveUserAddress = input}}
                />
                <input type="text" placeholder="amount"
                       ref = {(input) => {this.giveUserAmount = input}}
                />
                <button onClick = {this.onGiveUserToken}> 사용자 토큰 추가지급(test용) </button>
                <br/>
                <br/>

                3.
                <input type="text" placeholder="amount"
                       ref = {(input) => {this.buyTokenAmount = input}}
                />
                <button onClick = {this.onBuyProducerToken}> 생산자 토큰 추가구입 </button>
                <br/>
                <br/>

                4.
                <input type="text" placeholder="goodsNo"
                       ref = {(input) => {this.payProducerDepositProdNo = input}}
                />
                <input type="text" placeholder="amount"
                       ref = {(input) => {this.payProducerDepositAmount = input}}
                />
                <button onClick = {this.onPayProducerDeposit}> 생산자 위약금 지불 </button>
                <br/>
                <br/>

                5.
                <input type="text" placeholder="goodsNo"
                       ref = {(input) => {this.payManagerDepositProdNo = input}}
                />
                <input type="text" placeholder="amount"
                       ref = {(input) => {this.payManagerDepositAmount = input}}
                />
                <button onClick = {this.onPayManagerDeposit}> 관리자 위약금 지불 </button>
                <br/>
                <br/>

                6.
                <input type="text" placeholder="orderNo"
                       ref = {(input) => {this.orderGoodsOrderNo = input}}
                />
                <input type="text" placeholder="producer"
                       ref = {(input) => {this.orderGoodsProducer = input}}
                />
                <input type="text" placeholder="goodsNo"
                       ref = {(input) => {this.orderGoodsgoodsNo = input}}
                />
                <input type="text" placeholder="price"
                       ref = {(input) => {this.orderGoodsPrice = input}}
                />
                <input type="text" placeholder="orderDeposit"
                       ref = {(input) => {this.orderGoodsDeposit = input}}
                />
                <input type="text" placeholder="fee"
                       ref = {(input) => {this.orderGoodsFee = input}}
                />
                <input type="text" placeholder="customerReward"
                       ref = {(input) => {this.orderGoodsReward = input}}
                />
                <button onClick = {this.onOrderGoods}> 주문하기 </button>
                <br/>
                <br/>

                7.
                <input type="text" placeholder="orderNo"
                       ref = {(input) => {this.finishDeliveryOrderNo = input}}
                />
                <input type="text" placeholder="orderPenalty"
                       ref = {(input) => {this.finishDeliveryPenalty = input}}
                />
                <button onClick = {this.onFinishDelivery}> 배송완료_정산 </button>
                <br/>
                <br/>

                8.
                <input type="text" placeholder="orderNo"
                       ref = {(input) => {this.rewardCustomerOrderNo = input}}
                />
                <input type="text" placeholder="goodsNo"
                       ref = {(input) => {this.rewardCustomergoodsNo = input}}
                />
                <button onClick = {this.onRewardCustomerNotDelivery}> 미배송 소비자 보상 </button>
                <br/>
                <br/>

                9.
                <input type="text" placeholder="goodsNo"
                       ref = {(input) => {this.returnDepositgoodsNo = input}}
                />
                <button onClick = {this.onReturnDepositFinal}> 미배송 상품 남은위약금 환불 </button>
                <br/>
                <br/>

                10.
                <button onClick = {this.onGetManagerTotalDeposit}> 매니저에게 걸린 총 위약금 </button>
                <br/>
                <br/>

                11.
                <button onClick = {this.onGetManagerTotalPurchase}> 매니저에게 걸린 총 주문금액 </button>
                <br/>
                <br/>


                12.
                <input type="text" placeholder="goodsNo"
                       ref = {(input) => {this.getGoodsDepositNo = input}}
                />
                <button onClick = {this.onGetGoodsDepositInfo}> 상품위약금 정보 조회  </button>
                <br/>
                <br/>


                13.
                <input type="text" placeholder="goodsNo"
                       ref = {(input) => {this.getGoodsTotalDepositNo = input}}
                />
                <button onClick = {this.onGetGoodsTotalDeposit}> 상품에 걸린 위약금 총액  </button>
                <br/>
                <br/>


                14.
                <input type="text" placeholder="goodsNo"
                       ref = {(input) => {this.getGoodsRemainDepositNo = input}}
                />
                <button onClick = {this.onGetGoodsRemainDeposit}> 상품에 남아있는 위약금 총액  </button>
                <br/>
                <br/>

                15.
                <input type="text" placeholder="orderNo"
                       ref = {(input) => {this.getOrderInfoNo = input}}
                />
                <button onClick = {this.onGetOrderInfo}> 주문정보 조회   </button>
                <br/>
                <br/>

                16.
                <input type="text" placeholder="orderNo"
                       ref = {(input) => {this.getOrderTokenHistoryNo = input}}
                />
                <button onClick = {this.onGetOrderTokenHistory}> 주문에 따른 소비자 토큰내역 조회   </button>
                <br/>
                <br/>

                17.
                <input type="text" placeholder="address"
                       ref = {(input) => {this.getBalanceOfAccount = input}}
                />
                <button onClick = {this.onGetBalanceOf}> 토큰잔액조회   </button>

                <br/>
                <br/>
            </div>
        );
    }
}
