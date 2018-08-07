import React, { Component } from 'react'
import { Text, View, Dimensions, StatusBar, Platform } from 'react-native'
import headerStyle from './headerStyle';
import { Header, Left, Title, Right, Icon, Body, Button } from 'native-base'

export default class AppHeader extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      hidden: Dimensions.get('window').height < 450 ? true : false
    }
  }
  
  statusBarVisibility = () => {
    if (Platform.OS === 'ios') {
      Dimensions.addEventListener('change', ({ window, screen }) => { 
        this.setState(prevState => ({hidden: Dimensions.get('window').height < 450 ? true : false}))
      })
    }
  }
  render() {
    return (
      <Header style={headerStyle.header}>
        <StatusBar hidden={this.state.hidden} showHideTransition="slide" />
        {this.statusBarVisibility()}
        <Left>
          <Button transparent onPress={this.props.onLeftPress || null}>
            <Icon name={this.props.leftIcon || null} style={{color: "#f34e66"}} />
          </Button>
        </Left>
        <Body>
          <Title>{this.props.title || ""}</Title>
        </Body>
        <Right>
          <Button transparent onPress={this.props.onRightPress || null}>
            <Icon name={this.props.rightIcon || null} style={{color: "#f34e66"}} />
          </Button>
        </Right>
      </Header>
    )
  }
}