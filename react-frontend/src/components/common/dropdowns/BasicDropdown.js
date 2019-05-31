import React, { Component } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import PropTypes from 'prop-types'
class BasicDropdown extends Component{
    constructor(props){
        super(props)
        this.state = {
            dropdownOpen: false
        }
    }
    toggle = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }
    onClick = (item) => {
        this.setState({
            value: item.value
        })

        this.props.onClick(item)
    }
    render(){


        let value = this.state.value || this.props.defaultValue

        const dropdown = this.props.data.find((item)=>{
            return item.value === value
        })

        return(
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret
                                tag="span"
                    // onClick={this.toggle}
                                data-toggle="dropdown"
                                aria-expanded={this.state.dropdownOpen}
                >
                    {
                        dropdown.text
                    }
                </DropdownToggle>
                <DropdownMenu>
                    {
                        this.props.data.map((item)=>{
                            return <DropdownItem active={item.value === value} key={item.value} onClick={this.onClick.bind(this, item)} value={item.value}>{item.text}</DropdownItem>
                        })
                    }
                </DropdownMenu>
            </Dropdown>
        )
    }
}
BasicDropdown.propTypes = {
    data: PropTypes.array.isRequired,
    defaultValue: PropTypes.any.isRequired
}
BasicDropdown.defaultProps = {
    data: []
}

export default BasicDropdown