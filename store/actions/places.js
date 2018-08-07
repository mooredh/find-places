import { ADD_PLACE, DELETE_PLACE, SET_PLACES, REMOVE_PLACE } from "./actionTypes";
import { uiStartLoading, uiStopLoading, getAuthToken } from './index'

export const addPlace = (placeName, placeImage, placeRegion) => {
    return async dispatch => {
        try {
            let token = await dispatch(getAuthToken())
            dispatch(uiStartLoading());
            let res = await fetch('https://us-central1-find-places-79edd.cloudfunctions.net/storeImage', {
                method: 'POST',
                body: JSON.stringify({
                    image: placeImage.base64
                }),
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
            let resJson = await res.json()
            const placeData = {
                name: placeName,
                location: placeRegion,
                image: resJson.imageUrl,
                imagePath: resJson.imagePath
            }
            let resFull = await fetch('https://find-places-79edd.firebaseio.com/places.json?auth=' + token, {
                method: "POST",
                body: JSON.stringify(placeData)
            })
            let resFullJson = await resFull.json()
            await dispatch(uiStopLoading())
        } catch (error) {
            dispatch(uiStopLoading());
            alert('Something went wrong, please try again')
        }
    }
}

export const getPlaces = () => {
    return async dispatch => {
        try {
            let token = await dispatch(getAuthToken())
            let res = await fetch('https://find-places-79edd.firebaseio.com/places.json?auth=' + token)
            let resJson = await res.json()
            const places = [];
            for (let key in resJson) {
                if (resJson.hasOwnProperty(key)) {
                    await places.push({
                        ...resJson[key],
                        value: resJson[key].name,
                        region: resJson[key].location,
                        image: { uri: resJson[key].image },
                        key,
                    })
                }
            }
            await dispatch(setPlaces(places));
        } catch (error) {
            alert('Something went wrong, please try again')
        }
    }
}

export const setPlaces = (places) => {
    return {
        type: SET_PLACES,
        places
    }
}

export const deletePlace = (key) => {
    return async dispatch => {
        try {
            let token = await dispatch(getAuthToken())
            dispatch(removePlace(key))
            let res = await fetch('https://find-places-79edd.firebaseio.com/places/' + key + '.json?auth=' + token, {
                method: 'DELETE'
            })
            let resJson = await res.json();
        } catch (error) {
            alert('Something went wrong, please try again')
        }
    }
}

export const removePlace = key => {
    return {
        type: REMOVE_PLACE,
        key
    };
};