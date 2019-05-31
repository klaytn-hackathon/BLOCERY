import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'


import ShopContainer from './ShopContainer'
import AdminContainer from './AdminContainer'
import ProducerContainer from './ProducerContainer'
import SampleContainer from './SampleContainer'
import Error from '../components/Error'



class index extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <Router>

                <div>

                    <Switch>
                        {/*<Route exact path={"/"} render={() => (<Redirect to="/main" />)} />*/}
                        <Route path={'/admin'} component={AdminContainer} />

                        {/* producer 로 접속 하였을 경우 최초 페이지 지정 */}
                        <Route exact path={'/producer'} render={() => (<Redirect to={'/producer/farmDiaryList'}/>)} />
                        {/* producer/:id 가 있을경우 다시한번 분기를 타기위해 */}
                        <Route path={'/producer/:id'} component={ProducerContainer}/>

                        <Route path={'/sample'} component={SampleContainer}/>
                        <Route path={'/'} component={ShopContainer} />
                        <Route component={Error}/>
                    </Switch>
                </div>
            </Router>

        )
    }
}

export default index