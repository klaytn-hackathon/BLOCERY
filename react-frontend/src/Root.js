import React from 'react'
import App from './App'

import { Provider } from 'mobx-react' // mobx에서 사용하는 Provider로써
import * as stores from './stores'    // ./store 폴더내의 모든 인스턴스를 import 해서 Provider에 props 로 넘겨준다

console.log('stores:', stores)

const Root = () => (
    <Provider {...stores}>
        <App/>
    </Provider>
);

export default Root;