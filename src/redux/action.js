import { UPDATE_CATEGORY, UPDATE_TOPPICK, UPDATE_FEATURED, UPDATE_PRODUCT_BY_CATEGORY, UPDATE_CATEGORY_LIST, UPDATE_FAVORUIT_PRODUCTS, UPDATE_PROFILE_DATA, UPDATE_FAVORUIT_PRODUCTS_LIST, UPDATE_CART_LIST, UPDATE_CART_PRODUCT_LIST, UPDATE_ADDRESS_LIST, LOGOUT, UPDATE_ORDER_LIST, UPDATE_IMAGE_SIZE, UPDATE_MASCELINOUS, UPDATE_LANDSCAPE, UPDATE_DELIVERY_LIST, UPDATE_MAIN_CATEGORY_LIST } from './type';
import { getMethod, postMethod, deleteMethod, sendFirebaseNotification, putMethod } from '../../utils/function';

export const updateDashCategoryList = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`/categoryname/dashlist`).then(res => {
            dispatch({
                type: UPDATE_CATEGORY,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const updateTopPick = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`/products/gettoppick/10`).then(res => {
            dispatch({
                type: UPDATE_TOPPICK,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const updateLandscape = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`/products/gettoppick/10`).then(res => {
            dispatch({
                type: UPDATE_LANDSCAPE,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const getImageSize = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`/size/list`).then(res => {
            dispatch({
                type: UPDATE_IMAGE_SIZE,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const updateFeatured = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`/products/gettoppick/6`).then(res => {
            dispatch({
                type: UPDATE_FEATURED,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const getMascelinous = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`/user/mascelinous`).then(res => {
            dispatch({
                type: UPDATE_MASCELINOUS,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export function updateProdByCat(data) {
    return {
        type: UPDATE_PRODUCT_BY_CATEGORY,
        payload: data
    }
}

export const updateCategoryList = (id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`/category/listbypid/${id}`).then(res => {
            dispatch({
                type: UPDATE_CATEGORY_LIST,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const updateMainCategoryList = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`/maincategory/list`).then(res => {
            dispatch({
                type: UPDATE_MAIN_CATEGORY_LIST,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const updateFavoruitList = (_id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`/fav/${_id}`).then(res => {
            dispatch({
                type: UPDATE_FAVORUIT_PRODUCTS,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const updateProfileData = (_id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`/user/${_id}`).then(res => {
            dispatch({
                type: UPDATE_PROFILE_DATA,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const updateFavProductList = (id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`/fav/productlist/${id}`).then(res => {
            dispatch({
                type: UPDATE_FAVORUIT_PRODUCTS_LIST,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const updateCartList = (id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`/cart/${id}`).then(res => {
            dispatch({
                type: UPDATE_CART_LIST,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const updateCartProductList = (_id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`/cartproduct/${_id}`).then(res => {
            console.log(res)
            dispatch({
                type: UPDATE_CART_PRODUCT_LIST,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const addToCart = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        console.log(data);
        postMethod('/cart/new', data).then(res => {
            dispatch(updateCartList(data.userId))
            dispatch(updateCartProductList(data.userId))
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const removeFromCart = (id, userId) => (dispatch) => {
    return new Promise((resolve, reject) => {
        deleteMethod(`/cart/${id}`).then(res => {
            dispatch(updateCartList(userId))
            dispatch(updateCartProductList(userId))
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const updateAddressList = (_id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`/address/${_id}`).then(res => {
            dispatch({
                type: UPDATE_ADDRESS_LIST,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const updateDelivery = () => (dispatch) => {
    console.log("Comes updateDelivery inside")
    return new Promise((resolve, reject) => {
        getMethod(`/delivery/list/all`).then(res => {
            dispatch({
                type: UPDATE_DELIVERY_LIST,
                payload: res.data
            })
            console.log("Comes updateDelivery dispatch")
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export function logoutFunction() {
    return {
        type: LOGOUT
    }
}

export const updateOrderList = (_id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`/order/user/${_id}`).then(res => {
            dispatch({
                type: UPDATE_ORDER_LIST,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(error => {
            return reject(error.data.response.message);
        })
    })
}

export const updateCartQuantity = (_id, type, userId) => (dispatch) => {
    return new Promise((resolve, reject) => {
        let url = type === "INCREASE" ? `/cart/increase/${_id}` : `/cart/decrease/${_id}`;
        getMethod(url).then(res => {
            dispatch(updateCartProductList(userId));
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const sendNotificationToAdmin = (message) => {
    return new Promise((resolve, reject) => {
        getMethod(`/user/admin/token`).then(res => {
            let result = res.data;
            console.log(result)
            if (result.length > 0) {
                result.map(item => {
                    sendFirebaseNotification(message, item.token)
                })
            }
            return resolve(res.data);
        }).catch(err => {
            console.log(err)
            return reject(err);
        })
    })
}

export const sendNotificationToSeller = (id,message) => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`/user/seller/token/${id}`).then(res => {
            let result = res.data;
            console.log(result)
            if (result.length > 0) {
                result.map(item => {
                    sendFirebaseNotification(message, item.token)
                })
            }
            return resolve(res.data);
        }).catch(err => {
            console.log(err)
            return reject(err);
        })
    })
}

export const updateOrderDetails = (_id, options) => (dispatch) => {
    return new Promise((resolve, reject) => {
        return putMethod(`/order/edit/${_id}`, options).then((res) => {
            console.log("Order update success")
            return resolve(res);
        }).catch(error => {
            console.log("Order update failure", error)
            return reject(error);
        })
    })
}

export const sendMessage = () => (dispatch) => {
        dispatch({
            type: "server/hello",
            payload: "Hello dude"
        })
}

export const getConversationsByUser = (fromUser, toUser) => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`/chatlist/${fromUser}/${toUser}`).then(res => {
            console.log("res.data: ",res.data)
            if (res.data.length > 0) {
                dispatch({
                    type: "update_local_message",
                    payload: { message: res.data[0].messages, conversationId: toUser }
                })
            }
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}