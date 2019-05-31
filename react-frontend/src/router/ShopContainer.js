import React, { Component, Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import TopBar from '../components/shop/Header/Header'
import { LoginTab, Main, Goods, Buy, BuyConfirm, ConsumerJoin, InputAddress, JoinComplete, ProducerJoin, FarmersDetailActivity } from '../components/shop'
import Error from '../components/Error'
import MyPage from "../components/shop/mypage/Mypage";
import { TabBar } from '../components/common'
import ComUtil from '../util/ComUtil'
import TokenHistory from "../components/shop/mypage/TokenHistory";
import OrderDetail from "../components/common/orderList/OrderDetail";

class ShopContainer extends Component {
    constructor(props) {
        super(props);
    }

    //iPhone(web 접속)일 경우 아래 TabBar 만큼 마진값 적용
    getStyle = () => {
        if(!ComUtil.isWebView()){
            return {
                position: 'relative',
                marginBottom: '70px'
            }
        }
        return null
    }

    render() {
        return(
            <Fragment>
                <div style={this.getStyle()}>
                    <Switch>
                        <Route path='/login' component={LoginTab}/>
                        <Route path='/join' component={ConsumerJoin}/>
                        <Route path='/producerJoin' component={ProducerJoin}/>
                        <Route path='/joinComplete' component={JoinComplete}/>
                        <Route exact path='/' render={()=>(<Redirect to={'/main/recommend'}/>)} />
                        <Route path={'/main/:id'} component={Main}/>
                        <Route path={'/goods'} component={Goods}/>
                        <Route path={'/farmersDetailActivity'} component={FarmersDetailActivity}/>
                        <Route path={'/buy'} component={Buy}/>
                        <Route path={'/buyConfirm'} component={BuyConfirm}/>
                        <Route path={'/inputAddress'} component={InputAddress}/>
                        {/*<Route path={'/main/recommend'} component={Main} />*/}
                        {/*<Route path={'/main/resv'} component={Main} />*/}

                        {/* 임시 route */}
                        <Route path={'/mypage'} component={MyPage}/>
                        <Route path={'/tokenHistory'} component={TokenHistory}/>
                        <Route path={'/orderDetail'} component={OrderDetail}/>

                        <Route component={Error}/>
                    </Switch>
                </div>
                <TabBar
                    pathname={this.props.history.location.pathname}
                    ignoredPathnames={['/goods', '/buy', '/buyConfirm', '/orderDetail']}
                />
            </Fragment>
        )
    }
}

export default ShopContainer
