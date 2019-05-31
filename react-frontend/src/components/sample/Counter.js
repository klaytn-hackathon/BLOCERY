import React, { Component } from 'react';
import { Button } from 'reactstrap'
import { observer, inject } from 'mobx-react';

//inject는 컴포넌트에서 스토어에 접근할 수 있게 해줍니다. 정확히는, 스토어에 있는 값을 컴포넌트의 props 로 "주입"을 해줍니다.
//방법1
@inject('CounterStore') /* index.js의 Provider에서 넣어준 props에서 counter를 이 클래스의 props에 주입시켜줌 */

//방법2
// @inject(stores => ({
//     number: stores.counter.number,
//   increase: stores.counter.increase,
//   decrease: stores.counter.decrease,
// }))
@observer
class Counter extends Component {
    constructor(props){
        super(props)
        console.log('props:',this.props)
    }

    componentDidMount(){
        /*
            configure({enforceActions: "always"});
            수정이 불가능한 이유는 counter store가 strict 모드이기 때문 : ./stores/counter.js 참고
        */
        setTimeout(()=>{
            //this.props.counter.number = 777;
            this.props.CounterStore.resetNumber(777)
        }, 2000)

    }

    resetNumber = () => {
        this.props.CounterStore.resetNumber(0)
    }
    nowNumber = () => {
        console.log(this.props.CounterStore.nowNumber)
    }

    fetchCount = ()=> {
        this.props.CounterStore.fetchCount(10)
    }

    render() {

        const { CounterStore } = this.props; //방법1
        //const { number, increase, decrease } = this.props;    //방법2

        return (

            //방법1
            <div className={'text-center'}>
                <h1>
                    {
                        CounterStore.state === 'pending' ? 'loading..' : CounterStore.number
                    }
                </h1>
                <Button onClick={CounterStore.decrease}>[set] CounterStore.decrease <br/>1씩감소</Button>{' '}
                <Button onClick={CounterStore.increase}>[set] CounterStore.increase <br/>1씩증가</Button>
                <br/><br/>
                <Button onClick={this.resetNumber}>[set] CounterStore.resetNumber.bind(this, 0) <br/>파라미터 0을 넘겨 0으로 만들기</Button>
                <br/><br/>
                <Button onClick={this.nowNumber}>[get] CounterStore.nowNumber <br/>number * 10 가져오기(콘솔확인필요)</Button>
                <br/><br/>
                <Button onClick={this.fetchCount}>[API CALL] <br/>10씩 증가시키기</Button>
                <br/><br/>



            </div>

            //방법2
            //   <div>
            //     <h1>{number}</h1>
            //     <button onClick={increase}>+1</button>
            //     <button onClick={decrease}>-1</button>
            //   </div>
        );
    }
}


// **** decorate 는 더 이상 필요 없어집니다. => yarn eject 이후 package.json 의 babel 설정을 customized 해서 최상단 처럼 @로 쓸 수가있음
// decorate(Counter, {
//   number: observable,
//   increase: action,
//   decrease: action
// })

// export default observer(Counter);
// **** observer 는 코드의 상단으로 올라갑니다.
export default Counter;