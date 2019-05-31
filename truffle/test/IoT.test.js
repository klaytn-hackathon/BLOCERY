const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const json = require('./../build/contracts/IotSC.json');


let accounts;
let iotSC;
const interface = json['abi'];
const bytecode = json['bytecode'];

beforeEach(async() => {
    accounts = await web3.eth.getAccounts();
    iotSC = await new web3.eth.Contract(interface)
        .deploy({data: bytecode})
        .send({from: accounts[0], gas: 4000000});
});

describe('-- iot contract test --', () => {
   it('iot 기기 등록', async() => {
       await iotSC.methods.setIotProduct('aaa', 111, '01088094941804494148809494180012310200010011180313393141000100025410000121130500001809007200383400100000001209')
           .send({from: accounts[0], gasLimit: 650000, gasPrice: 200000000});
       await iotSC.methods.setIotProduct('aaa', 123, '010880949418044941488094941800123102000100111803133931410001000254100001211305000018090072003834001000000012091')
           .send({from: accounts[0], gasLimit: 650000, gasPrice: 200000000});
       await iotSC.methods.setIotProduct('aaa', 777, '010880949418044941488094941800123102000100111803133931410001000254100001211305000018090072003834001000000012093')
           .send({from: accounts[0], gasLimit: 650000, gasPrice: 200000000});
       let dpNo = await iotSC.methods.getIotProducts('aaa').call();
       console.log('dpNo: ',dpNo);
       assert.equal(dpNo[0], 111, "iot기기와 배송상품이 제대로 등록되지 않았음");
       assert.equal(dpNo[1], 123, "iot기기와 배송상품이 제대로 등록되지 않았음");
       assert.equal(dpNo[2], 777, "iot기기와 배송상품이 제대로 등록되지 않았음");

       let barcode1 = await iotSC.methods.getBarcode(dpNo[0]).call();
       let barcode2 = await iotSC.methods.getBarcode(dpNo[1]).call();
       let barcode3 = await iotSC.methods.getBarcode(dpNo[2]).call();
       console.log('barcode1 : ', barcode1, ', barcode2 : ', barcode2, ', barcode3 : ', barcode3);
       assert.equal(barcode1, '01088094941804494148809494180012310200010011180313393141000100025410000121130500001809007200383400100000001209', "배송상품과 바코드1이 제대로 등록되지 않았음");
       assert.equal(barcode2, '010880949418044941488094941800123102000100111803133931410001000254100001211305000018090072003834001000000012091', "배송상품과 바코드2이 제대로 등록되지 않았음");
       assert.equal(barcode3, '010880949418044941488094941800123102000100111803133931410001000254100001211305000018090072003834001000000012093', "배송상품과 바코드3이 제대로 등록되지 않았음");
   });

   it('운송상품정보 등록', async() => {

       await iotSC.methods.setIotProduct('aaa', 111, 'bar1').send({from: accounts[0]});
       await iotSC.methods.setIotProduct('aaa', 123, 'bar2').send({from: accounts[0]});
       await iotSC.methods.setIotProduct('aaa', 777, 'bar3').send({from: accounts[0]});

       let iotID = 'aaa';
       let gatewayID = 'gateway123';
       await iotSC.methods.setDeliveryResult(iotID, gatewayID, [201811191438, 201811191439, 201811191440, 201811191441, 201811191442], [-1, 2, 0, -2, 5])
           .send({from: accounts[0], gasLimit: 650000, gasPrice: 200000000});
       // await iotSC.methods.setDeliveryResult(iotID, gatewayID, 201811191439, 2)
       //     .send({from: accounts[0], gasLimit: 650000, gasPrice: 200000000});
       // await iotSC.methods.setDeliveryResult(iotID, gatewayID, 201811191440, 0)
       //     .send({from: accounts[0], gasLimit: 650000, gasPrice: 200000000});
       // await iotSC.methods.setDeliveryResult(iotID, gatewayID, 201811191441, -2)
       //     .send({from: accounts[0], gasLimit: 650000, gasPrice: 200000000});

       let result = await iotSC.methods.getDeliveryTemperature(777).call();
       console.log('deliveryResult : ', result);
   });
});
