import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, StatusBar, ScrollView, TouchableOpacity, ToastAndroid, Platform } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RadioButton } from "react-native-paper";
import Header from "../../../component/header";
import Text from "../../../component/text";
import TitleContainer from "../../../component/titleContainer";
import Button from "../../../component/button";
import { postFunction, getFunction, deleteFunction } from "../../../constants/apirequest";
import { useSelector, useDispatch } from 'react-redux';
import RazorpayCheckout from 'react-native-razorpay';
import { updateCartProductList } from "../../redux/action";
import { Modal } from 'react-native-paper';
import Lottie from 'lottie-react-native';
import {AmplitudeTrack} from "../../../constants/amplitudeConfig";
import {PAUMENT_TYPE, PAUMENT_METHOD} from "../../res/arrayList";

export default function PaymentScreen(props) {
    const [paymentSelected, setPaymentSelected] = useState("direct");
    const [address, setAddress] = useState(0);
    const [addressList, setAddressList] = useState([]);
    const [loader, setLoader] = useState(true);
    const [payVisible, setPayVisible] = React.useState(false);
    const [orderConfirm, setOrderConfirm] = React.useState(false);
    const [deliveryFees, setDeliveryFees] = React.useState(0);
    const [payType, setPayType] = React.useState("full");
    const [totalAmount, setTotalAmount] = React.useState(0);
    const [deliveryLoader, setDeliveryLoader] = React.useState(false);
    const cartProductList = useSelector(state => state.reducer.cart_product_list);
    const user = useSelector(state => state.reducer.profile);
    const dispatch = useDispatch();

    useEffect(() => {
        getAddressList();
    }, [])

    function getAddressList() {
        getFunction(`/address/${user._id}`, res => {
            if (res.success === true) {
                setAddressList(res.data)
                getDeliveryAmount(res.data[0].country)
            }
        })
    }

    function getDeliveryAmount(id) {
        getFunction(`/delivery/${id}`, res => {
            if (res.success === true) {
                setDeliveryFees(res.data[0].fees);
                let total = (totalCalculator("subtotal") + deliveryFees)
                setTotalAmount(total)
            }
            setDeliveryLoader(false);
            setLoader(false);
        })
    }


    function dummyOrder() {
        if (paymentSelected === "") {
            ToastAndroid.showWithGravity("Select payment type", ToastAndroid.CENTER, ToastAndroid.SHORT);
        } else if (address === "") {
            ToastAndroid.showWithGravity("Select address", ToastAndroid.CENTER, ToastAndroid.SHORT);
        } else {
            let total = Number(deliveryFees + totalCalculator("subtotal"));
            let payAmount = payType === "full" ? total : (50 / 100) * total;
            setPayVisible(true);
            newOrderFunction();
            AmplitudeTrack("PAYMENT_SUCCESS", {id: user._id, value: payAmount});
        }
    }

    function validatePayment() {
        if (paymentSelected === "") {
            ToastAndroid.showWithGravity("Select payment type", ToastAndroid.CENTER, ToastAndroid.SHORT);
        } else if (address === "") {
            ToastAndroid.showWithGravity("Select address", ToastAndroid.CENTER, ToastAndroid.SHORT);
        } else {
            let total = Number(deliveryFees + totalCalculator("subtotal"));
            let payAmount = payType === "full" ? total : (50 / 100) * total;
            var options = {
                description: 'Online payment',
                image: require("../../../assets/images/sarashwathi.jpg"),
                currency: 'INR',
                key: 'rzp_test_e8HTrM8Epd80VR', // Your api key
                amount: String(payAmount) + "00",
                name: "EASHA ARTS",
                prefill: {
                    email: user.email,
                    contact: user.phone,
                    name: user.name
                },
                theme: { color: COLOUR.PRIMARY }
            }

            RazorpayCheckout.open(options).then((data) => {
                // handle success
                setPayVisible(true);
                newOrderFunction();
                AmplitudeTrack("PAYMENT_SUCCESS", {id: user._id, value: payAmount});
            }).catch((error) => {
                // handle failure
                AmplitudeTrack("PAYMENT_FAILURE", {id: user._id, error: `${error.code} | ${error.description}`});
                console.log(`Error: ${error.code} | ${error.description}`);
            });
        }
    }

    function newOrderFunction() {
        AmplitudeTrack("ORDER_PROCESSING", {id: user._id});
        var product = new Array();
        let total = Number(deliveryFees + totalCalculator("subtotal"));
        let paid = payType === "full" ? total : (50 / 100) * total;
        cartProductList.map(item => {
            product.push({
                productId: item.itemId._id,
                quantity: 1
            })
        })
        var options = {
            orderItems: product,
            addressId: addressList[address]._id,
            phone: String(user.phone),
            user: user._id,
            deliveryPrice: Number(deliveryFees),
            totalPrice: Number(total),
            subTotal: totalCalculator("subtotal"),
            amountPaid: Number(paid),
            amountDue: payType === "full" ? 0 : Number(total - paid)
        }
        postFunction(`/order/new`, options, (res) => {
            if (res.success === true) {
                setOrderConfirm(true)
                deleteCartFunction();
                AmplitudeTrack("ORDER_SUCCESS", {id: user._id});
            }else {
                setOrderConfirm(false)
                setPayVisible(false);
                ToastAndroid.showWithGravity("Order placement failed. Please try again later.", ToastAndroid.CENTER, ToastAndroid.LONG);
                props.navigation.navigate("CartScreen");
                AmplitudeTrack("ORDER_FAIL", {id: user._id, order_data: options});
            }
        })
    }

    function deleteCartFunction() {
        deleteFunction(`/cart/user/${user._id}`, res => {
            console.log("Cart ===> ", res)
            if (res.success === true) {
                setOrderConfirm(false)
                setPayVisible(false);
                dispatch(updateCartProductList([]));
                props.navigation.navigate("CartScreen");
            }
        })
    }

    function totalCalculator(type) {
        if (type === "subtotal") {
            if (cartProductList.length > 0) {
                let subtotal = 0;
                subtotal = cartProductList.map(item => item.itemId.price).reduce((prev, next) => prev + next);
                return subtotal;
            }
        } else if (type === "total") {
            let subtotal = 0;
            subtotal = cartProductList.map(item => item.itemId.price).reduce((prev, next) => prev + next);
            return subtotal + deliveryFees;
        }
    }

    function renderPaymentMethod() {
        return (
            <View style={[styles.cardContainer, { flexDirection: "column", justifyContent: "center", marginTop: 20 }]}>
                {PAUMENT_METHOD.map(item => {
                return <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 40, alignItems: "center", justifyContent: "space-between", borderBottomWidth: 2, borderColor: COLOUR.LIGHTGRAY }]}>
                    <Text title={item.title} type="ROBOTO_MEDIUM" lines={1} />
                    <RadioButton
                        onPress={() => { setPaymentSelected(item.value) }}
                        status={paymentSelected === item.value ? "checked" : "unchecked"} />
                </View>
                })}
            </View>
        )
    }

    function renderPaymentType() {
        return (
            <View style={[styles.cardContainer, { flexDirection: "column", justifyContent: "center", height: 100, marginTop: 20 }]}>
                {PAUMENT_TYPE.map(item => {
                return <View key={item.id} style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 50, alignItems: "center", justifyContent: "space-between", borderBottomWidth: 2, borderColor: COLOUR.LIGHTGRAY }]}>
                    <Text title={item.title} type="ROBOTO_MEDIUM" lines={1} />
                    <RadioButton
                        onPress={() => { setPayType(item.value) }}
                        status={payType === item.value ? "checked" : "unchecked"} />
                </View>
                })}
            </View>
        )
    }

    function renderAddress() {
        return (
            <View style={[styles.cardContainer, { flexDirection: "column", justifyContent: "center", marginTop: 20 }]}>
                {addressList.map((item, index) => {
                    return <View key={index} style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 80, paddingTop: 10, alignItems: "center", overflow: "hidden", borderBottomWidth: 2, borderColor: COLOUR.LIGHTGRAY }]}>
                        <RadioButton
                            onPress={() => { setAddress(index); getDeliveryAmount(item.country) }}
                            status={address === index ? "checked" : "unchecked"} />
                        <View style={{ width: '85%', paddingBottom: 10 }}>
                            <Text title={item.type} type="ROBOTO_MEDIUM" lines={1} />
                            <Text title={`${item.houseNo}, ${item.street}, ${item.area}, \n${item.city} - ${item.zip}`} type="ROBO_REGULAR" lines={2} style={{ color: COLOUR.GRAY }} />
                        </View>
                    </View>
                })}
                <View style={[styles.dataContainer, { width: "100%", height: 60, alignItems: "center", justifyContent: "center" }]}>
                    <TouchableOpacity onPress={() => props.navigation.navigate("NewAddress")} style={{ width: "80%", height: 35, alignItems: "center", justifyContent: "center" }}>
                        <Text title={"+ Add new address"} type="ROBO_REGULAR" lines={1} style={{ color: COLOUR.DARK_GRAY }} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle={"dark-content"} />
            <Header
                style={{ backgroundColor: "transparent" }}
                onGoBack={() => props.navigation.goBack()}
                singleTitle="Payment" />
            {!loader ? <ScrollView>
                <TitleContainer
                    title="Payment methods" />
                <View>
                    {renderPaymentMethod()}
                    <TitleContainer
                        title="Shipping address" />
                    {renderAddress()}
                    {/* <TitleContainer
                        title="Payment type" />
                    {renderPaymentType()} */}
                    <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", paddingHorizontal: 20, height: 40, alignItems: "center", justifyContent: "space-between", overflow: "hidden" }]}>
                        <Text title={"Subtotal"} type="ROBO_REGULAR" lines={1} />
                        <Text title={`₹` + totalCalculator("subtotal")} type="ROBO_BOLD" lines={1} style={{ color: COLOUR.PRIMARY }} />
                    </View>
                    <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", paddingHorizontal: 20, height: 70, alignItems: "center", justifyContent: "space-between", overflow: "hidden" }]}>
                        {/* <Text title={"Delivery Price"} type="ROBO_REGULAR" lines={1} />
                        <Text title={`₹` + deliveryFees} type="ROBO_BOLD" lines={1} style={{ color: COLOUR.PRIMARY }} /> */}
                <Text title={"Our Easha Arts customer care officer will call you and confirm the order and delivery price. Make sure your registered mobile number and email are active."} type="ROBOTO_MEDIUM" style={{color: "red"}} lines={4} />
                    </View>
                    <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", paddingHorizontal: 20, height: 40, alignItems: "center", justifyContent: "space-between", overflow: "hidden" }]}>
                        <Text title={"Total"} type="ROBO_BOLD" lines={1} />
                        <Text title={`₹` + (totalCalculator("subtotal") + deliveryFees)} type="ROBO_BOLD" lines={1} style={{ color: COLOUR.ORANGE_DARK }} />
                    </View>
                    {/* <Button
                        onPress={() => validatePayment()}
                        title={`Pay ₹${payType === "full" ? (totalCalculator("subtotal") + deliveryFees) : ((50 / 100) * (totalCalculator("subtotal") + deliveryFees))}`}
                        style={{ alignSelf: "center", margin: 20 }} /> */}
                        <Button
                        onPress={() => {
                            alert(global.acceptOrder)
                            if(global.acceptOrder === true) {
                                dummyOrder()
                            }else {
                                ToastAndroid.showWithGravity("We are facing some technical issue. Please try after some times.", ToastAndroid.CENTER, ToastAndroid.LONG);
                            }
                        }}
                        title={`Order Now`}
                        style={{ alignSelf: "center", margin: 20 }} />
                </View>
            </ScrollView> :
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <Lottie source={require('../../../constants/loader.json')} autoPlay loop style={{ width: 150, height: 150 }} />
                </View>}
            <Modal visible={payVisible} >
                <View style={styles.modalContainer}>
                    {/* <Text title={"Payment Success!"} type="ROBO_BOLD" lines={1} style={{ color: COLOUR.PRIMARY }} /> */}
                    <Text title={"Hoooraayyy!!"} type="ROBO_BOLD" lines={1} style={{ color: COLOUR.PRIMARY }} />
                    <Text title={"Please wait your order is in progress. It will take upto 1 minute to complete.."} type="ROBO_REGULAR" style={{ color: COLOUR.DARK_GRAY, textAlign: "center", width: "80%", marginTop: 10 }} />
                    {!orderConfirm ? <Lottie source={require('../../../constants/message.json')} autoPlay loop style={{ width: 200, height: 200 }} /> :
                        <Lottie source={require('../../../constants/order_success.json')} autoPlay style={{ width: 200, height: 200 }} />}
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
        height: "80%",
        backgroundColor: COLOUR.WHITE,
        alignSelf: "center",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    }
})