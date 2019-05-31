import { autorun } from 'mobx'
import { observable, action, computed, configure } from 'mobx';

//User Strict 모드 : 항상 @action 을 붙이도록 강제함, observable 을 immutable 하게 함
configure({enforceActions: "always"});


class CounterStore {
    /*
      @Observable 값을 변경하는(Setter)에 사용하는 API다.
      기본적으로 MobX에서는 Observable 값을 변경하는 메소드에는 action을 달아줄 것을 권장하지만 쓰지 않아도 정상적으로 동작한다
    */

    @observable state = "done" // "pending" / "done" / "error"

    @observable number = 0

    @action increase = () => {
        this.number++;
    }

    @action decrease = () => {
        this.number--;
    }

    @action resetNumber = (num) => {
        this.number = num
    }
    /*
        @computed는 Observable 값에 대해서 적절한 계산이 필요할 때 사용하는 API다.
        Observable 값이 변경되면 그 값이 파생되어 Computed 값도 변경되고 이렇게 변경되는 값 역시 참조할 수 있다.
        @computed 를 사용하고 안하고는 보기엔 차이가 없지만 캐싱 되기때문에 성능상 쓰는것이 훨씬 좋음
        Getter에만 사용할 수 있으며, 따라서 추가 인자를 받을 수가 없다. 입력 인자가 this로 제한되는 순수함수라고 생각하면 이해하기 편하다.(물론 순수함수는 아니다.)
    */

    @computed
    get nowNumber(){
        return this.number * 10
    }


    /*
      API 호출참고
      https://mobx.js.org/best/actions.html
    */
    @action
    fetchCount = (num) => {
        this.state = 'pending'

        const updatedNumber = this.number + num;
        //ajax callback
        setTimeout(()=>{

            const data = {number: updatedNumber};
            this.fetchCountSuccess(data)

        }, 1000)
    }

    @action.bound
    fetchCountSuccess(result){
        this.state = 'done'
        const { number } = result
        this.number = number

    }
    @action.bound
    fetchCountError(error) {
        this.state = 'error'
    }

    /*
        autorun 은 observable 값이 변경 될때마다 호출 됩니다.
        하지만!! 직접적인 this.props.count.number = 10
    */
    autorun = autorun(()=>{
        // to do something
        console.log('autorun 이벤트 (Observable 의 값이 변경되면 자동 호출됩니다): ', this.number)
    }, {delay: 1000})

}
export default new CounterStore()