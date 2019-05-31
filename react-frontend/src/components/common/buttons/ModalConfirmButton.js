import React, { Component, Fragment } from 'react'
import { Modal, ModalHeader, ModalBody, Input, Button, ModalFooter } from 'reactstrap'
import PropTypes from 'prop-types'
class ModalConfirm extends Component {
    constructor(props){
        super(props)
        this.state = {
            modal: false
        }
    }
    onClick = (isConfirm) => {
        this.toggle()
        this.props.onClick(isConfirm)
    }
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })
    }
    render(){
        return(
            <Fragment>
               <Button color={this.props.color} onClick={this.toggle}>{this.props.children}</Button>{' '}
                <div>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} centered>
                        <ModalHeader toggle={this.modalToggle}>{this.props.title}</ModalHeader>
                        <ModalBody>
                            {/*<Input name="inputPassPhrase" type="text" placeholder= onChange={this.passPhraseInput}/>*/}
                            { this.props.content }
                        </ModalBody>
                        <ModalFooter>
                            <Button color="info" onClick={this.onClick.bind(this, true)}>확인</Button>{' '}
                            <Button color="secondary" onClick={this.onClick.bind(this, false)}>취소</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            </Fragment>
        )
    }
}
ModalConfirm.propTypes = {
    color: PropTypes.string,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
}
ModalConfirm.defaultProps = {
    color: 'info'
}
export default ModalConfirm