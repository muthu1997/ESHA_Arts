import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, StatusBar, Dimensions, TouchableOpacity, FlatList, DeviceEventEmitter, ToastAndroid } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../../../component/header";
import Text from "../../../component/text";
import TitleContainer from "../../../component/titleContainer";
import Button from "../../../component/button";
import { updateCartProductList, updateCartList, updateCartQuantity } from "../../redux/action";
import { useSelector, useDispatch } from 'react-redux';
import { deleteMethod } from "../../../utils/function";
import { Modal } from 'react-native-paper';
import Lottie from 'lottie-react-native';
const { width } = Dimensions.get("screen");
import { updateAFEvent } from "../../../utils/appsflyerConfig";
import { CART_INIT, RM_CART_PDCT_FAILURE, RM_CART_PDCT_SUCCESS, GET_CARTLIST_FAILURE, GET_CARTLIST_SUCCESS } from "../../../utils/events";
import { CartQtyButton } from "../../../component";

export default function CartScreen(props) {
    const user = useSelector(state => state.reducer.profile);
    var cartProductList = useSelector(state => state.reducer.cart_product_list);
    const [visible, setVisible] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [subtotal, setSubtotal] = useState(0);
    const [cartQtyLoader, setCartQtyLoader] = useState("");
    const [loggedOut, setLoggedOut] = useState(false);
    const [loader, setLoader] = useState(true);
    const dispatch = useDispatch();
    useEffect(() => {
        updateAFEvent(CART_INIT, "");
        if (user !== "") {
            totalCalculator();
        } else {
            setLoggedOut(true)
            setLoader(false)
        }
    }, [totalCalculator])

    DeviceEventEmitter.addListener("REFRESH_CART", res => {
        if (res === "yes") {
            console.log("REFRESH_CART YES")
            DeviceEventEmitter.emit("REFRESH_CART", "no")
            setLoggedOut(false)
            if (user) {
                getCartList();
            }
        }
        if (res === "logout") {
            DeviceEventEmitter.emit("REFRESH_CART", "no")
            setLoggedOut(true)
        }
    })

    function getCartList() {
        dispatch(updateCartList(user._id))
        dispatch(updateCartProductList(user._id)).then(response => {
            setRemoving(false)
            updateAFEvent(GET_CARTLIST_SUCCESS, "");
            totalCalculator();
            return setVisible(false)
        }).catch(error => {
            updateAFEvent(GET_CARTLIST_FAILURE, { "ERROR_DATA": error });
            setRemoving(false)
            return setVisible(false)
        })
    }

    function removeFromCart() {
        setRemoving(true)
        let id = cartProductList[selectedProduct]._id;
        deleteMethod(`/cart/${id}`).then(res => {
            updateAFEvent(RM_CART_PDCT_SUCCESS, "");
            getCartList();
        }).catch(error => {
            updateAFEvent(RM_CART_PDCT_FAILURE, { "ERROR_DATA": error });
            setRemoving(false)
            setVisible(false);
        })
    }

    function totalCalculator() {
        if (cartProductList.length > 0) {
            let subtotal = 0;
            subtotal = cartProductList.reduce((prev, next) => prev + (next.itemId.price * next.quantity), 0);
            setSubtotal(subtotal)
            setLoader(false);
            return subtotal;
        } else {
            setSubtotal(0)
            setLoader(false);
            return 0;
        }
    }

    function addQtyFunction(id, type, qty) {
        if (type === "INCREASE") {
            setCartQtyLoader(id);
            return dispatch(updateCartQuantity(id, type, user._id))
                .then(response => {
                    return setTimeout(() => setCartQtyLoader(""), 200)
                }).catch(error => {
                    ToastAndroid.show("Something went wrong, while updating cart details.", ToastAndroid.BOTTOM, ToastAndroid.CENTER);
                    return setTimeout(() => setCartQtyLoader(""), 200)
                })
        } else {
            if (qty < 1) {
                return ToastAndroid.show("Cannot zero the quantity value.", ToastAndroid.BOTTOM, ToastAndroid.CENTER);
            } else {
                setCartQtyLoader(id);
                return dispatch(updateCartQuantity(id, type, user._id))
                    .then(response => {
                        return setTimeout(() => setCartQtyLoader(""), 200)
                    }).catch(error => {
                        ToastAndroid.show("Something went wrong, while updating cart details.", ToastAndroid.BOTTOM, ToastAndroid.CENTER);
                        return setTimeout(() => setCartQtyLoader(""), 200)
                    })
            }
        }
    }

    function renderProductCard(item, index) {
        return (
            <View style={styles.cardContainer}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.itemId?.image[0].image }} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                </View>
                <View style={[styles.dataContainer]}>
                    <Text title={item.itemId?.name} type="ROBOTO_MEDIUM" lines={1} />
                    {item.itemId.width !== 0 ? <Text title={`${item.itemId.width} ${item.itemId.whType} ✕ ${item.itemId.height} ${item.itemId.whType}`} type="ROBOTO_MEDIUM" lines={2} style={{ fontSize: 14, color: COLOUR.BLACK }} /> : null}
                    <View style={styles.dimensionContainer}>
                        <CartQtyButton
                            onRemoveQuantity={qty => addQtyFunction(item._id, "DECREASE", qty)}
                            onAddQuantity={qty => addQtyFunction(item._id, "INCREASE", qty)}
                            loader={cartQtyLoader === item._id ? true : false}
                            quantity={item.quantity} />
                    </View>
                </View>
                <View style={styles.priceContainer}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => { setVisible(true); setSelectedProduct(index) }}>
                        <Icon name="close" size={20} color={COLOUR.DARK_GRAY} />
                    </TouchableOpacity>
                    <Text title={`${item.quantity} × ₹` + (item.itemId.price)} type="ROBOTO_MEDIUM" lines={1} style={{ color: COLOUR.PRIMARY }} />
                </View>
            </View>
        )
    }

    function renderTotal() {
        return (
            <View style={[styles.cardContainer, { flexDirection: "column", justifyContent: "center", height: 60, marginTop: 20 }]}>
                <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 40, alignItems: "center", justifyContent: "space-between" }]}>
                    <Text title={"Total MRP (Inclusive of all taxes)"} type="ROBOTO_MEDIUM" lines={1} />
                    <Text title={`₹ ${subtotal}`} type="ROBO_BOLD" lines={2} style={{ color: COLOUR.ORANGE_DARK }} />
                </View>
            </View>
        )
    }

    function renderCheckoutButton() {
        return cartProductList.length > 0 ? <View>
            {renderTotal()}
            <Button
                title="Checkout"
                onPress={() => {
                    cartQtyLoader === "" ? props.navigation.navigate("Payment") : null;
                }}
                style={{ alignSelf: "center", margin: 20, backgroundColor: cartQtyLoader === "" ? COLOUR.PRIMARY : COLOUR.GRAY }} />
        </View> : null
    }
    if (loader) {
        return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Lottie source={require('../../../assets/lottie/loader.json')} autoPlay loop style={{ width: 150, height: 150 }} />
            <Text title={"Loading..."} type="ROBO_BOLD" lines={2} style={[styles.catText, { color: COLOUR.PRIMARY }]} />
        </View>
    }
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle={"dark-content"} />
            <Header
                style={{ backgroundColor: "transparent" }}
                singleTitle={"Shopping Cart"} />
            {subtotal > 0 ? <TitleContainer
                title="Order details" /> : null}
            {!loggedOut ?
                <View>
                    <FlatList
                        data={cartProductList}
                        renderItem={({ item, index }) => {
                            return renderProductCard(item, index)
                        }}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={item => item._id}
                        ListEmptyComponent={() => {
                            return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                <Text title={"No products found in your cart."} type="ROBO_REGULAR" lines={1} />
                            </View>
                        }}
                        ListFooterComponent={() => {
                            return renderCheckoutButton();
                        }}
                    />
                </View> :
                <View style={styles.logoutContainer}>
                    <Lottie source={require('../../../constants/log_cont.json')} autoPlay loop style={{ width: width / 1.5, height: width / 1.5 }} />
                    <Text title={"Login to see cart products."} type="LOUIS_LIGHT" />
                </View>}
            <Modal visible={visible} contentContainerStyle={{ flex: 1 }}>
                <View elevation={3} style={styles.modalContainer}>
                    <Text title={`Are you sure want to remove this product from your cart?`} type="ROBO_BOLD" lines={2} style={{ color: COLOUR.BLACK, textAlign: "center" }} />
                    {!removing ? <View style={styles.buttonContainer}>
                        <Button
                            title="Remove"
                            onPress={() => { removeFromCart(); }}
                            style={[styles.buttonStyle, { backgroundColor: COLOUR.RED }]} />
                        <Button
                            title="Cancel"
                            onPress={() => { setVisible(false); setSelectedProduct("") }}
                            style={[styles.buttonStyle, { backgroundColor: COLOUR.DARK_BLUE }]} />
                    </View> : <View style={styles.buttonContainer}>
                        <Lottie source={require('../../../assets/lottie/loader.json')} autoPlay loop style={{ width: 50, height: 50 }} />
                    </View>}
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardContainer: {
        width: "90%",
        height: 100,
        backgroundColor: COLOUR.WHITE,
        borderRadius: 10,
        padding: 10,
        margin: 5,
        alignSelf: "center",
        elevation: 3,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    imageContainer: {
        width: "25%",
        height: "100%",
    },
    dataContainer: {
        width: "41%",
        height: "100%",
    },
    priceContainer: {
        width: "30%",
        height: "100%",
        alignItems: "flex-end",
        justifyContent: "space-between"
    },
    dimensionContainer: {
        width: "70%",
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    modalContainer: {
        width: "90%",
        borderRadius: 20,
        alignItems: "center",
        backgroundColor: COLOUR.WHITE,
        justifyContent: "center",
        alignSelf: "center",
        padding: 20
    },
    buttonContainer: {
        width: "80%",
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "row",
        marginTop: 30
    },
    buttonStyle: {
        width: "43%",
        height: 40
    },
    logoutContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    }
})