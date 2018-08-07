import React, { Component } from 'react';
import {  View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import FindPlaceScreen from './FindPlace';
import PlaceDetailScreen from './PlaceDetailScreen';

const FindPlaceStack = createStackNavigator(
    {
        FindPlace: FindPlaceScreen,
        PlaceDetail: PlaceDetailScreen,
    },
)

export default FindPlaceStack
