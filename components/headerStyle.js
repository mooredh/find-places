import React, { Component } from 'react'
import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native'

const headerStyle = StyleSheet.create({
    header: {
        ...Platform.select({
            android: {
                marginTop: StatusBar.currentHeight
            }
        })
    }
})

export default headerStyle