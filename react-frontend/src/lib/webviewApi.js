import ComUtil from '../util/ComUtil';
import { createBrowserHistory } from 'history';



export const Webview = {

    //isNoUsePopup : false,  /** native팝업과 callback을 안쓰는 방식 - 항상 location 이동,  false로 하면 기존 방식*/

    /*******************************************************
     [public] 새로운 웹뷰 창 띄우기
     @Warning : 콜백을 넣을 경우 새창이 닫히면 무조건 실행을 하지만
                closePopupAndMovePage('url')를 통해 창을 닫았을 경우 콜백은 무시됩니다
     @Param : url : String,
             isNoRefresh : true일 경우 parent를 refresh안함:  default-false
     *******************************************************/
    openPopup: function(url, isNoRefresh){

        //기존 방식. => callback 미사용으로 수정 완료

        //callback 함수
        //this._addEventListener(callback)

        //if (!callback) this._removeEventListener()

        //일반 웹접속일 경우(개발환경 등에서는 그냥 이동
        if (!ComUtil.isWebView()) {
            window.location = url;
            history.push(url, { some: 'state' }); //refresh를 위해 적당한 state 추가.
            return;
        }

        let callType = (isNoRefresh)? 'JUST_POPUP' : 'NEW_POPUP';

        const data = {url: url, type: callType}
        window.postMessage(JSON.stringify(data))

    },

    /**
     * RN에서 로그출력.
     * @param log
     */
    appLog: function(log) { //RN에서 로그출력.
        if (ComUtil.isWebView()) {
            const data = {url: 'AppLog:' + log, type: 'APP_LOG'}
            window.postMessage(JSON.stringify(data))
        }
    },


    appRefresh: function() { //RN Refresh
        if (ComUtil.isWebView()) {
            const data = {type: 'APP_REFRESH'};
            window.postMessage(JSON.stringify(data))
        }
    },


    /*******************************************************
     [public] 웹뷰 창 닫기
     @Param : paramObj : Object
     *******************************************************/
    closePopup: function(paramObj){

        //일반 웹접속일 경우(개발환경 등에서는 그냥 이동
        if (!ComUtil.isWebView()) {
            //window.history.back();  //window.location.reload(window.history.back()); //Do not work.
            //goBackAndRefresh();

            history.goBack();  //history.js 새로 추가 - refresh까지 해줌 .
            return;
        }

        const param = paramObj || {}
        const data = {
            // url: '',
            type: 'CLOSE_POPUP',
            param: param
        }

        window.postMessage(JSON.stringify(data))

    },
    /*******************************************************
     [public] 웹뷰 창 닫고 페이지 이동
     @Warning :
     @Param : moveUrl : String
     *******************************************************/
    closePopupAndMovePage: function(url){

            //일반 웹접속일 경우(개발환경 등에서는 그냥 이동
            if (!ComUtil.isWebView()) {
                window.location = url;
                return;
            }

            const data = {url: url, type: 'CLOSE_POPUP'};
            window.postMessage(JSON.stringify(data));

    },
    // /*******************************************************
    //  [private] 콜백 함수 담아두는 변수(이벤트 등록된 콜백 함수를 기억 후 지워주기 위함)
    //  *******************************************************/
    // _callback: null,
    // /*******************************************************
    //  [private] 콜백 함수 등록
    //  @Param : callback : Function
    //  *******************************************************/
    // _addEventListener:  function(callback){
    //     if(typeof callback === 'function'){
    //         window.document.addEventListener('message', callback, false)
    //         this._callback = callback
    //     }
    // },
    // //콜백제거
    // _removeEventListener: function(){
    //     window.document.removeEventListener('message', this._callback, false)
    // }

}

const history = createBrowserHistory({
    forceRefresh: true
});
