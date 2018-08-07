import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import PlaceDetail from './PlaceDetail';
import { connect } from 'react-redux'
import { deletePlace, } from '../store/actions'
import { Container, Button, Icon } from 'native-base';
import AppHeader from '../components/AppHeader';

class PlaceDetailScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: null
    })
    deleteHandler = async (key) => {
        this.props.onDeletePlace(key)
        this.props.navigation.goBack()        
    }

  render() {
      const { navigation } = this.props
    
    return (
      <Container>
        <AppHeader title={navigation.getParam('place', {}).value} leftIcon="arrow-back" onLeftPress={() => navigation.goBack()} />
        <PlaceDetail place={navigation.getParam('place', {})} onItemDeleted={this.deleteHandler}/>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onDeletePlace: (key) => dispatch(deletePlace(key)),
  }
}

export default connect(null, mapDispatchToProps)(PlaceDetailScreen)
