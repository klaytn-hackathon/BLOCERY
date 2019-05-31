import React, { Component, Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

import { Header } from '../components/shop/Header'
import { Counter, ImageCompressor } from '../components/sample'
import SimpleStorageTest from '../components/SimpleStorageTest'
import TokenTest from '../components/TokenTest'


class SampleContainer extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <Fragment>
                <Header/>
                <Switch>
                    <Route path='/sample/mobx' component={Counter} />
                    <Route path='/sample/imageCompressor' component={ImageCompressor} />
                    <Route path='/sample/SimpleStorageTest' component={SimpleStorageTest} />
                    <Route path='/sample/TokenTest' component={TokenTest} />
                    <Route component={Error}/>
                </Switch>
            </Fragment>
        )
    }
}

export default SampleContainer