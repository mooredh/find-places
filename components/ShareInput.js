import React, { Component } from 'react'
import { Text, View, Dimensions, ActivityIndicator } from 'react-native'
import { Button, Item, Label, Input } from 'native-base'

const SCREEN_WIDTH = Dimensions.get('window').width

export default class ShareInput extends Component {
  render() {
        let submitText = <Text style={{color: '#fff'}}>
                        Share the place!
                        </Text>
        if (this.props.loading) {
            submitText = <ActivityIndicator color='#fff' />
        }
    return (
        <View style={{width: '100%', alignSelf: 'center',}}>
            <Item stackedLabel style={{marginVertical: 10, }}>
                <Label style={{color: '#777'}}>Place Name</Label>
                <Input 
                value={this.props.placeName}
                onChangeText={this.props.onChangeText}
                onSubmitEditing={this.props.submitHandler}
                returnKeyType="go"
                />
            </Item>
            <Button 
            block 
            disabled={this.props.buttonDisabled && this.props.loading}
            onPress={this.props.submitHandler}
            style={{ 
                width: '100%', 
                alignSelf: 'center', 
                marginVertical: 10, 
                backgroundColor: "#f34e66", }}
            >
                {submitText}
            </Button>
        </View>
    )
  }
}