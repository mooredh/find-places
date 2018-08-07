import { TRY_AUTH, AUTH_ERROR, AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from './actionTypes'
import { AsyncStorage } from 'react-native'
import { uiStartLoading, uiStopLoading } from './';

const API_KEY = "AIzaSyDNHnis3dABLC5JdihkSJWy21dAECVfNwQ";

export const tryAuth = (authData, authMode) => {
    return dispatch => {
        const url = authMode === "signup" ? "signupNewUser" : "verifyPassword"
        dispatch(authCheck(authData, url))
    }
}

export const authCheck = (authData, url) => {
    return async(dispatch) => {
        try {
            dispatch(uiStartLoading())
            let res = await fetch(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/${url}?key=${API_KEY}`, {
                method: "POST",
                body: JSON.stringify({
                    email: authData.email,
                    password: authData.password,
                    returnSecureToken: true
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            setTimeout(() => {
                if (!res) {
                    dispatch(uiStopLoading())
                    dispatch(authError("Plsease check your internet connection"))
                }
            }, 8000);
            let resJson = await res.json()
            await dispatch(uiStopLoading())
            if (resJson.error) {
                switch (resJson.error.message) {
                    case "EMAIL_EXISTS":
                        dispatch(authError("The email-address has been taken"))
                        break;
                    case "OPERATION_NOT_ALLOWED":
                        dispatch(authError("Operation not allowed"))
                        break;
                    case "TOO_MANY_ATTEMPTS_TRY_LATER":
                        dispatch(authError("Too many attempts, try later"))
                        break;
                    case "EMAIL_NOT_FOUND":
                        dispatch(authError("Email-address not registered, please Sign Up to proceed"))
                        break;
                    case "INVALID_PASSWORD":
                        dispatch(authError("Password does not match the email-address"))
                        break;
                    case "USER_DISABLED":
                        dispatch(authError("This account has been temporarily disabled, email disabled@findplaces.com for more info"))
                        break;
                    default:
                        dispatch(authError("Authentication failed, please try again"))
                        break;
                }
            } else if (resJson.idToken && resJson.expiresIn && resJson.refreshToken) {
                dispatch(authError(null));
                dispatch(authStoreToken(resJson.idToken, resJson.expiresIn, resJson.refreshToken))
            } else {
                dispatch(authError("Authentication failed, please try again"))
            }
        } catch (error) {
            dispatch(uiStopLoading())
            dispatch(authError("Authentication failed, please try again"));
        }

    }
}

export const authError = (error) => {
    return {
        type: AUTH_ERROR,
        error
    }
}

export const authSetToken = (token, expiryDate) => {
    return {
        type: AUTH_SET_TOKEN,
        token,
        expiryDate
    }
}

export const authStoreToken = (token, expiresIn, refreshToken) => {
    return dispatch => {
        const now = new Date()
        const expiryDate = now.getTime() + (expiresIn * 1000)
        dispatch(authSetToken(token, expiryDate))
        AsyncStorage.setItem("auth-token", token);
        AsyncStorage.setItem("auth-refresh-token", refreshToken);
        AsyncStorage.setItem("auth-expiry-date", expiryDate.toString());
    }
}

export const getAuthToken = () => {
    return async(dispatch, getState) => {
        return new Promise(async(resolve, reject) => {
            const token = getState().auth.token
            const expiryDate = getState().auth.expiryDate
            if (!token || new Date(expiryDate) <= new Date) {
                try {
                    let storedToken = await AsyncStorage.getItem("auth-token")
                    let expiryDate = await AsyncStorage.getItem("auth-expiry-date")
                    const parsedExpiryDate = await new Date(parseInt(expiryDate))
                    const now = new Date()
                    if (parsedExpiryDate > now) {
                        await dispatch(authSetToken(storedToken))
                        await resolve(storedToken)
                    } else {
                        reject()
                    }
                } catch (error) {
                    reject(error)
                }
            } else {
                resolve(token)
            }
        })

    }
}

export const authAutoSignIn = () => {
    return async dispatch => {
        try {
            let token = await dispatch(getAuthToken())
            if (!token) {
                reject()
            }
            return token
        } catch (error) {
            try {
                let refreshToken = await AsyncStorage.getItem("auth-refresh-token")
                let res = await fetch("https://securetoken.googleapis.com/v1/token?key=" + API_KEY, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: "grant_type=refresh_token&refresh_token=" + refreshToken
                })
                let resJson = await res.json()
                if (resJson.id_token) {
                    dispatch(authStoreToken(resJson.id_token, resJson.expires_in, resJson.refresh_token))
                    let token = await resJson.id_token
                    if (!token) {
                        throw (new Error())
                    } else {
                        return token
                    }
                } else {
                    reject()
                }
            } catch (error) {
                AsyncStorage.multiRemove(["auth-token", "auth-expiry-date"])
            }
        }
    }
}

export const authLogout = () => {
    return async(dispatch, getState) => {
        try {
            await AsyncStorage.multiRemove(["auth-token", "auth-expiry-date", "auth-refresh-token"])
            dispatch(authRemoveToken())
        } catch (error) {
            alert("Logout failed, please try again")
        }
    }
}

export const authRemoveToken = () => {
    return {
        type: AUTH_REMOVE_TOKEN
    }
}