import BaseContract from './BaseContract';

export default class SimpleStorageSC extends BaseContract {

    //get함수는 Promise임 : 사용시 .then()으로 호출
    getValue = async () => { //adopters, account) {
        let scInstance = null;

        //contractPromise
        await this.contract.deployed().then((instance) => {
            scInstance = instance;
        });

        //getPromise return
        return scInstance.getValue.call().then((value) => {
            console.log(value.toNumber());
            return value.toNumber(); //BigNumber를 Number로 변환필요
        }); //.catch((e) => { console.log(e.message); });
    }

    setValue = async (value) => {
        let scInstance;

        //contractPromise
        await this.contract.deployed().then((instance) => {
            scInstance = instance;
        });

        //setPromise execute.
        this.getMyAccount().then((account) => {
            console.log('accountPromise account:' + account);
            scInstance.setValue(value, {from: account}); //from옵션 넣어줘야 동작.
        });
    }

} //class
