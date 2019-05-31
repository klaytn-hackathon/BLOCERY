
/** componentWillMount()에서 호출해야함
     this.tokenGethSC = new TokenGethSC();
     this.tokenGethSC.initContract('/BloceryTokenSC.json');
**/

// 사용자 이더부족시 이더지급 (처음 가입시엔 지급 안함)
export const getUserEther = async(tokenGethSC) => {
    await tokenGethSC.checkEther();
};

// 처음 가입시 토큰지급 (성공시 return 200)
export const initUserToken = async(tokenGethSC, baseAccount, userAccount, amount) => {
    return await tokenGethSC.initUserToken(baseAccount, userAccount, amount);
};

// 토큰잔액 조회
export const getBalanceOf = async(tokenGethSC, userAccount) => {
    return await tokenGethSC.getBalanceOf(userAccount);
};

// 생산자 토큰 추가 구입 (성공시 return 200)
export const buyProducerToken = async(tokenGethSC, amount) => {
    await tokenGethSC.checkEther();
    let userAccount = await tokenGethSC.getMyAccount();
    let managerAccount = await tokenGethSC.getBaseAccount();
    return await tokenGethSC.buyProducerToken(userAccount, managerAccount, amount);
};

// 생산자 위약금 납부 (성공시 return 200)
export const payProducerDeposit = async(tokenGethSC, goodsNo, amount) => {
    await tokenGethSC.checkEther();
    let managerAccount = await tokenGethSC.getBaseAccount();
    return await tokenGethSC.payProducerDeposit(managerAccount, goodsNo, amount);
};

// 관리자 위약금 납부
export const payManagerDeposit = async(tokenGethSC, goodsNo, amount) => {
    await tokenGethSC.payManagerDeposit(goodsNo, amount);
};

// 매니저에게 적립왼 총 위약금 조회
export const getManagerTotalDeposit = async(tokenGethSC) => {
    return await tokenGethSC.getManagerTotalDeposit();
};

// 상품의 위약금 정보 조회 - 위약금 건 사람, 금액
export const getGoodsDepositInfo = async(tokenGethSC, goodsNo) => {
    return await tokenGethSC.getGoodsDepositInfo(goodsNo);
};

// 물품 주문 (성공시 return 200)
// 필요 파라미터 : tokenGethSC, 주문번호, 생산자 account, 상품번호, 구입금액, 위약금, 수수료, 소비자 구매보상
export const orderGoods = async(tokenGethSC, orderNo, producer, goodsNo, price, deposit, fee, customerReward) => {
    await tokenGethSC.checkEther();
    let managerAccount = await tokenGethSC.getBaseAccount();
    return await tokenGethSC.orderGoods(orderNo, producer, managerAccount, goodsNo, price, deposit, fee, customerReward);
};

// 배송완료_정산 (성공시 return 200)
export const finishDelivery = async(tokenGethSC, orderNo, penalty) => {
    return await tokenGethSC.finishDelivery(orderNo, penalty);
};

// 배송안될시 고객보상 (성공시 return 200)
export const rewardCustomerNotDelivery = async(tokenGethSC, orderNo, goodsNo) => {
    return await tokenGethSC.rewardCustomerNotDelivery(orderNo, goodsNo);
};

// 모든 정산 후 남은 위약금 환불 (성공시 return 200)
export const returnDepositFinal = async(tokenGethSC, goodsNo) => {
    return await tokenGethSC.returnDepositFinal(goodsNo);
};

// 매니저에게 적립된 총 물품구매금액 조회
export const getManagerTotalPurchase = async(tokenGethSC) => {
    return await tokenGethSC.getManagerTotalPurchase();
};

// 상품별 소비자 구매로 묶인 위약금 총금액 조회
export const getGoodsTotalPaidDeposit = async(tokenGethSC, goodsNo) => {
    return await tokenGethSC.getGoodsTotalPaidDeposit(goodsNo);
};

// 주문정보 조회
export const getOrderInfo = async(tokenGethSC, orderNo) => {
    return await tokenGethSC.getOrderInfo(orderNo);
};

// 주문번호로 그 주문에 해당하는 소비자 토큰거래내역 조회
export const getOrderTokenHistory = async(tokenGethSC, orderNo) => {
    return await tokenGethSC.getOrderTokenHistory(orderNo);
}

// 해당 물품의 남은 위약금 금액 조회
export const getGoodsRemainDeposit  = async(tokenGethSC, goodsNo) => {
    return await tokenGethSC.getGoodsRemainDeposit(goodsNo);
};