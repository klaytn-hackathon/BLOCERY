import React, {Component} from 'react';
import {View} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './src/HomeScreen';
import PopupScreen from './src/PopupScreen';
import SplashScreen from './src/SplashScreen';

export default class App extends Component {
    render() {
        return (
            <View style={{flex: 1}}>
                <AppContainer/>

            </View>
        )
    }
}

const AppNavigator = createStackNavigator(
    {
        Splash: SplashScreen,
        Home: HomeScreen,
        Popup: PopupScreen
    },
    {
        initialRouteName: "Home",
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    }
);

const AppContainer = createAppContainer(AppNavigator);
