const SimpleStorageSC = artifacts.require("./SimpleStorageSC.sol");
const BloceryTokenSC = artifacts.require("./BloceryTokenSC.sol");

module.exports = function(deployer) {
    deployer.deploy(SimpleStorageSC);
    deployer.deploy(BloceryTokenSC);

    //when Saling Token
    // deployer.deploy(ATZToken).then(function () {
    //     deployer.deploy(ATZUserList).then(function() {
    //         deployer.deploy(ATZTokenSale, ATZToken.address, ATZUserList.address);
    //     });
    // });
};
