import { AUTH_ERROR, AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from "../actions/actionTypes";

const initialState = {
    error: null,
    token: null,
    expiryDate: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTH_ERROR:
            return {
                ...state,
                error: action.error
            }
            break
        case AUTH_SET_TOKEN:
            return {
                ...state,
                token: action.token,
                expiryDate: action.expiryDate
            }
            break
        case AUTH_REMOVE_TOKEN:
            return initialState
            break
        default:
            return state
            break
    }
}

export default reducer