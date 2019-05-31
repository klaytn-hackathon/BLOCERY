pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ATZTokenSC.sol";

contract TestATZTokenSC {

    ATZTokenSC tokenSC;

    //BetSC INITIALIZE - GET DEPLOYED ADDRESS.
//    function beforeAll() {
//        tokenSC = ATZTokenSC(DeployedAddresses.ATZTokenSC());
//    }

//    function test_transfer() {

        //from: account[0] : account[0]에는 초기값(1000000 ATZ가 이미 있음?)
           //to: ""wrap original eagle bachelor stem minor shy swing urge album proof tunnel" 0x38C7dd70658E1d2E13D97a94774cf3B3472c342C

//        address toAddr = 0x38C7dd70658E1d2E13D97a94774cf3B3472c342C;
//
//        uint bal = tokenSC.getBalance(toAddr);
//        Assert.equal(bal, 0, "0 initial token");

        //transfer 는 revert 발생.
        //tokenSC.transfer(toAddr, 100);
        //uint bal2 = tokenSC.getBalance(toAddr);
        //Assert.equal(bal2, 100, "100 transfered");
//    }

}
