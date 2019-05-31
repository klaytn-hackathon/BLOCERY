import DeviceInfo from 'react-native-device-info'

export const Server = {

    //private TEST 용도
    _isDeviceEmulator: function() {
        // return true;  //폰에서도 pc개발환경 강제 접속용
        return DeviceInfo.isEmulator(); // master소스는 항상 이걸로 세팅.
    },

    /* 중요: google Play 배포용도 */
    _isDeploy: function () {
        return false;  //master소스는 항상 이걸로 세팅
        //return true;   //구글 play배포시 이거로 세팅. AWS서버 이용
    },

    getServerURL: function() {
        const serverUrl = this._isDeploy() ? 'http://blocery.com' : 'http://210.92.91.225:8080'; //AWS IP: 'http://13.209.43.206'

        return this._isDeviceEmulator() ? 'http://localhost:3000' : serverUrl;
    },
    getMainPage: function() {
        return  this.getServerURL()  + '/main/recommend';
        // return this.getServerURL()  + '/producer/';
    },
    getGoodsPage: function(isProducer) {
        return isProducer ? (this.getServerURL()+'/producer/goodsList') : (this.getServerURL() + '/main/resv');
    },
    getDiaryPage: function(isProducer) {
        return  isProducer ? (this.getServerURL() + '/producer/farmDiaryList') : (this.getServerURL()+'/main/farmDiary');
    },
    getMyPage: function() {
        return (this.getServerURL()+'/mypage');
    },
    getRestAPIHost: function() {
        return this._isDeviceEmulator() ? 'http://localhost:8080/restapi' : this.getServerURL() + '/restapi';
    }

};
