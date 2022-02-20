import { createStore, compose, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleWare from 'redux-thunk';
import axios from 'axios';
import Cookie from 'js-cookie';

// const cartItems = Cookie.getJSON('cartItems') || [];
const wishlistItems = Cookie.getJSON('wishlistItems') || [];
const initialState = {
    wishlist: { wishlistItems }
};


/**************************************Constants **********************************************/
const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
const FETCH_PRODUCTS_FAIL = 'FETCH_PRODUCTS_FAIL';


const productsInCart = ('');
const productsListReducer = (state = { productsInCart }, action) => {
    switch (action.type) {
        case FETCH_PRODUCTS_REQUEST: return {
            loading: true,
        };
        case FETCH_PRODUCTS_SUCCESS: return {
            loading: false,
            productsInCart: action.payload
        };
        case FETCH_PRODUCTS_FAIL: return {
            loading: false,
            error: action.payload
        };
        default: return state
    }
}




export const listProducts = () => async (dispatch) => {
    try {
        dispatch({ type: FETCH_PRODUCTS_REQUEST });
        const { data } = await axios.get(`/api/cart/get`, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: data });

    } catch (error) {
        dispatch({ type: FETCH_PRODUCTS_FAIL, payload: error.message });

    }
}

/*****************************************Combining Redcers******************************************/

const reducer = combineReducers({
    productsList: productsListReducer
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunkMiddleWare)));
export default store;