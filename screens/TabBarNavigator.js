import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { createBottomTabNavigator } from 'react-navigation';
import FindPlaceStack from './FindPlaceStack';
import SharePlaceStack from './SharePlaceStack'
import Icon from 'react-native-vector-icons/Ionicons'

const TabBarNavigator = createBottomTabNavigator(
    {
        FindPlace: {
            screen: FindPlaceStack,
        },
        SharePlace: {
            screen: SharePlaceStack
        }
    },
    {
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                if (routeName === 'FindPlace') {
                    iconName = `ios-map${focused ? '' : '-outline'}`;
                } else if (routeName === 'SharePlace') {
                    iconName = `ios-share-alt${focused ? '' : '-outline'}`;
                }

                return <Icon name={iconName} size={25} color={tintColor} />;
            },
        }),
        tabBarOptions: {
            activeTintColor: '#f34e66',
            inactiveTintColor: 'gray',
            showLabel: false,
        }
    }
)

export default TabBarNavigator