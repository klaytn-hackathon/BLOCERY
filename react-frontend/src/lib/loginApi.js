import axios from 'axios'
import { Server } from "../components/Properties";

/**
 * 로그아웃 수행.
 * usage:   await doLogout();
 */
export const doLogout = () => axios(Server.getRestAPIHost() + '/login', { method: "delete", withCredentials: true, credentials: 'same-origin' })
    .then((response) => {
        //autoLogin false, localStorage.setItem('autoLogin', false);
        localStorage.clear();
    });

/**
 * 로그인된 userType 가져오기, 로그인 되었는지 여부로도 사용가능.
 * usage:   let {data:userType} = await getLoginUserType();
 * returns:
 *         consumer, producer, admin, '':로그인 안되있는 경우.
 */
export const getLoginUserType = () => axios(Server.getRestAPIHost() + '/login/userType', { method: "get", withCredentials: true, credentials: 'same-origin' })


//자동 로그인시 사용. email,valword,userType 필요.
export const doLogin = (data) => axios(Server.getRestAPIHost() + '/login', {method: "post", data:data, withCredentials: true, credentials: 'same-origin'})

/**
 * 로그인된 user 가져오기
 * return '': 로그인 필요한 상태.
 *        LoginInfo: 백엔드 dbdata참조
 */
export const getLoginUser = () => axios(Server.getRestAPIHost() + '/login', { method: "get", withCredentials: true, credentials: 'same-origin' })
    .then((response)=> {
        console.log(response);
        if (response.data === '') {  //return null
            console.log('NEED to LOGIN');
            return '';
        }
        if (response.data.status === 200) {
            return response.data;

        }else {
            console.log('getLoginUser ERROR:' + response.data.status);
            return '';
        }
    }).catch(function (error) {
        console.log(error);
    });


export const checkPassPhrase = (data) => axios(Server.getRestAPIHost() + '/login/passPhrase', { method: "post", params:{ passPhrase: data }, withCredentials: true, credentials: 'same-origin' })