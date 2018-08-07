import React, { Component } from 'react'
import { Text, View } from 'react-native'
import AuthScreen from './screens/Auth'
import DrawerNav from './screens/DrawerNav';
import { Root } from 'native-base';
import { createSwitchNavigator } from 'react-navigation';

export default class Main extends Component {
  render() {
    return <Root><RootStack /></Root>
  }
}

const RootStack = createSwitchNavigator(
  {
    Auth: {
      screen: AuthScreen
    },
    TabBarNav: {
      screen: DrawerNav,
    }
  },
  {
    initialRouteName: 'Auth',
  }
  
)