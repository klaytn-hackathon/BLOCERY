import React, { Component, Fragment } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ProducerNav, ProducerXButtonNav } from '../components/common'
import { ProducerMenuList } from '../components/Properties'
import { TabBar } from '../components/common'
class ProducerContainer extends Component {
    constructor(props) {
        super(props)
    }

    //라우터로부터 넘어온 :id 로 메뉴조회 (Properties.js 참조)
    getMenu = (id) => {
        return ProducerMenuList.find(item => item.route === 'producer' && item.id === id)
    }

    render() {

        const url = this.props.match.url                        //ex) /producer/farmDiaryList
        const id = this.props.match.params.id                   //ex)           farmDiaryList    //상위 route 에서 /producer/:id 로 지정되어있음(/index.js 참조)
        const { route, name, page, menuNav, closeNav } = this.getMenu(id)     //라우터로부터 넘어온 :id 로 메뉴조회
        return(

            <div>
                {
                    // Navigation - menu
                    menuNav && (
                        <Fragment>
                            <ProducerNav id={id}/>
                            <div style={{height:'3em'}}></div>
                        </Fragment>
                    )
                }
                {
                    // Navigation - XButton & Title
                    // closeNav && <ProducerXButtonNav name={name}/>
                }

                {
                    // Content
                    <div style={{marginBottom: '10em'}}>
                        <Route path={url} component={page} />
                    </div>
                }

                <TabBar
                    pathname={this.props.history.location.pathname}
                />

            </div>

            // <Switch>
            //     <Route path='/producer/join' component={Producer.ProducerJoin} />
            //     <Route path='/producer/goodsReg' component={Producer.GoodsReg} />
            //     <Route path='/producer/diaryReg' component={Producer.DiaryReg} />
            //     <Route path='/producer' component={Producer.FarmDiaryList} />
            //     <Route path='/producer/farmDiaryList' component={Producer.FarmDiaryList} />
            // </Switch>
        )
    }
}

export default ProducerContainer