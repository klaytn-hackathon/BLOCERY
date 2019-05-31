import React from 'react';
import PropTypes from 'prop-types';
// import { ProducerXButtonNav } from '../../common'
import { Close } from '@material-ui/icons'
import Style from './ModalWithNav.module.scss'
import classNames from 'classnames'
class ModalWithNav extends React.Component {

    onCancel = (e) => {
        this.props.onClose(null)
        e.stopPropagation()
    }

    stopPropagation = (e) => {
        e.stopPropagation()
    }

    render() {
        if(!this.props.show) {
            return null;
        }

        return (

            <div className={Style.wrap} onClick={this.onCancel}>
                <div className={Style.modal}>
                    <header>
                        <div onClick={this.stopPropagation}>{this.props.title}</div>
                        <div onClick={this.onCancel}>
                            <Close/>
                        </div>
                    </header>
                    <figure className={classNames(Style.body, this.props.noPadding ? Style.noPadding : null)} onClick={this.stopPropagation}>
                        {
                            //children 객체에 props 를 전달
                            React.cloneElement(this.props.children, {
                                ...this.props,
                                onClose: this.props.onClose,     //callback
                                onLoad: this.props.onLoad
                            })
                        }
                    </figure>
                </div>
            </div>
        );
    }
}

ModalWithNav.propTypes = {
    title: PropTypes.any,
    onClose: PropTypes.func.isRequired,
    onLoad: PropTypes.func,
    show: PropTypes.bool,
    children: PropTypes.node,
    noPadding: PropTypes.bool
};

ModalWithNav.defaultProps = {
    show: false,
    noPadding: false,
    onLoad: ()=>{}
}

export default ModalWithNav;