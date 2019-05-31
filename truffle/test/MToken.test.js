const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const json = require('./../build/contracts/MTokenSC.json');

let accounts;
let mToken;
let manager;
const interface = json['abi'];
const bytecode = json['bytecode'];

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    manager = accounts[1];
    mToken = await new web3.eth.Contract(interface)
        .deploy({data: bytecode})
        .send({from: manager, gas: 4000000});
});


describe('mToken', () => {
    it('생산자 가입시 100,000토큰 지급', async() => {
        producer = accounts[0];
        await mToken.methods.initProducerToken().send({from: producer});
        tokenBalance = await mToken.methods.getTotalToken(producer).call();
        assert.equal(tokenBalance, 100000, "balance is different from initProducerToken");
    });

    it('생산자 추가로 10,000 토큰 구입', async() => {
        producer = accounts[0];
        await mToken.methods.initProducerToken().send({from: producer});
        await mToken.methods.buyProducerToken().send({from: producer});
        tokenBalance = await mToken.methods.getTotalToken(producer).call();
        assert.equal(tokenBalance, 110000, "10,000토큰이 제대로 지급되지 않았음");
    });

    it('생산자 상품 50pack * 10box 등록', async() => {
        producer = accounts[0];
        await mToken.methods.initProducerToken().send({from: producer});
        await mToken.methods.payProducerToken(manager, 50, 10).send({from: producer});

        tokenBalance = await mToken.methods.getTotalToken(producer).call();
        assert.equal(tokenBalance, 100000-(2*50*10), "50pack * 10box 토큰이 제대로 지급되지 않았음");
        managerBalance = await mToken.methods.getTotalToken(manager).call();
        assert.equal(managerBalance, (2*50*10), "50pack * 10box 토큰이 관리자에게 제대로 지급되지 않았음");
    });

    it('생산자 이더 없이 상품등록 시도(에러남) 후 이더받아서 상품 다시 등록', async() => {
        producer = accounts[0];
        await mToken.methods.initProducerToken().send({from: producer});

        // 이더를 모두 소진해야함
        balance = await web3.eth.getBalance(producer);
        await mToken.methods.sendEtherForTest(manager).send({from: producer, value: balance - 200000000000000});

        try {
            await mToken.methods.payProducerToken(manager, 50, 10).send({from: producer});
        } catch(error) {
            console.log('에러발생! 이더가 부족해서 0.01이더 다시 지급 후 상품등록 실시함 ')
            await mToken.methods.sendEtherToUser(producer).send({from: manager, value:1000000000000000});
            await mToken.methods.payProducerToken(manager, 50, 10).send({from: producer});
        }

        tokenBalance = await mToken.methods.getTotalToken(producer).call();
        assert.equal(tokenBalance, 100000-(2*50*10), "50pack * 10box 토큰이 제대로 지급되지 않았음");
        managerBalance = await mToken.methods.getTotalToken(manager).call();
        assert.equal(managerBalance, (2*50*10), "50pack * 10box 토큰이 관리자에게 제대로 지급되지 않았음");
    });

    it('생산자 보유 토큰량보다 많은 상품등록 시도시 에러발생', async() => {
        producer = accounts[0];
        await mToken.methods.buyProducerToken().send({from: producer});

        try {
            await mToken.methods.payProducerToken(manager, 500, 100).send({from: producer});
        } catch(error) {
            console.log('보유한 토큰보다 더 많은 양이 필요한 상품 등록으로 에러남');
        }

        tokenBalance = await mToken.methods.getTotalToken(producer).call();
        assert.equal(tokenBalance, 10000-(2*500*100), "50pack * 10box 토큰이 제대로 지급되지 않았음");
        managerBalance = await mToken.methods.getTotalToken(manager).call();
        assert.equal(managerBalance, (2*500*100), "50pack * 10box 토큰이 관리자에게 제대로 지급되지 않았음");
    });

    it('소비자 물품구입 토큰얻기', async() => {
        producer = accounts[0];
        consumer = accounts[2];
        await mToken.methods.initProducerToken().send({from: producer});
        await mToken.methods.payProducerToken(manager, 50, 100).send({from: producer});
        // mTokenBalance = await mToken.methods.getTotalToken(manager).call();
        // console.log('manager balance : ', mTokenBalance);

        await mToken.methods.approve(consumer, 1).send({from: manager}); // 관리자가 실행해야함

        await mToken.methods.gainConsumerToken(manager).send({from: consumer}); // 소비자가 실행해야 함

        tokenBalance = await mToken.methods.getTotalToken(consumer).call();
        // mTokenBalance = await mToken.methods.getTotalToken(manager).call();
        // console.log('manager balance : ', mTokenBalance);
        // console.log('consumer balance : ', tokenBalance);

        assert.equal(tokenBalance, 1, "사용자에게 물뭎구입 토큰이 제대로 지급되지 않았음");
    });

    it('운송업체 물품등록 토큰얻기', async() => {
        producer = accounts[0];
        transport = accounts[3];

        await mToken.methods.initProducerToken().send({from: producer});
        await mToken.methods.payProducerToken(manager, 50, 100).send({from: producer});

        await mToken.methods.approve(transport, 100).send({from: manager}); // 관리자가 실행해야함
        await mToken.methods.gainTransToken(manager, 100).send({from: transport}); // 운송업체가 실행해야 함
        tokenBalance = await mToken.methods.getTotalToken(transport).call();

        assert.equal(tokenBalance, 100, "운송업체에게 물뭎등록 토큰이 제대로 지급되지 않았음");
    });


    // it('생산자 등록물품 조회하기', async() => {
    //     producer = accounts[0];
    //     await mToken.methods.initProducerToken().send({from: producer});
    //     await mToken.methods.payProducerToken(manager, 50, 100, 'aaa', 1111).send({from: producer});
    //     getIot = await mToken.methods.getIotProducts('aaa').call();
    //     assert.equal(getIot, 1111, "물품이 제대로 등록되지 않았음");
    // });


})