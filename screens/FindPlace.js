import React, { Component } from 'react';
import {  View, Text, StyleSheet, Animated } from 'react-native';
import List from '../components/List';
import { connect } from 'react-redux'
import { Icon, Header, Left, Button, Title, Body, Container, Right } from 'native-base';
import { getPlaces } from '../store/actions';
import AppHeader from '../components/AppHeader'

class FindPlaceScreen extends Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    
    this.state = {
      placesLoaded: false,
      removeAnim: new Animated.Value(1)
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.isDoneLoading && !this.props.isDoneLoading) {
      this.props.onLoadPlaces()
    }
  }

  
  componentWillMount() {
    this.props.onLoadPlaces()
  }
  
  
  placesSearchHandler = () => {
    Animated.timing(this.state.removeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start()
    setTimeout(() => {
      this.setState((prevState) => { return { placesLoaded: !prevState.placesLoaded }})
    }, 500);
  }

  selectedHandler = key => {
    const place = this.props.places.find(place => place.key === key)
    this.props.navigation.navigate('PlaceDetail', {
      place
    })
  }

  render() {
    let viewScale = this.state.removeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [12, 1],
      extrapolate: 'clamp'
    })
    let content = (
      <Animated.View style={{justifyContent: 'center', flex: 1, opacity: this.state.removeAnim, transform: [{scale: viewScale }]}}>
        <Button onPress={this.placesSearchHandler} rounded bordered block style={{ borderColor: '#f34e66', borderWidth: 5, alignSelf: 'center', width: '60%' }}>
          <Text style={{color: '#f34e66', fontSize: 30, fontWeight: 'bold', justifyContent: 'center',}}>Find Places</Text>
        </Button>
      </Animated.View>
      
    )
    if (this.state.placesLoaded) {
      content = (
        <View>
          <AppHeader title="Find Place" leftIcon="menu" onLeftPress={() => this.props.navigation.openDrawer()} />
          <List places={this.props.places} onItemSelected={this.selectedHandler} />
        </View>
      )
    }
    return (
      <Container>
        {content}
      </Container>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = (state) => {
  return {
    places: state.places.places,
    isDoneLoading: state.ui.isDoneLoading
  }
}

const mapDispatchToProps = dispatch => {
  return {
     onLoadPlaces: () => dispatch(getPlaces())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FindPlaceScreen)

