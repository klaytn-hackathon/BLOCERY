import React from 'react';
import { View, Text, Button, WebView, BackHandler, Platform } from 'react-native';
import { Server } from './Properties';
import AndroidWebView from 'react-native-webview-file-upload-android';
import DeviceInfo from 'react-native-device-info';


export default class PopupScreen extends React.Component {

    static navigationOptions = {
        title: 'Popup',
        header: null
    };

    webView = {
        canGoBack: false,
        ref: null
    };

    constructor(props) {
        super(props);

        //console.log('PopupScreen url : ' + this.props.navigation.getParam('url', 'default url'));
        //console.log('############## popup constructor:' + this);
        this.state = {
            url: this.props.navigation.getParam('url', 'default url'),
            key: 0
        };
    }

    componentWillMount() {
        // console.log('Popup componentWillMount()');
        if (Platform.OS === 'android') {
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
        }
    }

    componentDidMount() {
        // console.log('Popup componentDidMount()');

        // const { navigation } = this.props;
        // const goUrl = navigation.getParam('url', 'default url'); 
        // // console.log('url: ', goUrl);
        // this.setState({
        //     url: goUrl
        // });
    }

    componentWillUnmount() {

        if (Platform.OS === 'android') {
            this.backHandler.remove();// removeEventListener('hardwareBackPress');
        }
    }

    onAndroidBackPress = () => {

        console.log('###################### Popup: onAndroidBackPress:');
        this.props.navigation.goBack(); //popup안에서 back으로만 이동.
        this.props.navigation.state.params.onPopupClose(JSON.stringify({})); //부모(Home or Popup) callback

        return true;
        // if (this.webView.canGoBack && this.webView.ref) {
        //     this.webView.ref.goBack();
        //     return true;
        // }
        // return false;
    };

    onMessage = (event) => {
        console.log('###################### PopupScreen : ');//event.nativeEvent.data)

        const { url, type, param } = JSON.parse(event.nativeEvent.data)

        if(type === 'NEW_POPUP') {

            //this.popupDepth += 1;
            //alert('NEW_POPUP on POPUP'+ PopupScreen.popupDepth);

            this.props.navigation.push('Popup', {
                url: Server.getServerURL() + url,
                onPopupClose: this.parentPopupRefresh
            })

        }else if(type === 'CLOSE_POPUP'){

            console.log('###################### Popup: CLOSE_POPUP:');
            this.props.navigation.goBack(); //popup닫기.
            this.props.navigation.state.params.onPopupClose(event.nativeEvent.data); //parentPopupRefresh or HomeScreen의 popupCloseAndRefresh

        } else { //APP_LOG
            console.log(url); //url에 변수를 넣어서 찍기
        }
    }

    // . string으로 넘어옴
    parentPopupRefresh = (data) => {
        console.log('PopupScreen parentPopupRefresh : ');
        //callback 미사용 : this.webView.ref.postMessage(data);
        this.setState({key: this.state.key + 1});

        //popup2개일 경우 한번 더  닫고, home의 url 변경
        const { url, type, param } = JSON.parse(data);
        if (url) {
            this.props.navigation.goBack(); //마지막 popup닫기
            if (this.props.navigation.state.params && this.props.navigation.state.params.onPopupClose) {//만약을 대비
                this.props.navigation.state.params.onPopupClose(data); //부모 callback - HomeScreen의 popupCloseAndRefresh 호출..
            }
        }
    }

    render() {

        return (
            <View style={{flex: 1}}>
                {Platform.select({
                    android: () => <AndroidWebView
                        userAgent = {'BloceryApp-Android:'+ DeviceInfo.getUserAgent()}
                        source={{uri: this.state.url}}
                        key={this.state.key}
                        ref={(webView) => {
                            this.webView.ref = webView;
                        }}
                        onNavigationStateChange={(navState) => {
                            this.webView.canGoBack = navState.canGoBack;
                        }}
                        onMessage={(event) => this.onMessage(event)}
                    />,
                    ios: () => <WebView
                        userAgent = {'BloceryApp-IOS:'+ DeviceInfo.getUserAgent()}
                        source={{uri: this.state.url}}
                        key={this.state.key}
                        ref={(webView) => {
                            this.webView.ref = webView;
                        }}
                        onNavigationStateChange={(navState) => {
                            this.webView.canGoBack = navState.canGoBack;
                        }}
                        onMessage={(event) => this.onMessage(event)}
                    />
                })()}

            </View>
        )
    }

}