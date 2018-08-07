import React, { Component } from 'react'
import { Dimensions, ImageBackground, View, Keyboard, Platform, StatusBar } from 'react-native'
import { connect } from 'react-redux';
import { Container, Content, Button, Text, H1, Toast } from 'native-base'
import backgroundImage from '../assets/background.jpg';
import SignUpForm from '../components/SignUpForm';
import LogInForm from '../components/LogInForm';
import validate from '../utility/validation';
import { tryAuth, authAutoSignIn } from '../store/actions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

class AuthScreen extends Component {
    static navigationOptions = {
        title: 'Login'
    }

    constructor(props) {
        super(props)
        
        this.state = {
            statusBarHidden: false,
            authMode: "login",
            email: {
                value: "",
                error: null,
                validationRules: {
                    isEmail: true
                }
            },
            password: {
                value: "",
                error: null,
                validationRules: {
                    minLength: 6
                }
            },
            confirmPassword: {
                value: "",
                error: null,
                validationRules: {
                    equalTo: ''
                }                
            },
        }
    }

    componentDidMount = async () => {
        try {
            let token = await this.props.onAutoSignIn()
            if (token) {
                this.props.navigation.navigate('TabBarNav');
            }
        } catch (error) {
            return
        }
        
    };
    

    componentWillReceiveProps = async () => {
        if (this.props.isDoneLoading && !this.props.isLoading) {
            await this.props.error
            if (!this.props.error) {
                this.props.navigation.navigate('TabBarNav')
            }
            else {
                if (this.props.isDoneLoading) {
                    return await Toast.show({
                        text: this.props.error,
                        duration: 3000,
                        position: 'top',
                        style: {backgroundColor: 'transparent',},
                        textStyle: {textAlign: 'center', color: '#f00'}
                    })
                }
            }
        }
    }
    

    authModeForm = () => {
        if (this.state.authMode === "login") {
            return (<LogInForm
            onSubmit={this.authHandler}
            password={this.state.password.value}
            email={this.state.email.value}
            onEmail={(value) => this.setState(prevState =>({email: {...prevState.email, value}}))}
            onPassword={(value) => this.setState(prevState =>({password: {...prevState.password, value}}))}
            isLoading={this.props.isLoading}
            />)
        } else {
            return (
                <SignUpForm
                onSubmit={this.authHandler}
                confirmPassword={this.state.confirmPassword.value}
                password={this.state.password.value}
                email={this.state.email.value}
                onEmail={(value) => this.setState(prevState =>({email: {...prevState.email, value}}))}
                onPassword={(value) => this.setState(prevState =>({password: {...prevState.password, value}, confirmPassword: {...prevState.confirmPassword, validationRules: {equalTo: value}}}))}
                onConfirmPassword={(value) => this.setState(prevState =>({confirmPassword: {...prevState.confirmPassword, value}}))}
                isLoading={this.props.isLoading}
                />
            )
        }
    }

    statusBarVisibility = () => {
        if (Platform.OS === 'ios') {
            Dimensions.addEventListener('change', ({ window, screen }) => { 
                this.setState(prevState => ({statusBarHidden: Dimensions.get('window').height < 450 ? true : false}))
            })
        }
    }

    authModeHandler = () => {
        this.setState(prevState => ({authMode: prevState.authMode === "login" ? "signup" : "login"}))
    }

    checkErrors = (control) => {
        if (control.value.trim() === "") {
            this.setState(prevState => ({email: {...prevState.email, error: "All fields are required"}}))
        }
        if (control.error) {
            return Toast.show({
                text: control.error,
                duration: 3000,
                position: 'top',
                style: {backgroundColor: 'transparent',},
                textStyle: {textAlign: 'center', color: '#f00'}
            })
        }
    }

    authHandler = async () => {
        Keyboard.dismiss()
        await this.setState(prevState => ({
            email: {
                ...prevState.email,
                error: validate(prevState.email.value, prevState.email.validationRules)
            },
            password: {
                ...prevState.password,
                error: validate(prevState.password.value, prevState.password.validationRules)
            },
            confirmPassword: {
                ...prevState.confirmPassword,
                error: prevState.authMode === "login" ? null : validate(prevState.confirmPassword.value, prevState.confirmPassword.validationRules)
            },
        }))

        if (this.state.email.error !== null || this.state.password.error !== null || this.state.confirmPassword.error !== null) {
            await this.checkErrors(this.state.email)
            await this.checkErrors(this.state.password)
            if (this.state.authMode === "signup") {
                await this.checkErrors(this.state.confirmPassword)
            }
        }
        else {
            const authData = {
                email: this.state.email.value,
                password: this.state.password.value,
                confirmPassword: this.state.authMode === "signup" ? this.state.confirmPassword.value : null
            }
            await this.props.onTryAuth(authData, this.state.authMode)
        }
    }

  render() {
    return (
      <Container>
        <ImageBackground source={backgroundImage} style={{ width: null, height: null, flex: 1 }}>
            <StatusBar barStyle="light-content" hidden={this.state.statusBarHidden} showHideTransition="slide" />
            {this.statusBarVisibility()}
          <Content contentContainerStyle={{ flex: 1, justifyContent: 'center', }}>
            <H1 style={{color: '#fff',marginBottom: 10, alignSelf: 'center',}}>Welcome{this.state.authMode === "login" ? " back!" : "!"}</H1>
            <Button bordered light block style={{ width: '60%', alignSelf: 'center', marginVertical: 5, }} onPress={this.authModeHandler}><Text>Switch to {this.state.authMode === "login" ? "Signup" : "Login"}</Text></Button>
            {this.authModeForm()}
          </Content>        
        </ImageBackground>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
    isLoading: state.ui.isLoading,
    isDoneLoading: state.ui.isDoneLoading,
    error: state.auth.error,
    token: state.auth.token
})

const mapDispatchToProps = (dispatch) => {
    return {
        onTryAuth: (authData, authMode) => dispatch(tryAuth(authData, authMode)),
        onAutoSignIn: () => dispatch(authAutoSignIn())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen)