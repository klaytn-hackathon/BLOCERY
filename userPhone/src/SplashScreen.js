import React from 'react';
import { StyleSheet, Platform, AsyncStorage, ImageBackground } from 'react-native';
import ClearCacheModule from './ClearNativeAppCache';
import axios from 'axios'
import { Server } from './Properties';

const timer = require('react-native-timer');
const VERSION_KEY = "version";

export default class SplashScreen extends React.Component {

    static navigationOptions = {
        title: 'splash',
        header: null
    };

    componentWillMount() {
        timer.clearTimeout(this);
    }

    componentDidMount() {
        console.log("*********** SplashScreen componentDidMount()");
        if(Platform.OS === 'android') {
            // 서버에서 버전 체크후 캐시삭제.
            this.deleteAndroidCache();
        }

        this.goHomeScreen();
    }

    componentWillUnmount() {
        console.log("*********** SplashScreen componentWillUnmount()");
    }

    deleteAndroidCache = async() => {
        let oldVersion = await AsyncStorage.getItem(VERSION_KEY);
        console.log('=============== oldVersion', oldVersion);

        let versionResult;
        axios(Server.getRestAPIHost() + '/version', { method: "get", withCredentials: true, credentials: 'same-origin' })
            .then((response)=> {
                versionResult = response.data;
                console.log('============= versionResult : ', versionResult);

                if(oldVersion === null || oldVersion !== versionResult) {
                    AsyncStorage.setItem(VERSION_KEY, versionResult);
                    console.log('============= is different Version');
                    ClearCacheModule.deleteCache();
                    return true;
                }
                console.log('=============== version is not updated');
                return false;

            }).catch(function (error) {
            console.log(error);
        });
    };

    goHomeScreen = () => {
        timer.setTimeout(
            this, 'goMain', () => this.props.navigation.goBack(), 3000);
    }

    render() {
        return (
            <ImageBackground
                source={require('./img/splash.jpg')}
                style={{width: '100%', height: '100%'}}>
            </ImageBackground>
        )

    }
}
