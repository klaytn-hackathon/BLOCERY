import React from 'react';
import PropTypes from 'prop-types';
import { ProducerXButtonNav } from '../../common'
import Style from './ProducerFullModalPopupWithNav.module.scss'
class ProducerFullModalPopupWithNav extends React.Component {

    render() {
        if(!this.props.show) {
            return null;
        }

        return (

            <div className={Style.wrap} >
                {
                    /* X 버튼을 눌렀을때 파라미터를 null 값으로 전송하기 위함 */
                    this.props.disableNav || <ProducerXButtonNav name={this.props.title} onClose={this.props.onClose.bind(this, null)}/>
                }
                {
                    /* 상단 navigation height : 45px */
                }
                <div style={{marginTop: this.props.disableNav ? 15 : 45}}>
                    {
                        //children 객체에 props 를 전달
                        React.cloneElement(this.props.children, {
                                ...this.props,
                                onClose: this.props.onClose     //callback
                        })
                    }
                </div>
            </div>

        );
    }
}

ProducerFullModalPopupWithNav.propTypes = {
    title: PropTypes.any,
    disableNav: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node
};

ProducerFullModalPopupWithNav.defaultProps = {
    disableNav: false,
    show: false
}

export default ProducerFullModalPopupWithNav;