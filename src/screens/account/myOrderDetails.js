import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, StatusBar, Dimensions, TouchableOpacity, ToastAndroid, ScrollView, Alert } from "react-native";
import * as COLOUR from "../../../constants/colors";
import StepIndicator from 'react-native-step-indicator';
import Header from "../../../component/header";
import Text from "../../../component/text";
import Button from "../../../component/button";
import TitleContainer from "../../../component/titleContainer";
const { width } = Dimensions.get("screen");
import { putFunction, getFunction } from "../../../constants/apirequest";
import RazorpayCheckout from 'react-native-razorpay';
import moment from "moment";
import { useSelector, useDispatch } from 'react-redux';

const labels = ["Order\nplaced", "In progress", "Waiting for\npayment", "Product\nshipped", "Delivered"];
const labels1 = ["Order\nplaced", "In progress", "Product\nshipped", "Delivered"];
export default function MyOrdersDetails(props) {
    var id = props.route.params.data;
    const orderList = useSelector(state => state.reducer.orderList);
    const orderData = orderList.find(x => x._id === id)
    const [addressData, setAddressData] = useState("");
    const [orderStatus, setOrderStatus] = useState("");
    const [btnLoader, setBtnLoader] = useState(false);
    const [isAmountDue, setIsAmountDue] = useState(false);
    const user = useSelector(state => state.reducer.profile);
    useEffect(() => {
        getAddressById();
        let status = orderData.status === "PROCESSING" ? 0 : orderData.status === "INPROCESS" ? 1 : orderData.status === "PAYMENT" ? 2 : orderData.status === "SHIPMENT" ? 3 : orderData.status === "DELIVERED" ? 4 : 0
        setOrderStatus(status)
        setIsAmountDue(orderData.amountDue > 0 ? false : true)
    }, [])

    function getAddressById() {
        getFunction(`/addressbyid/${orderData.addressId}`, res => {
            if (res !== "error") {
                setAddressData(res.data);
            }
        })
    }

    function payDueAmount() {
        var options = {
            description: 'Online payment',
            image: require("../../../assets/images/sarashwathi.jpg"),
            currency: 'INR',
            key: 'rzp_test_e8HTrM8Epd80VR', // Your api key
            amount: String(orderData.amountDue) + "00",
            name: "EASHA ARTS",
            prefill: {
                email: user.email,
                contact: user.phone,
                name: user.name
            },
            theme: { color: COLOUR.PRIMARY }
        }
        setBtnLoader(true)
        RazorpayCheckout.open(options).then((data) => {
            // handle success
            console.log(data)
            updateOrderFunction();
        }).catch((error) => {
            // handle failure
            setBtnLoader(false)
            console.log(error)
            console.log(`Error: ${error.code} | ${error.description}`);
        });
    }

    function updateOrderFunction() {
        let options = {
            "amountPaid": orderData.totalPrice,
            "amountDue": 0
        }
        console.log(`/order/edit/${orderData._id}`)
        putFunction(`/order/edit/${orderData._id}`, options, (res) => {
            console.log(res)
            if (res.success === true) {
                setBtnLoader(false)
            }else {
                setBtnLoader(false)
                Alert.alert("Easha Arts","Payment done successfully, but not reflected in order. We received the query about this issue and we are working on it. This payment details will update this order with 24hrs.")
            }
        })
    }

    function renderAddressCard() {
        return (
            <View style={styles.cardContainer}>
                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ paddingHorizontal: 10, paddingVertical: 5, backgroundColor: COLOUR.GRAY, borderRadius: 5 }}>
                        <Text title={`${addressData?.type}`} type="ROBOTO_MEDIUM" style={{ color: COLOUR.DARK_GRAY, fontSize: 12 }} />
                    </View>
                </View>
                <Text title={`${orderData?.user.name},`} type="ROBOTO_MEDIUM" style={{ color: COLOUR.PRIMARY, fontSize: 16 }} />
                <Text title={`${addressData?.houseNo}, ${addressData?.street}`} type="ROBOTO_MEDIUM" style={{ color: COLOUR.DARK_GRAY, fontSize: 14 }} />
                <Text title={`${addressData?.area},`} type="ROBOTO_MEDIUM" style={{ color: COLOUR.DARK_GRAY, fontSize: 12, marginVertical: 2 }} />
                <Text title={`${addressData?.city} - ${addressData?.zip},`} type="ROBOTO_MEDIUM" style={{ color: COLOUR.DARK_GRAY, fontSize: 12, marginVertical: 2 }} />
                <Text title={`${addressData?.state}, ${addressData?.country}`} type="ROBOTO_MEDIUM" style={{ color: COLOUR.DARK_GRAY, fontSize: 12 }} />
                <Text title={`Mobile: ${orderData?.phone}`} type="ROBOTO_REGULAR" style={{ color: COLOUR.DARK_GRAY, fontSize: 12 }} />
            </View>
        )
    }

    function renderProductCard(item, index) {
        return (
            <View style={styles.pcardContainer}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.product.image }} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                </View>
                <View style={[styles.dataContainer]}>
                    <Text title={item.product.name} type="ROBOTO_MEDIUM" lines={1} />
                    <Text title={"Wooden frame"} type="ROBOTO_MEDIUM" lines={2} style={{ fontSize: 14, color: COLOUR.ORANGE_DARK }} />
                    <View style={styles.dimensionContainer}>
                        <Text title={`${item.product.width} × ${item.product.height} ${item.product.type}`} type="ROBOTO_MEDIUM" lines={2} style={{ fontSize: 8, color: COLOUR.WHITE }} />
                    </View>
                </View>
                <View style={styles.priceContainer}>
                    <Text title={`₹ ` + item.product.price} type="ROBOTO_MEDIUM" lines={1} style={{ color: COLOUR.PRIMARY }} />
                </View>
            </View>
        )
    }

    function renderTotal() {
        return (
            <View style={[styles.cardContainer, { flexDirection: "column", justifyContent: "center", marginTop: 20 }]}>
                <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 30, alignItems: "center", justifyContent: "space-between" }]}>
                    <Text title={"Subtotal"} type="ROBOTO_MEDIUM" lines={1} />
                    <Text title={`₹ ${orderData?.subTotal}`} type="ROBOTO_MEDIUM" lines={2} style={{ color: COLOUR.PRIMARY }} />
                </View>
                {/* <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 30, alignItems: "center", justifyContent: "space-between" }]}>
                    <Text title={"Delivery Price"} type="ROBOTO_MEDIUM" lines={1} />
                    <Text title={`₹ ${orderData?.deliveryPrice}`} type="ROBOTO_MEDIUM" lines={2} style={{ color: COLOUR.PRIMARY }} />
                </View> */}
                <Text title={"Our Easha Arts customer care officer will call you and confirm the order and delivery price"} type="ROBOTO_MEDIUM" style={{color: "red"}} lines={3} />
                <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 40, alignItems: "center", justifyContent: "space-between", borderTopWidth: 1 }]}>
                    <Text title={"Total"} type="ROBO_BOLD" lines={1} />
                    <Text title={`₹ ${orderData?.totalPrice}`} type="ROBO_BOLD" lines={2} style={{ color: COLOUR.PRIMARY }} />
                </View>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle={"dark-content"} />
            <Header
                style={{ backgroundColor: "transparent" }}
                back
                onGoBack={() => props.navigation.goBack()}
                title={"Order Details" + orderStatus} />
            <ScrollView showsVerticalScrollIndicator={false}>
                {isAmountDue  ?
                    <StepIndicator
                        customStyles={customStyles}
                        currentPosition={orderStatus}
                        stepCount={4}
                        labels={labels1}
                    /> : <StepIndicator
                    customStyles={customStyles}
                    stepCount={5}
                    currentPosition={orderStatus}
                    labels={labels}
                /> }
                <TitleContainer
                    title="Delivery Address" />
                {renderAddressCard()}
                {orderData.status !== "PROCESSING" ?
                    <View style={[styles.dataContainer, { flexDirection: "row", width: "90%", alignSelf: "center", height: 30, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 10, borderRadius: 10, backgroundColor: COLOUR.PRIMARY }]}>
                        <Text title={"Expected delivery date"} type="ROBOTO_MEDIUM" lines={1} style={{ color: COLOUR.WHITE }} />
                        <Text title={moment(orderData?.expDelDate).format("DD MMM YYYY")} type="ROBOTO_MEDIUM" lines={2} style={{ color: COLOUR.WHITE }} />
                    </View> : null}
                <TitleContainer
                    title="Order Bill" />
                {orderData.orderItems.map((item, index) => {
                    return renderProductCard(item, index);
                })}
                <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 30, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 10, borderRadius: 10, backgroundColor: COLOUR.WHITE }]}>
                    <Text title={"Payment Method"} type="ROBOTO_MEDIUM" lines={1} />
                    <Text title={"Online"} type="ROBOTO_MEDIUM" lines={2} style={{ color: COLOUR.PRIMARY }} />
                </View>
                {/* <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 30, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, borderRadius: 10, backgroundColor: COLOUR.WHITE }]}>
                    <Text title={"Amount Paid"} type="ROBOTO_MEDIUM" lines={1} />
                    <Text title={`₹ ${orderData?.amountPaid}`} type="ROBOTO_MEDIUM" lines={2} style={{ color: COLOUR.PRIMARY }} />
                </View>
                <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 30, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, borderRadius: 10, backgroundColor: COLOUR.WHITE }]}>
                    <Text title={"Amount Due"} type="ROBOTO_MEDIUM" lines={1} />
                    <Text title={`₹ ${orderData?.amountDue}`} type="ROBOTO_MEDIUM" lines={2} style={{ color: COLOUR.RED }} />
                </View> */}
                {orderData.status === "PAYMENT" && orderData?.amountDue > 0 ?
                    <View style={[styles.dataContainer, { width: "100%", height: 60, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, borderRadius: 10, backgroundColor: COLOUR.WHITE, merginTop: 20 }]}>
                        <Button
                            title={`Pay ₹${orderData?.amountDue}`}
                            onPress={() => payDueAmount()}
                            style={{ width: "50%", height: 35, justifyContent: "center" }} />
                    </View> : null}
                {renderTotal()}

            </ScrollView>
        </View>
    )
}

const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: COLOUR.PRIMARY,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: COLOUR.PRIMARY,
    stepStrokeUnFinishedColor: COLOUR.GRAY,
    separatorFinishedColor: COLOUR.PRIMARY,
    separatorUnFinishedColor: COLOUR.GRAY,
    stepIndicatorFinishedColor: COLOUR.PRIMARY,
    stepIndicatorUnFinishedColor: COLOUR.WHITE,
    stepIndicatorCurrentColor: COLOUR.WHITE,
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: COLOUR.PRIMARY,
    stepIndicatorLabelFinishedColor: COLOUR.WHITE,
    stepIndicatorLabelUnFinishedColor: COLOUR.GRAY,
    labelColor: COLOUR.GRAY,
    labelSize: 13,
    currentStepLabelColor: COLOUR.PRIMARY
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE
    },
    cardContainer: {
        width: "100%",
        padding: 10,
        paddingHorizontal: 20,
        backgroundColor: COLOUR.WHITE,
        marginVertical: 5
    },
    dataContainer: {
        width: "41%",
        height: "100%",
    },
    pcardContainer: {
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
})