import React, { Component } from 'react'
import { Text, View, ActivityIndicator } from 'react-native'
import { Button, Item, Label, Input, Form, Icon } from 'native-base'

export default class SignUpForm extends Component {
  render() {
      let submitText = (
          <Text style={{color: "#fff"}}>Get Started</Text>
      )
      if (this.props.isLoading) {
          submitText = <ActivityIndicator color="#fff" />
      }
    return (
        <Form style={{ width: '90%', alignSelf: 'center' }}>
            <Item floatingLabel last>
                <Label style={{color: '#fff'}}>Email</Label>
                <Input 
                keyboardType="email-address"
                style={{color: '#fff'}}
                returnKeyType="next" 
                autoCapitalize="none" 
                onSubmitEditing={() => {this.password._root.focus()}}
                getRef={(input) => {this.email = input}}
                onChangeText={(input) => this.props.onEmail(input)} 
                value={this.props.email}
                />
                <Icon name="person" style={{ color: '#fff' }}/>
            </Item>
            <Item floatingLabel last>
                <Label style={{color: '#fff'}}>Password</Label>
                <Input 
                secureTextEntry
                autoCorrect={false}
                style={{color: '#fff'}}
                autoCapitalize="none" 
                returnKeyType="next" 
                onSubmitEditing={() => {this.confirmPassword._root.focus()}}
                getRef={(input) => {this.password = input}}
                onChangeText={(input) => {this.props.onPassword(input)}}
                value={this.props.password}
                />
                <Icon name="lock" style={{color: '#fff'}}/>
            </Item>
            <Item floatingLabel last>
                <Label style={{color: '#fff'}}>Confirm Password</Label>
                <Input 
                secureTextEntry
                autoCorrect={false}
                style={{color: '#fff'}}
                autoCapitalize="none" 
                returnKeyType="go" 
                onSubmitEditing={this.props.onSubmit} 
                getRef={(input) => { this.confirmPassword = input }}
                onChangeText={(input) => this.props.onConfirmPassword(input)} 
                value={this.props.confirmPassword}
                />
                <Icon name="lock" style={{ color: '#fff' }}/>
            </Item>
            <Button block onPress={this.props.onSubmit} style={{ width: '100%', alignSelf: 'center', marginVertical: 20, backgroundColor: "#f34e66", }}>{submitText}</Button>
        </Form>
    )
  }
}