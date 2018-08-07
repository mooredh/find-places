import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Icon, Container, Button } from 'native-base';
import { authLogout } from '../store/actions/auth';
import { connect } from 'react-redux';

class SideDrawerScreen extends Component {
  logoutHandler = () => {
          this.props.onLogout().then(() => {
          this.props.navigation.navigate('Auth')
        })
    }
  render() {
    return (
      <Container style={{paddingTop: 40, flex: 1}}>
        <Button onPress={() => this.logoutHandler()} style={{flexDirection: 'row', backgroundColor: '#eee', width: '100%', justifyContent: 'flex-start',}}>
          <Icon name="log-out" style={{color: '#aaa'}} />
          <Text>Sign Out</Text>
        </Button>
      </Container>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(authLogout())
  }
}

export default connect(null, mapDispatchToProps)(SideDrawerScreen)