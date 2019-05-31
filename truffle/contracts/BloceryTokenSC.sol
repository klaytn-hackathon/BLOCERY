pragma solidity ^0.4.24;
import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

contract BloceryTokenSC is MintableToken {

    string public name = 'alpha-BloceryToken';
    string public symbol = 'alpha-BLCT';
    uint8 public decimal = 18;

    using SafeMath for uint;
    address manager;
    uint totalDeposit; // manager에서 전송된 위약금 총합
    uint totalPurchase; // manager에서 전송된 상품금액 총합

    // 관리자가 걸수있는 위약금 최대금액
    uint maxDeposit = 5000000; // 1억원 (1BLCT = 20원일 때 기준)

    // 상품에 걸린 위약금 정보(생산자 or 관리자 지불)
    struct depositInfo {
        address owner;
        uint32 deposit;
        bool isCalculated;
    }
    mapping (uint => depositInfo) goodsDeposit;  // goodsNo => depositInfo

    // 소비자가 주문한 주문정보
    struct orderInfo {
        address customer;
        address producer;
        uint32 goodsNo;
        uint32 price;
        uint32 deposit;
        uint32 fee;
        uint32 consumerReward;
        bool isDelivered; // 주문의 상품 배송여부
        bool isCalculated;
    }
    mapping (uint => orderInfo) orderInfoMapping; // orderNo => orderInfo

    // 각 상품에 소비자들이 주문해서 걸려있는 위약금 총액
    mapping (uint => uint) goodsTotalDeposit; // goodsNo => deposit

    // 추후 토큰내역 필요하면 추가할 사항들 - key, account, 용도(penalty, deposit, reward), amount
    event eventSendEther(address indexed user);

    // 해당 상품번호의 소비자가 이미 구매한 위약금 합이 생산자가 맨 처음 설정한 위약금보다 작은지 확인
    modifier isEnoughDeposit(uint32 _goodsNo, uint32 _deposit) {
        uint originDeposit = goodsDeposit[_goodsNo].deposit;
        require(originDeposit >= goodsTotalDeposit[_goodsNo] + _deposit);
        _;
    }

    // 해당 주문번호가 미정산 상태인지 확인
    modifier isNotCalculatedOrder(uint _orderNo) {
        orderInfo memory order = orderInfoMapping[_orderNo];
        require(!order.isCalculated);
        _;
    }

    // 해당 상품번호의 위약금이 미정산 상태인지 확인
    modifier isNotCalculatedDeposit(uint _goodsNo) {
        depositInfo memory deposit = goodsDeposit[_goodsNo];
        require(!deposit.isCalculated);
        _;
    }

    // 관리자가 생산자의 위약금을 대신 지불할 때 maxDeposit 미만만 가능하도록 확인
    modifier isValidDepositAmount(uint _amount) {
        require(_amount<maxDeposit);
        _;
    }

    constructor() public {
        manager = msg.sender;
        mint(msg.sender, 10000000000);
    }

    function sendEtherToUser(address _receiver) payable public {
        require(_receiver.balance < 10000000000000000); // 연속으로 0.01이더 지급 실행 막기위함
        _receiver.transfer(msg.value);
        emit eventSendEther(_receiver);
    }

    // Manager have to send transaction
    function initUserToken(address _receiver, uint _amount) public {
        transfer(_receiver, _amount);
    }

    // 생산자 추가토큰구입
    function buyProducerToken(address _manager, uint _amount) public {
        transferFrom(_manager, msg.sender, _amount);
    }

    // 생산자 물품등록시 생산자가 위약금 걸기
    function payProducerDeposit(address _manager, uint _goodsNo, uint32 _amount) public {
        saveDepositInfo(_goodsNo, _amount);
        transfer(_manager, _amount);
    }

    // 생산자 물품등록시 관리자가 위약금 걸기
    function payManagerDeposit(uint _goodsNo, uint32 _amount) public isValidDepositAmount(_amount) {
        saveDepositInfo(_goodsNo, _amount);
    }

    function saveDepositInfo(uint _goodsNo, uint32 _amount) private {
        depositInfo memory deposit = depositInfo(msg.sender, _amount, false);
        goodsDeposit[_goodsNo] = deposit;
        totalDeposit = totalDeposit + _amount;
    }

    // customer orders goods
    function orderGoods(uint _orderNo, address _producer, address _manager, uint32 _goodsNo, uint32 _price, uint32 _deposit, uint32 _fee, uint32 _consumerReward) public isEnoughDeposit(_goodsNo, _deposit) isNotCalculatedDeposit(_goodsNo) {
        subOrderGoods(_orderNo, _producer, _goodsNo, _price, _deposit, _fee, _consumerReward);
        goodsTotalDeposit[_goodsNo] = goodsTotalDeposit[_goodsNo] + _deposit;
        totalPurchase = totalPurchase + _price;
        sendToken(_manager, _price);
    }

    function subOrderGoods(uint _orderNo, address _producer, uint32 _goodsNo, uint32 _price, uint32 _deposit, uint32 _fee, uint32 _consumerReward) private {
        orderInfo memory order = orderInfo(msg.sender, _producer, _goodsNo, _price, _deposit, _fee, _consumerReward, false, false);
        orderInfoMapping[_orderNo] = order;
    }

    // 소비자 구매확정시 정산(자동구매확정에도 실행되어야 함)
    function finishDelivery(uint _orderNo, uint _orderPenalty) public isNotCalculatedOrder(_orderNo) {
        orderInfo storage order = orderInfoMapping[_orderNo];
        depositInfo storage deposit = goodsDeposit[order.goodsNo];
        address depositOwner = deposit.owner;

        // reward customer
        uint consumerRewardAmount = _orderPenalty + order.consumerReward;
        sendToken(order.customer, consumerRewardAmount);

        // profit producer
        uint producerIncome = order.price - order.fee - consumerRewardAmount;
        sendToken(order.producer, producerIncome);

        // return deposit
        sendToken(depositOwner, order.deposit);
        totalDeposit = totalDeposit - order.deposit;

        totalPurchase = totalPurchase - order.price;
        order.isCalculated = true;
        order.isDelivered = true;
    }

    // 배송 안됐을 경우 주문자들에게 환불 및 보상
    function rewardCustomerNotDelivery(uint _orderNo, uint _goodsNo) public isNotCalculatedOrder(_orderNo) isNotCalculatedDeposit(_goodsNo) {
        orderInfo storage order = orderInfoMapping[_orderNo];
        order.isCalculated = true;
        order.isDelivered = false;
        totalPurchase = totalPurchase - order.price;
        totalDeposit = totalDeposit - order.deposit;
        sendToken(order.customer, order.price + order.deposit);
    }

    // 모든 정산 후 남은 위약금 환불
    function returnDepositFinal(uint _goodsNo) public isNotCalculatedDeposit(_goodsNo) {
        depositInfo storage deposit = goodsDeposit[_goodsNo];
        deposit.isCalculated = true;
        uint returnDeposit = deposit.deposit - goodsTotalDeposit[_goodsNo];
        totalDeposit = totalDeposit - returnDeposit;
        sendToken(deposit.owner, returnDeposit);
    }

    function sendToken(address _receiver, uint _value) private {
        transfer(_receiver, _value);
    }

    function kill() public {
        require(msg.sender == manager);
        selfdestruct(manager);
    }

    function getManagerTotalDeposit() view public returns(uint) {
        return totalDeposit;
    }

    function getManagerTotalPurchase() view public returns(uint) {
        return totalPurchase;
    }

    function getGoodsDepositInfo(uint _goodsNo) view public returns(address, uint32, bool) {
        return (goodsDeposit[_goodsNo].owner, goodsDeposit[_goodsNo].deposit, goodsDeposit[_goodsNo].isCalculated);
    }

    function getGoodsTotalPaidDeposit(uint _goodsNo) view public returns(uint) {
        return goodsTotalDeposit[_goodsNo];
    }

    function getOrderInfo(uint _orderNo) view public returns(address, address, uint32, uint32, uint32, uint32, uint32, bool, bool) {
        orderInfo memory order = orderInfoMapping[_orderNo];
        return (order.producer, order.customer, order.goodsNo, order.price, order.deposit, order.fee, order.consumerReward, order.isDelivered, order.isCalculated);
    }

    function getBalanceOf(address _user) view public returns(uint) {
        return balanceOf(_user);
    }

    function getGoodsRemainDeposit(uint _goodsNo) view public returns(uint) {
        depositInfo storage info = goodsDeposit[_goodsNo];
        uint tDeposit = info.deposit;
        uint orderDeposit = goodsTotalDeposit[_goodsNo];
        return tDeposit.sub(orderDeposit);
    }

}