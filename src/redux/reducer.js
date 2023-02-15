import { UPDATE_CATEGORY, UPDATE_TOPPICK, UPDATE_FEATURED, UPDATE_PRODUCT_BY_CATEGORY, UPDATE_CATEGORY_LIST, UPDATE_FAVORUIT_PRODUCTS, UPDATE_PROFILE_DATA, UPDATE_FAVORUIT_PRODUCTS_LIST, UPDATE_CART_LIST, UPDATE_CART_PRODUCT_LIST, UPDATE_ADDRESS_LIST, LOGOUT, UPDATE_ORDER_LIST, UPDATE_IMAGE_SIZE, UPDATE_MASCELINOUS, UPDATE_LANDSCAPE, UPDATE_DELIVERY_LIST, UPDATE_MAIN_CATEGORY_LIST } from './type';

const initialState = {
    dash_category_list: [],
    top_pick: [],
    landscape_list: [],
    featured_product: [],
    prod_by_cat_list: [],
    category_list: [],
    main_category: [],
    favoruit_list: [],
    favoruit_product_list: [],
    profile: "",
    user_data: "",
    cart_list: [],
    cart_product_list: [],
    address_list: [],
    orderList: [],
    image_size: [],
    mascelinous: {},
    delivery_charge: [],
    messages: [],
    users_online: [],
    conversations: {},
    selfUser: {}
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
        case UPDATE_IMAGE_SIZE:
            return {
                ...state,
                image_size: action.payload
            };
        case UPDATE_MASCELINOUS:
            return {
                ...state,
                mascelinous: action.payload
            };
        case UPDATE_LANDSCAPE:
            return {
                ...state,
                landscape_list: action.payload
            };
        case UPDATE_DELIVERY_LIST:
            return {
                ...state,
                delivery_charge: action.payload
            };
        case UPDATE_MAIN_CATEGORY_LIST:
            return {
                ...state,
                main_category: action.payload
            }
        case "users_online":
            const conversations = { ...state.conversations };
            const usersOnline = action.data;
            for (let i = 0; i < usersOnline.length; i++) {
                const userId = usersOnline[i].userId;
                if (conversations[userId] === undefined) {
                    conversations[userId] = {
                        messages: [],
                        username: usersOnline[i].username
                    };
                }
            }
            console.log("Conversations: ", conversations)
            return { ...state, usersOnline, conversations };
        case "private_message":
            const conversationId = action.data.conversationId;
            return {
                ...state,
                conversations: {
                    ...state.conversations,
                    [conversationId]: {
                        ...state.conversations[conversationId],
                        messages: [
                            action.data.message,
                            ...state.conversations[conversationId].messages
                        ]
                    }
                }
            };
        case "update_local_message":
            const conversationIds = action.payload.conversationId;
            return {
                ...state,
                conversations: {
                    ...state.conversations,
                    [conversationIds]: {
                        ...state.conversations[conversationIds],
                        messages: action.payload.message
                    }
                }
            };
        case "self_user":
            console.log("self_user: ", action.data)
            return { ...state, selfUser: action.data };
        default:
            return state;
    }
}
export default mainReducer;