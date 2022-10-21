import { UPDATE_CATEGORY, UPDATE_TOPPICK, UPDATE_FEATURED, UPDATE_PRODUCT_BY_CATEGORY, UPDATE_CATEGORY_LIST, UPDATE_FAVORUIT_PRODUCTS, UPDATE_PROFILE_DATA, UPDATE_FAVORUIT_PRODUCTS_LIST, UPDATE_CART_LIST, UPDATE_CART_PRODUCT_LIST, UPDATE_ADDRESS_LIST, LOGOUT, UPDATE_ORDER_LIST } from './type';

const initialState = {
    dash_category_list: [],
    top_pick: [],
    featured_product: [],
    prod_by_cat_list: [],
    category_list: [],
    favoruit_list: [],
    favoruit_product_list: [],
    profile: "",
    user_data: "",
    cart_list: [],
    cart_product_list: [],
    address_list: [],
    orderList: []
};
const mainReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_CATEGORY:
            return {
                ...state,
                dash_category_list: action.payload
            };
        case UPDATE_TOPPICK:
            return {
                ...state,
                top_pick: action.payload
            };
        case UPDATE_FEATURED:
            return {
                ...state,
                featured_product: action.payload
            };
        case UPDATE_PRODUCT_BY_CATEGORY:
            return {
                ...state,
                prod_by_cat_list: action.payload
            };
        case UPDATE_CATEGORY_LIST:
            return {
                ...state,
                category_list: action.payload
            };
        case UPDATE_FAVORUIT_PRODUCTS:
            return {
                ...state,
                favoruit_list: action.payload
            };
        case UPDATE_PROFILE_DATA:
            return {
                ...state,
                profile: action.payload
            };
        case UPDATE_FAVORUIT_PRODUCTS_LIST:
            return {
                ...state,
                favoruit_product_list: action.payload
            };
        case UPDATE_CART_LIST:
            return {
                ...state,
                cart_list: action.payload
            };
        case UPDATE_CART_PRODUCT_LIST:
            return {
                ...state,
                cart_product_list: action.payload
            };
        case UPDATE_ADDRESS_LIST:
            return {
                ...state,
                address_list: action.payload
            };
        case LOGOUT:
            return {
                ...state,
                favoruit_list: [],
                favoruit_product_list: [],
                profile: "",
                user_data: "",
                cart_list: [],
                cart_product_list: [],
                address_list: []
            };
            case UPDATE_ORDER_LIST:
            return {
                ...state,
                orderList: action.payload
            };
        default:
            return state;
    }
}
export default mainReducer;