import BaseGethContract from './BaseGethContract';
import { Const, Server } from '../components/Properties';


export default class TokenGethSC extends BaseGethContract {


    checkEther = async () => {
        // 남은 이더 양 체크
        console.log("checkEther() ");
        let etherResult = await this.subCheckEther();
        if(!etherResult) {
            let sendResult = await this.sendEtherAuto();
            console.log('frontpage sendResult : ', sendResult);
        }
    };

    // 이더가 필요한 모든 함수 실행시 시작단계에서 남은 이더를 확인하고 이더가 없을 경우 자동으로 이더를 지급함
    subCheckEther = async() => {
        let userAccount = await this.getMyAccount();
        console.log('이더체크할 userAccount : ', userAccount);
        let userBalance = await this.getBalance(userAccount);
        console.log('**** userBalnace : ', userBalance);

        let result = true;
        if(userBalance < (this.getGasPrice() * Const.GAS_LIMIT)) {
            console.log('이더부족. 충전필요함');
            result = false;
        }
        return result;
    };

    // checkEther에서 사용하는 메소드
    sendEtherAuto = async() => {
        let userAccount = await this.getMyAccount();
        let tokenInstance = await this.contract.deployed();

        let sendResult = false;
        try {
            let baseAccountUnlock = await this.getBaseAccountUnlocked();
            // console.log('5555 baseAccount : ', baseAccountUnlock);
            let result = await tokenInstance.sendEtherToUser(userAccount, {
                from: baseAccountUnlock,
                value: this.web3.toWei("0.01", "ether"),
                gas: 90000,
                gasPrice: this.getGasPrice()
            });
            console.log('sendResult : ', result);
            console.log('sendResult.receipt.args.user : ', result.logs[0].args.user);

            sendResult = true;

        } catch(err) {
            // 이더지급 실패
            console.log(err);
        }
        return sendResult;
    };

    giveUserToken = async(receiver, amount) => {
        console.log('giveUserToken : ', receiver, amount);

        let scInstance = await this.contract.deployed();
        try {
            let baseAccountUnlock = await this.getBaseAccountUnlocked();
            console.log("baseAccount : ", baseAccountUnlock);
            let result = await scInstance.initUserToken(receiver, amount, {
                from: baseAccountUnlock,
                gas: 90000,
                gasPrice: this.getGasPrice()
            });
            console.log('giveUserToken result : ', result);
            console.log('giveUserToken.receipt.args.value : ', result.logs[0].args.value.toNumber());
        } catch(err) {
            console.log(err);
        }
    };

    initUserToken = async(manager, receiver, amount) => {
        console.log('initUserToken account : ', receiver, amount);

        let scInstance = await this.contract.deployed();
        try {
            // let baseAccount = await this.getBaseAccount();
            // let baseAccountUnlock = await this.getBaseAccountUnlocked();
            console.log('baseAccount : ', manager);

            let result = await scInstance.initUserToken(receiver, amount, {
                from: manager,
                gas: 90000,
                gasPrice: this.getGasPrice()
            });
            console.log('initUserToken result : ', result);
            console.log('initUserToken.receipt.args.value : ', result.logs[0].args.value.toNumber());
            if(result.logs[0].args.value.toNumber() > 0) {
                return 200;
            }
        } catch(err) {
            console.log(err);
        }

    };

    buyProducerToken = async(user, manager, amount) => {
        console.log('buyProducerToken : ', amount);

        let scInstance = await this.contract.deployed();
        try {
            let baseAccountUnlock = await this.getBaseAccountUnlocked();
            console.log('baseAccount : ', baseAccountUnlock);

            let approveResult = await scInstance.approve(user, amount, {
                from: baseAccountUnlock,
                gas: 90000,
                gasPrice: this.getGasPrice()
            });
            console.log('buyProducerToken approve result : ', approveResult);
            console.log('buyProducerToken approve receipt.args.value : ', approveResult.logs[0].args.value.toNumber());


            let myAccountUnlock = await this.getMyAccountUnlocked();
            console.log('myAccount : ', myAccountUnlock);

            let result = await scInstance.buyProducerToken(manager, amount, {
                from: myAccountUnlock,
                gas: 90000,
                gasPrice: this.getGasPrice()
            });
            console.log('buyProducerToken result : ', result);
            console.log('buyProducerToken receipt.args.value : ', result.logs[0].args.value.toNumber());
            if(result.logs[0].args.value.toNumber() > 0) {
                return 200;
            }
        } catch(err) {
            console.log(err);
        }

    };

    payProducerDeposit = async(manager, goodsNo, amount) => {
        console.log('payProducerDeposit : ', manager, goodsNo, amount);
        let scInstance = await this.contract.deployed();
        try {
            let myAccountUnlock = await this.getMyAccountUnlocked();
            console.log('myAccount : ', myAccountUnlock);

            let result = await scInstance.payProducerDeposit(manager, goodsNo, amount, {
                from: myAccountUnlock,
                gas: 300000,
                gasPrice: this.getGasPrice()
            });
            console.log('payProducerDeposit result : ', result);
            console.log('payProducerDeposit receipt.args.value : ', result.logs[0].args.value.toNumber());
            if(result.logs[0].args.value.toNumber() > 0) {
                return 200;
            }
        } catch(err) {
            console.log(err);
        }
    };

    payManagerDeposit = async(goodsNo, amount) => {
        console.log('payManagerDeposit : ', goodsNo, amount);
        let scInstance = await this.contract.deployed();
        try {
            let baseAccountUnlock = await this.getBaseAccountUnlocked();
            console.log('baseAccount : ', baseAccountUnlock);

            let result = await scInstance.payManagerDeposit(goodsNo, amount, {
                from: baseAccountUnlock,
                gas: 90000,
                gasPrice: this.getGasPrice()
            });
            console.log('payManagerDeposit result : ', result);

        } catch(err) {
            console.log(err);
        }
    };

    orderGoods = async(orderNo, producer, manager, goodsNo, price, deposit, fee, customerReward) => {
        console.log('orderGoods : ', orderNo, producer, manager, goodsNo, price, deposit, fee, customerReward);
        let scInstance = await this.contract.deployed();
        try {
            let myAccountUnlock = await this.getMyAccountUnlocked();
            console.log('myAccount : ', myAccountUnlock);

            let result = await scInstance.orderGoods(orderNo, producer, manager, goodsNo, price, deposit, fee, customerReward, {
                from: myAccountUnlock,
                gas: 300000,
                gasPrice: this.getGasPrice()
            });
            console.log('orderGoods result : ', result);
            console.log('orderGoods receipt.args.value : ', result.logs[0].args.value.toNumber());
            if(result.logs[0].args.value.toNumber() > 0) {
                return 200;
            }
        } catch(err) {
            console.log(err);
        }
    };

    finishDelivery = async(orderNo, orderPenalty) => {
        console.log('finishDelivery : ', orderNo, orderPenalty);
        let scInstance = await this.contract.deployed();
        try {
            let baseAccountUnlock = await this.getBaseAccountUnlocked();
            console.log('baseAccount : ', baseAccountUnlock);

            let result = await scInstance.finishDelivery(orderNo, orderPenalty, {
                from: baseAccountUnlock,
                gas: 300000,
                gasPrice: this.getGasPrice()
            });
            console.log('finishDelivery result : ', result);
            console.log('finishDelivery receipt.args.value : ', result.logs[2].args.value.toNumber());
            if(result.logs[2].args.value.toNumber() > 0) {
                return 200;
            }
        } catch(err) {
            console.log(err);
        }
    };

    rewardCustomerNotDelivery = async(orderNo, goodsNo) => {
        console.log('rewardCustomerNotDelivery : ', orderNo, goodsNo);
        let scInstance = await this.contract.deployed();
        try {
            let baseAccountUnlock = await this.getBaseAccountUnlocked();
            console.log('baseAccount : ', baseAccountUnlock);

            let result = await scInstance.rewardCustomerNotDelivery(orderNo, goodsNo, {
                from: baseAccountUnlock,
                gas: 300000,
                gasPrice: this.getGasPrice()
            });
            console.log('rewardCustomerNotDelivery result : ', result);
            console.log('rewardCustomerNotDelivery receipt.args.value : ', result.logs[0].args.value.toNumber());
            if(result.logs[0].args.value.toNumber() > 0) {
                return 200;
            }
        } catch(err) {
            console.log(err);
        }
    };

    returnDepositFinal = async(goodsNo) => {
        console.log('returnDepositFinal : ', goodsNo);
        let scInstance = await this.contract.deployed();
        try {
            let baseAccountUnlock = await this.getBaseAccountUnlocked();
            console.log('baseAccount : ', baseAccountUnlock);

            let result = await scInstance.returnDepositFinal(goodsNo, {
                from: baseAccountUnlock,
                gas: 300000,
                gasPrice: this.getGasPrice()
            });
            console.log('returnDepositFinal result : ', result);
            console.log('returnDepositFinal receipt.args.value : ', result.logs[0].args.value.toNumber());
            if(result.logs[0].args.value.toNumber() > 0) {
                return 200;
            }
        } catch(err) {
            console.log(err);
        }
    };

    getManagerTotalDeposit = async() => {
        let scInstance = await this.contract.deployed();
        let result = await scInstance.getManagerTotalDeposit();
        console.log('getManagerTotalDeposit result : ', result.toNumber());
        return result.toNumber();
    };

    getManagerTotalPurchase = async() => {
        let scInstance = await this.contract.deployed();
        let result = await scInstance.getManagerTotalPurchase();
        console.log('getManagerTotalPurchase result : ', result.toNumber());
        return result.toNumber();
    };

    getGoodsDepositInfo = async(goodsNo) => {
        console.log('getGoodsDepositInfo : ', goodsNo);
        let scInstance = await this.contract.deployed();
        let result = await scInstance.getGoodsDepositInfo(goodsNo);
        console.log('getGoodsDepositInfo result : ', result);
        console.log('getGoodsDepositInfo result : ', result[1].toNumber());
        return result;
    };

    getGoodsTotalPaidDeposit = async(goodsNo) => {
        console.log('getGoodsTotalPaidDeposit : ', goodsNo);
        let scInstance = await this.contract.deployed();
        let result = await scInstance.getGoodsTotalPaidDeposit(goodsNo);
        console.log('getGoodsTotalPaidDeposit result : ', result.toNumber());
        return result.toNumber();
    };

    getOrderInfo = async(orderNo) => {
        console.log('getOrderInfo : ', orderNo);
        let scInstance = await this.contract.deployed();
        let result = await scInstance.getOrderInfo(orderNo);
        console.log('getOrderInfo result : ', result);
        return result;
    };

    getBalanceOf = async(account) => {
        console.log('getBalanceOf : ', account);
        let scInstance = await this.contractDeployed();
        let result = await scInstance.getBalanceOf(account);
        console.log('getBalanceOf result : ', result.toNumber());
        return result.toNumber();
    }

    getGoodsRemainDeposit = async(goodsNo) => {
        console.log('getGoodsRemainDeposit : ', goodsNo);
        let scInstance = await this.contract.deployed();
        let result = await scInstance.getGoodsRemainDeposit(goodsNo);
        console.log('getGoodsRemainDeposit result : ', result.toNumber());
        return result.toNumber();
    }

    getOrderTokenHistory = async(orderNo) => {
        console.log('getOrderTokenHistory : ', orderNo);

        let result = await this.getOrderInfo(orderNo);
        console.log('getGoodsRemainDeposit result : ', result);

        let orderPriceVal = result[3].toNumber();
        let isDeliveredVal = result[7];
        let isCalculatedVal = result[8];
        let depositVal = result[4].toNumber();
        let rewardVal = result[6].toNumber();

        const data = {
            orderPrice: orderPriceVal,
            deposit: 0,
            reward:0
        };

        if(isCalculatedVal) {
            if (isDeliveredVal) {
                data.reward = rewardVal;

            } else {
                data.deposit = depositVal;
            }
        }
        return data;
    }
}