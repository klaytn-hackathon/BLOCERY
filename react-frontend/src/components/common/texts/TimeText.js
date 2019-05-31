import React, { Component } from 'react'
import ComUtil from '../../../util/ComUtil'
import Style from './TimeText.module.scss'
import PropTypes from 'prop-types'
class TimeText extends Component{
    constructor(props){
        super(props)
        this.state = {}
    }
    componentWillMount(){
        clearInterval(this.state.intervalId);
    }
    componentDidMount(){

        this.timer()

        var intervalId = setInterval(this.timer, 1000);
        // store intervalId in the state so it can be accessed later:
        this.setState({intervalId: intervalId});
    }
    componentWillUnmount(){
        clearInterval(this.state.intervalId);
    }
    timer = () => {
        const diff = ComUtil.getDateDiffTextBetweenNowAndFuture(this.props.date, this.props.formatter)
        this.setState({
            diff: diff
        })
    }
    render(){
        return(
            <span className={Style.text}>{this.state.diff}</span>
        )
    }
}
TimeText.propTypes = {
    date: PropTypes.number.isRequired,
    formatter: PropTypes.string
}
TimeText.defaultProps = {
    formatter: '[D -] DD[일] HH[시] mm[분] ss[초]'
}
export default TimeText