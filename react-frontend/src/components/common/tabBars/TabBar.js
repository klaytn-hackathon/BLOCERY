import React, { Component } from 'react'
import { Home, List, Menu, PhotoLibrary, Face } from '@material-ui/icons'
import Style from './TabBar.module.scss'
import PropTypes from 'prop-types'
import { tabBarData } from '../../Properties'
import ComUtil from '../../../util/ComUtil'
import { getLoginUserType } from '../../../lib/loginApi'
class TabBar extends Component{

    constructor(props){
        super(props)
        this.state = {
            tabBarItems: null
        }
    }

    componentDidMount(){
        this.setUserType()
    }

    componentWillReceiveProps(nextProps){
        this.setUserType()
    }

    setUserType = async () => {
        const {data: userType} = await getLoginUserType()
        if(userType === '' || userType === 'consumer')
            this.setState({
                tabBarItems: tabBarData.shop
            })
        else
            this.setState({
                tabBarItems: tabBarData.producer
            })
    }

    onClick = (idx) => {

        window.location = this.state.tabBarItems[idx].pathname// props.data[0].pathname// "/main/recommend"

    }

    //탭바를 표시할지 여부
    isIgnored = () => {
        const pathname = this.props.ignoredPathnames.find(ignoredpathname => ignoredpathname === this.props.pathname)
        return pathname ? true : false
    }

    render(){
        if(ComUtil.isWebView()) return null
        if(this.state.tabBarItems === null) return null
        if(this.isIgnored()) return null

        return(
            <div className={Style.wrap}>
                {
                    this.state.tabBarItems.map((item, index)=>{
                        return(
                            <section key={item.pathname} onClick={this.onClick.bind(this,index)}>
                                <div>{<item.icon/>}</div>
                                <div className={this.props.pathname === item.pathname ? Style.active : null}>{item.name}</div>
                            </section>
                        )
                    })
                }
            </div>
        )
    }
}
TabBar.propTypes = {
    pathname: PropTypes.string.isRequired,
    ignoredPathnames: PropTypes.array      //탭바 표시하지 않을 pathname
}
TabBar.defaultProps = {
    ignoredPathnames: []
}
export default TabBar