import React, { Component } from 'react'
import { Text, View, Dimensions } from 'react-native'
import { Container, Button, Content, } from 'native-base'

const SCREEN_WIDTH = Dimensions.get('window').width

export default class ShareContent extends Component {
  render() {
    return (
      <Content>
        <View 
        style={{ 
          width: '100%', 
          height: SCREEN_WIDTH * 0.5, 
          alignSelf: 'center', 
          backgroundColor: 'grey',
        }} 
        >
        {this.props.children || null}
        </View>
        <Button 
        block 
        style={{ 
            width: '100%', 
            alignSelf: 'center', 
            marginVertical: 10, 
            backgroundColor: "#f34e66", }}
        onPress={this.props.onPressButton || null}
        >
            <Text style={{color: '#fff'}}>
            {this.props.buttonText || null}
            </Text>
        </Button>
    </Content>
    )
  }
}