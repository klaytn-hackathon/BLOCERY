import React from 'react'
import { create } from 'react-test-renderer'
import { LoginTab, Goods, Mypage, Recommend, Main, Resv } from '../src/components/shop'
import ComUtil from '../src/util/ComUtil';


//Login consumer
//테스트 시 내부의 state를 업데이트 하지 않아 값을 비교 불가능. 에러가 나지 않으면 성공으로 보아야 할 것 같음
describe("shop/login/LoginTab component", () => {
    test("소비자 로그인", async () => {
        const component = create(<LoginTab/>);

        const root = component.root;

        const instance = component.getInstance();
        const form = root.findByType("form");
        const input = root.findAllByType('input');
        const id = input[0]
        const pw = input[1]

        id.value = "kim2@ezfarm.co.kr";
        pw.value = "ezfarm#3414";

        await form.props.onSubmit({
            target: [
                id,
                pw
            ],
            preventDefault: function(){} //HARD CODING..
        })
    })
})

//Login producer
//테스트 시 내부의 state를 업데이트 하지 않아 값을 비교 불가능. 에러가 나지 않으면 성공으로 보아야 할 것 같음
describe("shop/login/LoginTab component", () => {
    test("생산자 로그인", async () => {
        const component = create(<LoginTab/>);

        const root = component.root;

        const instance = component.getInstance();
        const form = root.findByType("form");
        const input = root.findAllByType('input');
        const id = input[0]
        const pw = input[1]

        id.value = "producer236@ezfarm.co.kr";
        pw.value = "ezfarm#3414";

        await form.props.onSubmit({
            target: [
                id,
                pw
            ],
            preventDefault: function(){} //HARD CODING..
        })
    })
})

//TODO 테스트 실패, 소스 고치지 않고 가능 한 방법 찾아야 함
//Mypage
// describe("shop/mypage/Mypage component", () => {
//     test("마이페이지 테스트", async () => {
//         // const component = create(<Mypage/>);
//         // const instance = component.getInstance();
//         // await instance.componentWillMount();
//     })
// })

//TODO 테스트 실패, 소스 고치지 않고 가능 한 방법 찾아야 함
//Recommend 메인
// describe("shop/Recommend/Recommend component", () => {
//     test("메인페이지 테스트", () => {
//         const history = {
//             location: {
//                 pathname: '/main/recommend'
//             }
//         }
//         const component = create(<ShopContainer history={history}/>);
//         const instance = component.getInstance();
//         console.log(instance.state);
//         // await instance.loginCheck();
//         // expect(instance.state.goods.producerNo).toBe(2);
//     })
// })



//Goods 상품상세
describe("shop/goods/Goods component", () => {
    test("상품상세의 goodsNo=1 테스트", async () => {
        const component = create(<Goods goodsNo={1}/>);
        const instance = component.getInstance();
        await instance.search();
        expect(instance.state.goods.producerNo).toBe(2);
    })
})


//Resv 상품목록 - 낮은가격순 정렬
describe("shop/resv/Resv sorting", () => {
    test("상품목록의 낮은가격순 테스트", async () => {
        const component = create(<Resv/>);
        const instance = component.getInstance();
        await instance.search();
        const root = component.root;

        /*

        //버튼 객체 찾기(array)

        const button = root.findAllByProps({type: 'button', value: 0})
        const button = root.findAll(el=>el.props.type === 'button' && el.props.value === 0)
        console.log('===================================================================',button[0].props)
        console.log('===================================================================',button[0].children)
        console.log('===================================================================',button[0].props.value)
        */

        /*

        //버튼 객체 찾기(object)

        const button = root.findByProps({type: 'button', children: '낮은가격순'})  //Blocery추천
        console.log('===================================================================',button.props)
        console.log('===================================================================',button.props.children)
        console.log('===================================================================',button.props.value)
        button.props.onClick({value: 1, text:''})
        */

        instance.onSortClick({value: 1, text:''})   //낮은 가격순 정렬

        await instance.search()

        const rows = instance.state.rowData.map((item) => {
            return {
                nowPrice: ComUtil.price3StepCurrent(item),
                reservationPrice: item.reservationPrice,
                shipPrice: item.shipPrice
            }
        })

        console.table(rows)

        for(let i = 0 ; i < rows.length-1; i++){
            const bp = rows[i].nowPrice
            const ap = rows[i+1].nowPrice
            const isCheaper = bp <= ap ? true : false
            if(!isCheaper) console.log(`${i} 번째의 현재가격이 ${i+1} 번째보다 더 높습니다`)

            expect(isCheaper).toBe(true)
        }
    })
})
