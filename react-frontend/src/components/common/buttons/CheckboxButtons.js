import React, { Component } from 'react'
import { ButtonGroup, Button } from 'reactstrap'
import Style from './Style.module.scss'
import PropTypes from 'prop-types'

export default class CheckboxButtons extends Component{
    constructor(props){
        super(props)
        this.state = { cSelected: [] }
    }
    onClick = (selected) => {
        const index = this.state.cSelected.indexOf(selected);
        if (index < 0) {
            this.state.cSelected.push(selected);
        } else {
            this.state.cSelected.splice(index, 1);
        }
        this.setState({ cSelected: [...this.state.cSelected] });

        const data = this.state.cSelected.map(selectedIndex => this.props.data[selectedIndex])
        this.props.onClick(data)
    }
    render(){
        return (
            <div>
                <ButtonGroup size={this.props.size} className={Style.wrap}>
                    {
                        this.props.data && this.props.data.map((item, index)=>{
                            const name = item[this.props.nameField]
                            return <Button
                                key={name+index}
                                color={this.props.color}
                                onClick={() => this.onClick(index)}
                                active={this.state.cSelected.includes(index)}>{name}</Button>
                        })
                    }

                </ButtonGroup>
            </div>
        )
    }
}
CheckboxButtons.propTypes = {
    nameField: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    defaultIndex: PropTypes.number,
    size: PropTypes.string,
    color: PropTypes.string
}
CheckboxButtons.defaultProps = {
    nameField: 'name',
    data: [],
    defaultIndex: 0,
    size: 'md',
    color: 'info'
}