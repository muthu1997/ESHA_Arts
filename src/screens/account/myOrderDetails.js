import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, StatusBar, Dimensions, ToastAndroid, ScrollView, Alert, TouchableOpacity } from "react-native";
import * as COLOUR from "../../../constants/colors";
import StepIndicator from 'react-native-step-indicator';
import Header from "../../../component/header";
import Text from "../../../component/text";
import Button from "../../../component/button";
import TitleContainer from "../../../component/titleContainer";
const { width } = Dimensions.get("screen");
import { getMethod, putMethod } from "../../../utils/function";
import { PTM_MID } from "../../../utils/config";
import { updateOrderList } from "../../redux/action";
import { useSelector, useDispatch } from 'react-redux';
import moment from "moment";
import Lottie from 'lottie-react-native';
import { updateAFEvent } from "../../../utils/appsflyerConfig";
import AllInOneSDKManager from 'paytm_allinone_react-native';
import { ORDER_DETAILS_INIT, GET_ORDER_ADDRESS_SUCCESS, GET_ORDER_ADDRESS_ERROR, PAY_DUE_AMOUNT_SUCCESS, PAY_DUE_AMOUNT_ERROR, PAY_DUE_AMOUNT_RETRY, UPDATE_ORDER_SUCESS, UPDATE_ORDER_ERROR } from "../../../utils/events";

const labels = ["Order\nplaced", "In progress", "Waiting for\npayment", "Product\nshipped", "Delivered"];
const labels1 = ["Order\nplaced", "In progress", "Product\nshipped", "Delivered"];
export default function MyOrdersDetails(props) {
    var id = props.route.params.data;
    const orderList = useSelector(state => state.reducer.orderList);
    const orderData = orderList.find(x => x._id === id)
    const [addressData, setAddressData] = useState("");
    const [orderStatus, setOrderStatus] = useState("");
    const [btnLoader, setBtnLoader] = useState(false);
    const [loader, setLoader] = useState(false);
    const [isAmountDue, setIsAmountDue] = useState(false);
    const user = useSelector(state => state.reducer.profile);
    const dispatch = useDispatch();
    useEffect(() => {
        console.log(JSON.stringify(orderData))
        updateAFEvent(ORDER_DETAILS_INIT, "");
        getAddressById();
        let status = orderData.status === "PROCESSING" ? 0 : orderData.status === "INPROCESS" ? 1 : orderData.status === "PAYMENT" ? 2 : orderData.status === "SHIPMENT" ? 3 : orderData.status === "DELIVERED" ? 4 : 0
        if (orderData.amountDue === 0 && status === 3) {
            setOrderStatus(2)
        } else {
            setOrderStatus(status)
        }
        setIsAmountDue(orderData.amountDue > 0 ? false : true)
    }, [])

    function getAddressById() {
        getMethod(`/addressbyid/${orderData.addressId}`).then(res => {
            updateAFEvent(GET_ORDER_ADDRESS_SUCCESS, "");
            setAddressData(res.data);
        }).catch(error => {
            updateAFEvent(GET_ORDER_ADDRESS_ERROR, { "ERROR_DATA": error });
            ToastAndroid.show("Unable to get order delivery address. Please close the app and open again.")
        })
    }

    async function payDueAmount() {
        let ordid = `ORD_HNDMD_${moment()}`;
        var options = {
            orderIdFromApp: ordid,
            amount: String(orderData.amountDue),
            user: user._id
        }
        console.log(options)
        setBtnLoader(true)
        await putMethod(`/order/pay/token`, options).then((res) => {
            console.log(res);
            AllInOneSDKManager.startTransaction(
                ordid,
                PTM_MID,
                res.token,
                String(orderData.amountDue),
                "",
                true,
                false,
                ""
            ).then(async (result) => {
                console.log(result)
                if (result.STATUS !== "TXN_FAILURE") {
                    updateAFEvent(UPDATE_ORDER_SUCESS, { "ORDER_ID": orderData._id });
                    ToastAndroid.show("Payment done successfully.", ToastAndroid.CENTER, ToastAndroid.BOTTOM)
                    updateAFEvent(PAY_DUE_AMOUNT_SUCCESS, { "DATA": result });
                    updateOrderFunction();
                    return setBtnLoader(false);
                } else {
                    console.log(result)
                    ToastAndroid.showWithGravity(result.RESPMSG, ToastAndroid.CENTER, ToastAndroid.BOTTOM);
                    return setBtnLoader(false);
                }
            }).catch((error) => {
                updateAFEvent(PAY_DUE_AMOUNT_ERROR, { "ERROR_DATA": error });
                // handle failure
                Alert.alert("", "Payment failed. Do you want to try again?", [
                    {
                        text: "TRY AGAIN",
                        onPress: () => {
                            updateAFEvent(PAY_DUE_AMOUNT_RETRY, "");
                            payDueAmount()
                        }
                    },
                    {
                        text: "CANCEL"
                    }
                ])
                setBtnLoader(false)
                return console.log(error)
            });
        }).catch(error => {
            updateAFEvent(UPDATE_ORDER_ERROR, { "ERROR_DATA": error, "DATA": options, "URL": `/order/edit/${orderData._id}` });
            return ToastAndroid.show("Payment done successfully. You will get update within 24 hours.", ToastAndroid.CENTER, ToastAndroid.BOTTOM)
        })
    }

    function updateOrderFunction() {
        setLoader(true);
        let options = {
            "amountPaid": orderData.totalPrice,
            "amountDue": 0,
            "status": "PAYMENT DONE"
        }
        console.log(options)
        putMethod(`/order/edit/${orderData._id}`, options).then((res) => {
            dispatch(updateOrderList(user._id)).then(response => {
                setLoader(false);
            })
            updateAFEvent(UPDATE_ORDER_SUCESS, { "ORDER_ID": orderData._id });
            setBtnLoader(false)
            ToastAndroid.show("Payment done successfully.", ToastAndroid.CENTER, ToastAndroid.BOTTOM)
        }).catch(error => {
            updateAFEvent(UPDATE_ORDER_ERROR, { "ERROR_DATA": error, "DATA": options, "URL": `/order/edit/${orderData._id}` });
            ToastAndroid.show("Payment done successfully. You will get update within 24 hours.", ToastAndroid.CENTER, ToastAndroid.BOTTOM)
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
                <Text title={`${addressData?.name},`} type="ROBOTO_MEDIUM" style={{ color: COLOUR.PRIMARY, fontSize: 16 }} />
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
            <TouchableOpacity activeOpacity={0.8} key={item._id} onPress={() => props.navigation.navigate("ProductDetails", { id: item.product._id })} style={styles.pcardContainer}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.product.image[0].image }} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                </View>
                <View style={{width: "70%"}}>
                    <Text title={item.product.name} type="ROBOTO_MEDIUM" lines={2} />
                    {/* <Text title={item.sizeId.size_title} type="ROBOTO_MEDIUM" lines={2} style={{ fontSize: 14, color: COLOUR.ORANGE_DARK }} /> */}
                    <View style={styles.dimensionContainer}>
                        <Text title={`Quantity ${item.quantity}`} type="ROBOTO_MEDIUM" lines={2} style={{ fontSize: 8, color: COLOUR.DARK_GRAY }} />
                    </View>
                </View>
                <View style={styles.priceContainer}>
                    {/* <Text title={`₹ ` + item.sizeId.price} type="ROBOTO_MEDIUM" lines={1} style={{ color: COLOUR.PRIMARY }} /> */}
                </View>
            </TouchableOpacity>
        )
    }

    function renderTotal() {
        return (
            <View style={[styles.cardContainer, { flexDirection: "column", justifyContent: "center", marginTop: 20 }]}>
                <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 30, alignItems: "center", justifyContent: "space-between" }]}>
                    <Text title={"Subtotal"} type="ROBOTO_MEDIUM" lines={1} />
                    <Text title={`₹ ${orderData?.subTotal}`} type="ROBOTO_MEDIUM" lines={2} style={{ color: COLOUR.PRIMARY }} />
                </View>
                <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 30, alignItems: "center", justifyContent: "space-between" }]}>
                    <Text title={"Delivery Price"} type="ROBOTO_MEDIUM" lines={1} />
                    <Text title={`₹ ${orderData?.deliveryPrice}`} type="ROBOTO_MEDIUM" lines={2} style={{ color: COLOUR.PRIMARY }} />
                </View>
                <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 40, alignItems: "center", justifyContent: "space-between", borderTopWidth: 1 }]}>
                    <Text title={"Total"} type="ROBO_BOLD" lines={1} />
                    <Text title={`₹ ${orderData?.totalPrice}`} type="ROBO_BOLD" lines={2} style={{ color: COLOUR.PRIMARY }} />
                </View>
            </View>
        )
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
                back
                rightButton={true}
                rightButtonIcon="wechat"
                onPress={()=>{
                    Alert.alert("Warning!", "Don't share your personal details like mobile number to the seller.", [
                        {
                            text: "CONTINUE",
                            onPress: () => props.navigation.navigate("PChatScreen", {customer: {"name": user.name, _id: orderData.productOwner}})
                        },{
                            text: "CANCEL"
                        }
                    ])
                }}
                onGoBack={() => props.navigation.goBack()}
                title={"Order Details"} />
            <ScrollView showsVerticalScrollIndicator={false}>
                {isAmountDue ?
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
                    />}
                <TitleContainer
                    title="Delivery Address" />
                {renderAddressCard()}
                {orderData.status !== "PROCESSING" ?
                    <View style={[styles.dataContainer, { flexDirection: "row", width: "90%", alignSelf: "center", height: 30, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 10, borderRadius: 10, backgroundColor: COLOUR.DARK_GRAY }]}>
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
                <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 30, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, borderRadius: 10, backgroundColor: COLOUR.WHITE }]}>
                    <Text title={"Amount Paid"} type="ROBOTO_MEDIUM" lines={1} />
                    <Text title={`₹ ${orderData?.amountPaid}`} type="ROBOTO_MEDIUM" lines={2} style={{ color: COLOUR.PRIMARY }} />
                </View>
                <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 30, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, borderRadius: 10, backgroundColor: COLOUR.WHITE }]}>
                    <Text title={"Amount Due"} type="ROBOTO_MEDIUM" lines={1} />
                    <Text title={`₹ ${orderData?.amountDue}`} type="ROBOTO_MEDIUM" lines={2} style={{ color: COLOUR.RED }} />
                </View>
                {orderData?.status === "PAYMENT" && orderData?.amountDue > 0 ?
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
        width: "50%",
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: COLOUR.GRAY,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
})