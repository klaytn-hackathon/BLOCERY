/**
 * BaseContract - super class of all contracts (using Web3 & TruffleContract)
 *
 * <History>
 * @author  Yong Kim (yongary.kim@gmail.com)
 * @date 2018.4.5 - first created
 * @date 2018.6.11 - promisify & getMyAccount added
 * @date 2018.6.13 - contractDeployed added.
 *
 */

import Web3 from 'web3';
import TruffleContract from 'truffle-contract';
import $ from 'jquery';
import { Subject } from 'await-notify';

//web3함수를 Promise로 만들기 위한 공통모듈
export const promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) { reject(err) }
            resolve(res);
        })
    );

export default class BaseContract {

    constructor() {
        this.contract = {};
        this.initWeb3();
        //contract.deployed()가 initContract 보다 빨리 호출되는 경우용
        this.eventWaiting = new Subject();
    }

    initWeb3() {
        // Metamask
        console.log("this.web3:")
        console.log(this.web3);
        console.log("window.web3:")
        console.log(window.web3);

        if (typeof window.web3 !== 'undefined') {
            this.web3 = new Web3(window.web3.currentProvider);
        } else {
            //LocalTest  set the provider you want from Web3.providers
            console.log("initWeb3: local");
            this.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
        }
        console.log(this.web3);
    }

    /* new 이후에 호출 필요 */
    async initContract(contractJson) {

        let self = this;
        await $.getJSON(contractJson, function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            let contractArtifact = data;

            console.log('initContract:' + self.contract);

            self.contract = TruffleContract(contractArtifact);
            self.contract.setProvider(self.web3.currentProvider);

            console.log('initContract out');
            self.eventWaiting.notify(); //contractDeployed가 먼저 불렸을 경우 대비.

        });

    }

    /* contract관련 check함수 */

    /**
     * contractDeployed
     *       - same as contract.deployed,
     *          But waiting initContract to finish
     *       - useful when doing something on screen loading..
     * */
    contractDeployed = async () => {

        console.log('in contractDeployed:');
        if (Object.keys(this.contract).length === 0 ) {//contract Empty = initContract수행중
            console.log(this.contract);

            while (true) {
                await this.eventWaiting.wait();
                console.log('initContract Done');
                break; //exit when notified.
            }
        }
        console.log('out contractDeployed:');
        return this.contract.deployed().then((instance) => {return instance;});

    }

    //getMyAccount for MetaMask : 0번째 account가 myAccount
    getMyAccount = async () => {
        const accounts = await promisify(cb => this.web3.eth.getAccounts(cb));
        return accounts[0];  //accounts Array의 0번째가 관리자 account임.
    }
}