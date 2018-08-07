import { UI_START_LOADING, UI_STOP_LOADING, AUTH_REMOVE_TOKEN } from '../actions/actionTypes';

const initialState = {
    isLoading: false,
    isDoneLoading: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UI_START_LOADING:
            return {
                ...state,
                isLoading: true,
                isDoneLoading: false
            }
            break;
        case UI_STOP_LOADING:
            return {
                ...state,
                isLoading: false,
                isDoneLoading: true
            }
            break;
        case AUTH_REMOVE_TOKEN:
            return initialState
            break
        default:
            return state
            break;
    }
}

export default reducer