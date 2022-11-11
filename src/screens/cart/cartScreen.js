import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, StatusBar, Dimensions, TouchableOpacity, FlatList, DeviceEventEmitter } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../../../component/header";
import Text from "../../../component/text";
import TitleContainer from "../../../component/titleContainer";
import Button from "../../../component/button";
import { updateCartProductList } from "../../redux/action";
import { useSelector, useDispatch } from 'react-redux';
import { getFunction, deleteFunction } from "../../../constants/apirequest";
import { Modal } from 'react-native-paper';
import Lottie from 'lottie-react-native';
const { width } = Dimensions.get("screen");
import {AmplitudeTrack} from "../../../constants/amplitudeConfig";

export default function CartScreen(props) {
    const user = useSelector(state => state.reducer.profile);
    const cartProductList = useSelector(state => state.reducer.cart_product_list);
    const [visible, setVisible] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [subtotal, setSubtotal] = useState(0);
    const [delivery, setDelivery] = useState(0);
    const [loggedOut, setLoggedOut] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            totalCalculator();
        } else {
            setLoggedOut(true)
        }
    },[])

    DeviceEventEmitter.addListener("REFRESH_CART", res => {
        if(res === "yes") {
            setTimeout(() => {
                DeviceEventEmitter.emit("REFRESH_CART", "no")
            },1000)
            setLoggedOut(false)
            if (user) {
                getCartList();
            }
        }
        if(res === "logout") {
            setTimeout(() => {
                DeviceEventEmitter.emit("REFRESH_CART", "no")
            },1000)
            setLoggedOut(true)
        }
    })

    function getCartList() {
        getFunction(`/cartproduct/${user._id}`, res => {
            console.log("cart")
            if (res !== "error") {
                totalCalculator();
                dispatch(updateCartProductList(res.data));
                AmplitudeTrack("CART_LIST", {number: res.data?.length})
            }
            setRemoving(false)
            setVisible(false)
        })
    }

    function removeFromCart() {
        setRemoving(true)
        let id = cartProductList[selectedProduct]._id;
        deleteFunction(`/cart/${id}`, res => {
            if (res !== "error") {
                getCartList();
                AmplitudeTrack("DELETE_CART_PRODUCT", {product: id})
            } else {
                setRemoving(false)
                setVisible(false);
            }
        })
    }

    function totalCalculator() {
        console.log("cart")
        if (cartProductList.length > 0) {
            let subtotal = 0;
            subtotal = cartProductList.map(item => item.itemId.price).reduce((prev, next) => prev + next);
            setSubtotal(subtotal)
            return subtotal;
        } else {
            setSubtotal(0)
            return 0;
        }
    }

    function renderProductCard(item, index) {
        return (
            <View style={styles.cardContainer}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                </View>
                <View style={[styles.dataContainer]}>
                    <Text title={item.name} type="ROBOTO_MEDIUM" lines={1} />
                    <Text title={"Wooden frame"} type="ROBOTO_MEDIUM" lines={2} style={{ fontSize: 14, color: COLOUR.ORANGE_DARK }} />
                    <View style={styles.dimensionContainer}>
                        <Text title={`${item.width} × ${item.height} ${item.type}`} type="ROBOTO_MEDIUM" lines={2} style={{ fontSize: 8, color: COLOUR.WHITE }} />
                    </View>
                </View>
                <View style={styles.priceContainer}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => { setVisible(true); setSelectedProduct(index) }}>
                        <Icon name="close" size={20} color={COLOUR.DARK_GRAY} />
                    </TouchableOpacity>
                    <Text title={`₹ ` + item.price} type="ROBOTO_MEDIUM" lines={1} style={{ color: COLOUR.PRIMARY }} />
                </View>
            </View>
        )
    }

    function renderTotal() {
        return (
            <View style={[styles.cardContainer, { flexDirection: "column", justifyContent: "center", height: 60, marginTop: 20 }]}>
                {/* <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 40, alignItems: "center", justifyContent: "space-between", borderBottomWidth: 2, borderColor: COLOUR.LIGHTGRAY }]}>
                    <Text title={"Subtotal"} type="ROBOTO_MEDIUM" lines={1} />
                    <Text title={totalCalculator()} type="ROBOTO_MEDIUM" lines={2} style={{ fontSize: 14, color: COLOUR.BLACK }} />
                </View> */}
                {/* <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 40, alignItems: "center", justifyContent: "space-between", borderBottomWidth: 2, borderColor: COLOUR.LIGHTGRAY }]}>
                    <Text title={"Delivery"} type="ROBOTO_MEDIUM" lines={1} />
                    <Text title={delivery} type="ROBOTO_MEDIUM" lines={2} style={{ fontSize: 14, color: COLOUR.BLACK }} />
                </View> */}
                <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 40, alignItems: "center", justifyContent: "space-between" }]}>
                    <Text title={"Product Value"} type="ROBO_BOLD" lines={1} />
                    <Text title={`₹`+totalCalculator()} type="ROBO_BOLD" lines={2} style={{ color: COLOUR.ORANGE_DARK }} />
                </View>
            </View>
        )
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
                            return renderProductCard(item.itemId, index)
                        }}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={item => item._id}
                        ListEmptyComponent={() => {
                            return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                <Text title={"No products found in your cart."} type="ROBO_REGULAR" lines={1} />
                            </View>
                        }}
                        ListFooterComponent={() => {
                            return cartProductList.length > 0 ? <View>
                                {renderTotal()}
                                <Button
                                    title="Checkout"
                                    onPress={() => {
                                        props.navigation.navigate("Payment");
                                        AmplitudeTrack("CHECKOUT_BUTTON")
                                    }}
                                    style={{ alignSelf: "center", margin: 20 }} />
                            </View> : null
                        }} />
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
                        <Lottie source={require('../../../constants/loader.json')} autoPlay loop style={{ width: 50, height: 50 }} />
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
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: COLOUR.GRAY,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    modalContainer: {
        width: "90%",
        height: "35%",
        borderRadius: 20,
        alignItems: "center",
        backgroundColor: COLOUR.WHITE,
        justifyContent: "center",
        alignSelf: "center",
        padding: 20
    },
    buttonContainer: {
        width: "90%",
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "row",
        marginTop: 30
    },
    buttonStyle: {
        width: "40%",
        height: 40
    },
    logoutContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    }
})