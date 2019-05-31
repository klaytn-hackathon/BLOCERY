import React from 'react'
import Style from './ShopXButtonNav.module.scss'
import PropTypes from 'prop-types'
import { Webview } from '../../../lib/webviewApi'
import { BrowserHistory } from 'react-router-dom'
import { XButton } from '../../common'

const ShopXButtonNav = (props) => {

    const home = () => {
        Webview.closePopupAndMovePage('/');
    }

    const close = () => {
        Webview.closePopup();
    }

    const back = () => {
        if(props.history.action === 'PUSH') props.history.goBack(); //팝업 안에서 이동.
        else window.location = '/main/recommend'    //페이지가 window.location 을 통해 들어왔을 경우 history의 goBack() 할 수가 없어 메인 페이지로 이동하게 함
    }

    return(
        <div className={Style.wrap}>
            {
                //home(버튼은 close와 동일), close, back 처리.
                props.backClose ?  <XButton back onClick={close}/> :
                    (props.home ? <XButton close onClick={home}/> : (props.close ? <XButton close onClick={close}/> : <XButton back onClick={back}/>) )
            }
            <div className={Style.name}>{props.children}</div>
        </div>
    )
}

ShopXButtonNav.propTypes = {
    close: PropTypes.bool
}
ShopXButtonNav.defaultProps = {
    close: false
}


export default ShopXButtonNav