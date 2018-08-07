import React, { Component } from 'react'
import { StyleSheet, Image, Keyboard, Dimensions, CameraRoll, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import { addPlace } from '../store/actions'
import ShareContent from '../components/ShareContent';
import { Container, Content, Text, View, ActionSheet } from 'native-base'
import ShareInput from '../components/ShareInput';
import AppHeader from '../components/AppHeader';
import { MapView, Marker, ImagePicker, Permissions } from 'expo';

const BUTTONS = ["Take photo", "Choose from Camera Roll...", "Cancel"];
const CANCEL_INDEX = 3;

class SharePlaceScreen extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)

    this.state = {
      placeName: "",
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0122,
        longitudeDelta: 
          Dimensions.get('window').width / 
          Dimensions.get('window').height * 
          0.0122
      },
      locationChosen: false ,
      imageUri: {},
    }
  }

  submitHandler = async () => {
    if (this.state.placeName.trim() === "") {
      return;
    } else {
      Keyboard.dismiss()
      this.setState(prevState => {
        return {
          ...prevState,
          placeName: "",
          imageUri: {},
          locationChosen: false
        }
      })
      await this.props.onAddPlace(this.state.placeName.trim(), this.state.imageUri, this.state.region)
      this.props.navigation.navigate('FindPlace', {reload: true})
    }
  }

  pickLocationHandler = event => {
    const coords = event.nativeEvent.coordinate;
    this.map.animateToRegion({
      ...this.state.region,
      latitude: coords.latitude,
      longitude: coords.longitude
    })
    this.setState(prevState => ({...prevState, region: {
      ...prevState.region,
      latitude: coords.latitude,
      longitude: coords.longitude
    },
    locationChosen: true
    }))
  }

  getLocationHandler = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      const coordsEvent = {
        nativeEvent: {
          coordinate: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }
        }
      }
      this.pickLocationHandler(coordsEvent);
    }, 
  err => {
    console.warn(err)
    alert("Fetch failed, please pick location manually")
  })
  }

  actionSheetHandler = () => {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: "Pick image option"
      },
      async (buttonIndex) => {
        const cameraRollPermission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
        if (cameraRollPermission.status !== 'granted') {
          await Permissions.askAsync(Permissions.CAMERA_ROLL);
        }
        const cameraPermission = await Permissions.getAsync(Permissions.CAMERA);
        if (cameraPermission.status !== 'granted') {
          await Permissions.askAsync(Permissions.CAMERA);
        }
        if (buttonIndex === 1 && cameraRollPermission.status === 'granted') {
          const { cancelled, uri, base64 } = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, base64: true, quality: 0.6 });
          if (!cancelled) {
            this.setState({ imageUri: { uri, base64 } });
          }
        }
        if (buttonIndex === 0 && cameraRollPermission.status === 'granted') {
          const { cancelled, uri, base64 } = await ImagePicker.launchCameraAsync({ allowsEditing: true, base64: true, quality: 0.6 });
          if (!cancelled) {
            await CameraRoll.saveToCameraRoll(uri)
            this.setState({ imageUri: { uri, base64 } });
          }
        }
      }
    )
  }

  render() {
    let marker = null;
    if (this.state.locationChosen) {
      marker = <MapView.Marker coordinate={this.state.region} pinColor="#f34e66" />
    }

    return (
      <Container>
        <AppHeader title="Share Place" leftIcon="menu" onLeftPress={() => this.props.navigation.openDrawer()} />
        <Content contentContainerStyle={{marginHorizontal: 30,}}>
          <Content>
          <Text 
          style={{
            alignSelf: 'center', 
            marginVertical: 10, 
            fontWeight: 'bold', 
            fontSize: 25,}}
          >Share a Place with us!</Text>          
          </Content>
          <ShareContent onPressButton={this.actionSheetHandler} buttonText="Pick Image">
            <Image 
            source={this.state.imageUri} 
            ref={ref => this.imageView = ref}
            style={{ 
              flex: 1,
              width: null, 
              height: null, 
              resizeMode: 'cover' }} 
            />
          </ShareContent>
          <ShareContent onPressButton={this.getLocationHandler} buttonText="Locate Me">
            <MapView
            onPress={this.pickLocationHandler}
            style={{
              width: '100%', 
              height: '100%'
            }}
            initialRegion={this.state.region}
            ref={ref => this.map = ref}
            >
            {marker}
            </MapView>
          </ShareContent>
          <ShareInput loading={this.props.isLoading} placeName={this.state.placeName} buttonDisabled={!this.state.imageUri || !this.state.locationChosen || !this.state.placeName } onChangeText={(input) => (this.setState({ placeName: input }))} submitHandler={this.submitHandler} />
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    isDoneLoading: state.ui.isDoneLoading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAddPlace: (name, image, region) => dispatch(addPlace(name, image, region)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SharePlaceScreen)