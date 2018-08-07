import React, { Component } from 'react';
import {  View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import SharePlaceScreen from './SharePlace';

const SharePlaceStack = createStackNavigator(
    {
        SharePlace: SharePlaceScreen,
    },
)

export default SharePlaceStack
