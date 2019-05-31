import React, { Component, Fragment } from 'react';
import { Header } from '../Header'
import { MainCategory } from '../MainCategories'
import './Card.scss'
import queryString from 'querystring'

import { Route, Switch, Redirect } from 'react-router-dom'

import Goods from '../../common/goodsDetail'

import { Recommend } from '../Recommend'
import { Resv } from '../Resv'
import { FarmDiary } from '../FarmDiary'
import { getLoginUserType, doLogin, doLogout } from "../../../lib/loginApi";


export default class Main extends Component {
    constructor(props) {
        super(props)

    }

    //자동로그인을 우선 여기서 시험 중.
    async componentDidMount() {
        //test용  logout: await doLogout();

        if (localStorage.getItem('autoLogin')) {
            let {data:userType} = await getLoginUserType(); //로그인된 사용자 가져오기

            if (!userType) { //로그인이 안되어 있으면..
                let user = {
                    email: localStorage.getItem('email'),
                    valword: localStorage.getItem('valword'),
                    userType: localStorage.getItem('userType')
                }
                console.log({autoLoginUser: user});
                doLogin(user);
            }
        }
    }

    getContentPage = () => {
        const search = this.props.location.search
        const params = new URLSearchParams(search)
        const goodsNo = params.get('goodsNo')

        console.log(goodsNo)


        // goodsNo 가 있을경우
        if(goodsNo) return <Goods goodsNo={goodsNo} history={this.props.history}/>

        else{
            const id = this.props.match.params.id
            if(id === 'recommend') return <Recommend history={this.props.history}/>
            if(id === 'resv') return <Resv history={this.props.history}/>
            if(id === 'farmDiary') return <FarmDiary history={this.props.history}/>
        }

    }

    render() {
        const contentPage = this.getContentPage()

        return(
            <div>
                <Header/>
                {/*<MainCategory/>*/}
                {
                    contentPage
                }
            </div>
        )
    }
}
