import { SET_PLACES, REMOVE_PLACE, AUTH_REMOVE_TOKEN } from '../actions/actionTypes';
const initialState = {
    places: [],
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PLACES:
            return {
                ...state,
                places: action.places.reverse()
            }
        case REMOVE_PLACE:
            return {
                ...state,
                places: state.places.filter(place => {
                    return place.key !== action.key;
                })
            };
        case AUTH_REMOVE_TOKEN:
            return initialState
            break
        default:
            return state
    }
}

export default reducer