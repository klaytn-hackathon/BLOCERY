import React, { Component } from 'react'
import { Nav, NavItem, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, NavLink } from 'reactstrap'

//TODO 재배일지 상단의 정렬로 사용 가능하나, 현재 미완성(MVP에서 정렬기능이 필요없을 것으로 판단되 제거하거나 디자인 변경해야 될 것으로 예상됨)
export default class Sorter extends Component{
    constructor(props){
        super(props)
        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
        }

    }
    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        })
    }
    onSorterClicked = (e) => {
        this.props.onClick(e)
    }

    render(){
        return(
            <div style={{paddingRight: 10}}>
                <Nav pills className={'justify-content-end'}>

                    <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle} >
                        <DropdownToggle nav caret>
                            정렬
                        </DropdownToggle>
                        <DropdownMenu className={'dropdown-menu-right pull-right'} onClick={this.onSorterClicked.bind(this)}>
                            <DropdownItem>최신등록순</DropdownItem>
                            <DropdownItem>인기순</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </Nav>
            </div>
        )
    }
}

// const Sorter = () => {
//     return(
//         <div>Sorter</div>
//     )
// }
// export default Sorter