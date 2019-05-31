import React from 'react';
import { ToastAndroid, View, WebView, BackHandler, Platform } from 'react-native';
import { Server } from './Properties';
import BottomNavigation, {FullTab} from 'react-native-material-bottom-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AndroidWebView from 'react-native-webview-file-upload-android';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info'
// 아이콘 검색 - https://materialdesignicons.com/

const getLoginUserType = () => axios(Server.getRestAPIHost() + '/login/userType', { method:"get", withCredentials: true, credentials: 'same-origin'});

export default class HomeScreen extends React.Component {

    static navigationOptions = {
        title: 'Home',
        header: null
    };

    webView = {
        canGoBack: false,
        ref: null
    }

    constructor(props){
        super(props);

        console.log('constructor ==== ')

        this.state = {
            key: 0,
            //isPopupOnScreen: false,
            source: {uri: Server.getMainPage()},
            tabs : [
                {
                    key: 'home',
                    icon: 'home-outline',
                    label: '홈',
                    barColor: '#f3f3f3',
                    pressColor: 'rgba(255,255,255,0.16)'
                },
                {
                    key: 'goods',
                    icon: 'package-variant',
                    label: '상품목록',
                    barColor: '#f3f3f3',
                    pressColor: 'rgba(255,255,255,0.16)'
                },
                {
                    key: 'farmDiary',
                    icon: 'notebook',
                    label: '재배일지',
                    barColor: '#f3f3f3',
                    pressColor: 'rgba(255,255,255,0.16)'
                },
                {
                    key: 'myPage',
                    icon: 'account-outline',
                    label: '마이페이지',
                    barColor: '#f3f3f3',
                    pressColor: 'rgba(255,255,255,0.16)'
                }
            ]
        }

        this.showSplashScreen();

    }

    renderIcon = icon => ({ isActive }) => (
        <Icon size={24} color='gray' name={icon} />
    )

    renderTab = ({ tab, isActive }) => (
        <FullTab
            isActive={isActive}
            key={tab.key}
            label={tab.label}
            labelStyle={{ color: '#313131' }}
            renderIcon={this.renderIcon(tab.icon)}
        />
    )

    sendInfoToWebView = async (key) => {

        console.log("sendInfoToWebView : ", key);
        let newKey = this.state.key+1;

        switch(key) {
            case 'home' :
                // newKey++;
                this.setState({
                    key: newKey,
                    source: {uri: Server.getMainPage()}
                });
                break;
            case 'goods' : {
                //producer 인지 check
                let {data: userType} = await getLoginUserType();
                let isProducer = (userType === 'producer');
                console.log('userType:'+userType);
                console.log('isProducer:'+isProducer);
                this.setState({
                    key: newKey,
                    source: {uri: Server.getGoodsPage(isProducer)}
                });
                break;
            }
            case 'farmDiary' : {
                //producer 인지 check
                let {data: userType} = await getLoginUserType();
                let isProducer = (userType === 'producer');
                this.setState({
                    key: newKey,
                    source: {uri: Server.getDiaryPage(isProducer)}
                });
                break;
            }
            case 'myPage' :
                this.setState({
                    key: newKey,
                    source: {uri: Server.getMyPage()}
                });
                break;
        }
    };

    onAndroidBackPress = () => {
        if (this.webView.ref) {  //this.webView.canGoBack 오작동 -
            this.webView.ref.goBack();

            //무조건 goBack하고 종료안내팝업.
            if (this.exitApp === undefined || !this.exitApp) {
                ToastAndroid.show('한 번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
                this.exitApp = true;

                this.timeout = setTimeout(
                    () => {
                        this.exitApp = false;
                    }, 2000
                );
            } else {
                clearTimeout(this.timeout);
                BackHandler.exitApp();
            }
        }
        return true;
    }

    componentWillMount() {
        if (Platform.OS === 'android') {
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            this.exitApp = false;
            this.backHandler.remove();// removeEventListener('hardwareBackPress');
        }
    }

    showSplashScreen = () => {
        this.props.navigation.navigate('Splash');
    };

    // popup
    goPopupScreen = (event) => {
        //console.log({eventData: event.nativeEvent.data});
        if (!event.nativeEvent.data) {
            return; //empty URL - 왜 호출되는지..
        }

        const { url, type } = JSON.parse(event.nativeEvent.data);


        if (type === 'APP_REFRESH') { //isNoUsePopup 용도로 추가. 로그인후 refresh문제 해결. - 현재 미사용.
            this.setState({key: this.state.key + 1});
            //alert('app_refresh');

        } else if (type === 'JUST_POPUP') {

            this.props.navigation.navigate('Popup', {
                url: Server.getServerURL() + url,
                onPopupClose: this.popupClosed //no refresh
            });

        } else if (type === 'NEW_POPUP') {

            this.props.navigation.navigate('Popup', {
                url: Server.getServerURL() + url,
                onPopupClose: this.popupCloseAndRefresh //callback-refresh
            });

        }else if (type === 'CLOSE_POPUP') {
            console.log('###  HomeScreen: CLOSE_POPUP');

        } else { //APP_LOG
            console.log(url); //url에 변수를 넣어서 찍기
        }
    };

    popupClosed = (data) => {

        const { url, param } = JSON.parse(data)
        console.log('#######################HomeScreen : just popupClosed -' + url);

        //페이지 Redirection : ClosePopupAndMovePage
        if (url) { //URL refresh
            const uri = {uri: Server.getServerURL() + url}
            this.setState({
                key: this.state.key+1,  //새로고침을 위해
                source: uri
            })
        }
    }


    //popup이 닫힐 때 callback.   string으로 넘어옴
    popupCloseAndRefresh = (data) => {

        console.log('#######################HomeScreen : popupClosed');

        const { url, param } = JSON.parse(data)
        console.log('#######################HomeScreen : popupClosed -' + url);
        //
        //페이지 Redirection : ClosePopupAndMovePage
        if (url) { //URL refresh
            const uri = {uri: Server.getServerURL() + url}
            this.setState({
                key: this.state.key+1,  //새로고침을 위해
                source: uri
            })
        } else {
            //팝업 닫을 때 refresh. : CLOSE_POPUP
            this.setState({key: this.state.key + 1});// - 혹시 refresh 필요시. 호출
        }


        // else { //fronEnd로 전달.
        //     this.webView.ref.postMessage(data);
        // }

    }

    render() {
        return (
            <View style={{flex: 1}}>
                {Platform.select({
                    android: () => <AndroidWebView
                        //source={{ uri: 'https://mobilehtml5.org/ts/?id=23' }}
                        userAgent = {'BloceryApp-Android:'+ DeviceInfo.getUserAgent()}
                        key={this.state.key}
                        source={this.state.source}
                        ref={(webView) => {
                            this.webView.ref = webView;
                        }}
                        onNavigationStateChange={(navState) => {
                            this.webView.canGoBack = navState.canGoBack;
                        }}
                        // onMessage={(event) => this.goPopupScreen(event)}
                        onMessage={this.goPopupScreen}
                    />,
                    ios:  () => <WebView
                        //source={{ uri: 'https://mobilehtml5.org/ts/?id=23' }}
                        userAgent = {'BloceryApp-IOS:'+ DeviceInfo.getUserAgent()}
                        key={this.state.key}
                        source={this.state.source}
                        ref={(webView) => {
                            this.webView.ref = webView;
                        }}
                        onNavigationStateChange={(navState) => {
                            this.webView.canGoBack = navState.canGoBack;
                        }}
                        // onMessage={(event) => this.goPopupScreen(event)}
                        onMessage={this.goPopupScreen}
                    />
                })()}

                <BottomNavigation
                    onTabPress={newTab => this.sendInfoToWebView(newTab.key)}
                    renderTab={this.renderTab}
                    tabs={this.state.tabs}
                />
            </View>

        );
    }
}