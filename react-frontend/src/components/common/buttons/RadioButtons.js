import React, { Component } from 'react'
import { ButtonGroup, Button } from 'reactstrap'
import Style from './Style.module.scss'
import PropTypes from 'prop-types'


export default class RadioButtons extends Component{
    constructor(props){
        super(props)
        this.state = {
            rSelected: this.props.defaultIndex
        }
    }
    onClick = (rSelected) => {
        this.setState({ rSelected: rSelected });
        this.props.onClick(this.props.data[rSelected])
    }
    render(){
        return (
            <div>
                <ButtonGroup size={this.props.size} className={Style.wrap}>
                    {
                        this.props.data && this.props.data.map((item, index)=>{
                            const name = item[this.props.nameField]
                            return (
                                <Button
                                    key={name+index}
                                    color={this.props.color}
                                    onClick={() => this.onClick(index)}
                                    active={this.state.rSelected === index}>{name}</Button>
                            )
                        })
                    }
                </ButtonGroup>
            </div>
        )
    }
}

RadioButtons.propTypes = {
    nameField: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    defaultIndex: PropTypes.number,
    size: PropTypes.string,
    color: PropTypes.string
}
RadioButtons.defaultProps = {
    nameField: 'name',
    data: [],
    defaultIndex: 0,
    size: 'md',
    color: 'info'
}