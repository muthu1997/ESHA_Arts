import { UPDATE_CATEGORY, UPDATE_TOPPICK, UPDATE_FEATURED, UPDATE_PRODUCT_BY_CATEGORY, UPDATE_CATEGORY_LIST, UPDATE_FAVORUIT_PRODUCTS, UPDATE_PROFILE_DATA, UPDATE_FAVORUIT_PRODUCTS_LIST, UPDATE_CART_LIST, UPDATE_CART_PRODUCT_LIST, UPDATE_ADDRESS_LIST, LOGOUT, UPDATE_ORDER_LIST } from './type';

export function updateDashCategoryList(data) {
    return {
        type: UPDATE_CATEGORY,
        payload: data
    }
}

export function updateTopPick(data) {
    return {
        type: UPDATE_TOPPICK,
        payload: data
    }
}

export function updateFeatured(data) {
    return {
        type: UPDATE_FEATURED,
        payload: data
    }
}

export function updateProdByCat(data) {
    return {
        type: UPDATE_PRODUCT_BY_CATEGORY,
        payload: data
    }
}

export function updateCategoryList(data) {
    return {
        type: UPDATE_CATEGORY_LIST,
        payload: data
    }
}

export function updateFavoruitList(data) {
    return {
        type: UPDATE_FAVORUIT_PRODUCTS,
        payload: data
    }
}

export function updateProfileData(data) {
    return {
        type: UPDATE_PROFILE_DATA,
        payload: data
    }
}

export function updateFavProductList(data) {
    return {
        type: UPDATE_FAVORUIT_PRODUCTS_LIST,
        payload: data
    }
}

export function updateCartList(data) {
    return {
        type: UPDATE_CART_LIST,
        payload: data
    }
}

export function updateCartProductList(data) {
    return {
        type: UPDATE_CART_PRODUCT_LIST,
        payload: data
    }
}

export function updateAddressList(data) {
    return {
        type: UPDATE_ADDRESS_LIST,
        payload: data
    }
}

export function logoutFunction() {
    return {
        type: LOGOUT
    }
}

export function updateOrderList(data) {
    return {
        type: UPDATE_ORDER_LIST,
        payload: data
    }
}