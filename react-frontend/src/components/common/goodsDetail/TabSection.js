import React, { Component, Fragment } from 'react'
import Style from './GoodsDetail.module.scss'
import PropTypes from 'prop-types'
class TabSection extends Component{
    constructor(props){
        super(props)
        this.state = {
            activeIndex: 0,
            content: null
        }

        console.log(this.props)
    }
    onClick = (index, item, e) => {
        this.setState({
            activeIndex: index,
            content: item.content
        })
    }
    render(){
        const items = this.props.items
        const content = items[this.state.activeIndex].content || null
        return(
            <Fragment>
                <div className={Style.tabSticky}>
                    {
                        items.map((item, index)=>{
                            return(
                                <a
                                    key={item.name+index}
                                    // href={`#section${index}`}
                                    className={index === this.state.activeIndex ? Style.active: null}
                                    onClick={this.onClick.bind(this, index, item)}
                                >
                                    {item.name}
                                </a>
                            )
                        })
                    }
                </div>
                {
                    content
                }
            </Fragment>
        )
    }
}
TabSection.propTypes = {
    items: PropTypes.array.isRequired
}
TabSection.defaultProps = {
    items: []
}
export default TabSection