import React, { Component, Fragment } from 'react'
import { Modal, ModalHeader, ModalBody, Button, ModalFooter } from 'reactstrap'
import PropTypes from 'prop-types'
class ModalPopup extends Component {
    constructor(props){
        super(props)
        this.state = {
            modal: true
        }
    }
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })

        //창이 닫히면 무조건 부모 콜백 호출
        if(!this.state.modal === false && this.props.onClick)
            this.props.onClick()
    }
    render(){
        return(
            <Fragment>
                <span onClick={this.toggle}>
                {
                    this.props.children
                }
                </span>
                <div>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} centered>
                        <ModalHeader toggle={this.modalToggle}>{this.props.title}</ModalHeader>
                        <ModalBody>
                            { this.props.content }
                        </ModalBody>
                        <ModalFooter>
                            <Button color="info" onClick={this.toggle}>확인</Button>{' '}
                        </ModalFooter>
                    </Modal>
                </div>
            </Fragment>
        )
    }
}
ModalPopup.propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
    title: PropTypes.any.isRequired,
    content: PropTypes.any.isRequired,
    onClick: PropTypes.func
}
ModalPopup.defaultProps = {
    color: 'info',
    className: null
}
export default ModalPopup