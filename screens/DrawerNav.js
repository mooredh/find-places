import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { createDrawerNavigator } from 'react-navigation';
import TabBarNavigator from './TabBarNavigator';
import SideDrawerScreen from './SideDrawerScreen';

const DrawerNav = createDrawerNavigator({
    TabBarNavigator: TabBarNavigator
}, {
    drawerPosition: 'left',
    contentComponent: SideDrawerScreen,
})

export default DrawerNav