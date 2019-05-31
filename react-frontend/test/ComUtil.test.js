import ComUtil from '../src/util/ComUtil';
import moment from 'moment-timezone';

//USAGE: $npm test

test('compareDate test', () => {
    let date1 = '2018-09-01';
    let date2 = '2018-10-01';

    let ret = ComUtil.compareDate(date1, date2);
    expect(ret).toBe(-1);
});

test('objectAttrCopy test', () => {
    let target = {a:1, b:2, c:3};
    let source =      {b:5, c:6, d:7};

    ComUtil.objectAttrCopy(target, source);

    expect(target.a).toBe(1);
    expect(target.b).toBe(5);
    expect(target.d).toBe(undefined);
});

/* SmartContract Test fail: MetaMask Problem
test('Set_Get test', () => {
    let storage = new SimpleStorageSC();
    storage.initContract('/SimpleStorageSC.json');


    storage.setValue(1);
    let ret = storage.getValue();
    expect(ret).toBe(1);
});
*/

test('price3StepAll test', () => {

    let testEndDate = moment('2019-06-02T15:00:00Z');
    let goods = {reservationPrice:1000, saleEnd: testEndDate };
    //console.log(testEndDate);

    let arr = ComUtil.price3StepAll(goods);

    expect(arr[0].toDate).toBe('2019-05-20');
    expect(arr[0].price).toBe(600); //60%로 변경
    console.log(arr);
});

test('price3StepCurrent test', () => {

    let testEndDate = moment('2019-05-25T15:00:00Z');  //오늘부터 8일~14일 사이면 750리턴.
    let goods = {reservationPrice:1000, saleEnd: testEndDate };

    let arr = ComUtil.price3StepAll(goods);

    const todayPrice = ComUtil.price3StepCurrent(goods);
    console.log('todayPrice:' + todayPrice);
});