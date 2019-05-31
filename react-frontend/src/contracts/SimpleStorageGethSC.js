import BaseGethContract from './BaseGethContract';
import { Server } from '../components/Properties';

export default class SimpleStorageGethSC extends BaseGethContract {

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
        this.getBaseAccountUnlocked().then((account) => {
            console.log('accountPromise account:' + account); //100 is ERROR
            if (account !== Server.ERROR)
                scInstance.setValue(value, {from: account, gasLimit:90000, gasPrice:this.getGasPrice()}); //from옵션 넣어줘야 동작.
            //else
            //    console.log('100: getBaseAccountUnlock Error');
        });
    }
} //class
