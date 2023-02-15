import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, StatusBar, ScrollView, TouchableOpacity, ToastAndroid } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RadioButton } from "react-native-paper";
import Header from "../../../component/header";
import Text from "../../../component/text";
import TitleContainer from "../../../component/titleContainer";
import Button from "../../../component/button";
import { postMethod, deleteMethod } from "../../../utils/function";
import { PTM_MID } from "../../../utils/config";
import { useSelector, useDispatch } from 'react-redux';
import { updateCartProductList, updateAddressList, updateDelivery, sendNotificationToAdmin, updateCartList, updateOrderDetails } from "../../redux/action";
import { Modal } from 'react-native-paper';
import Lottie from 'lottie-react-native';
import { PAUMENT_TYPE, PAUMENT_METHOD } from "../../res/arrayList";
import { updateAFEvent } from "../../../utils/appsflyerConfig";
import { PAY_ADDRLIST_FAIURE, PAY_ADDRLIST_SUCCESS, PAY_DELIAMNT_FAILURE, PAY_DELIAMNT_SUCCESS, PAY_FAILURE, PAY_SUCCESS, ORDER_SUCCESS, ORDER_TRIGGERED, ORDER_FAILURE, DEL_CART_PRODUCTS_FAILURE, DEL_CART_PRODUCTS_SUCCESS, PAY_INIT } from "../../../utils/events";
import moment from "moment/moment";
import AllInOneSDKManager from 'paytm_allinone_react-native';

export default function PaymentScreen(props) {
    const [paymentSelected, setPaymentSelected] = useState("razorpay");
    const [address, setAddress] = useState(0);
    const [loader, setLoader] = useState(true);
    const [payVisible, setPayVisible] = React.useState(false);
    const [orderConfirm, setOrderConfirm] = React.useState(false);
    const [deliveryFees, setDeliveryFees] = React.useState(0);
    const [payType, setPayType] = React.useState("full");
    const [orderSuccessModal, setOrderSuccessModal] = useState(false)
    const [totalAmount, setTotalAmount] = React.useState(0);
    const [deliveryLoader, setDeliveryLoader] = React.useState(false);
    const [getDeliveryAmt, setDeliveryAmt] = useState([]);
    const [orderBtnLoader, setOrderButtonLoader] = useState(false);
    const cartProductList = useSelector(state => state.reducer.cart_product_list);
    const addressList = useSelector(state => state.reducer.address_list);
    const user = useSelector(state => state.reducer.profile);
    const deliveryPriceList = useSelector(state => state.reducer.delivery_charge);
    const dispatch = useDispatch();

    useEffect(() => {
        if (addressList.length === 0) {
            getAddressList();
        }
        getDeliveryAmount(address);
        updateAFEvent(PAY_INIT, "");
    }, [])

    function getAddressList() {
        dispatch(updateAddressList(user._id)).then(res => {
            setLoader(false)
            updateAFEvent(PAY_ADDRLIST_SUCCESS, "");
            setDeliveryLoader(false);
        }).catch(error => {
            updateAFEvent(PAY_ADDRLIST_FAIURE, { "ERROR_DATA": error });
            return ToastAndroid.show("Unable to get address details...", ToastAndroid.BOTTOM, ToastAndroid.CENTER)
        })
    }

    function getDeliveryAmount() {
        let deliveryPriceCalculation = 0;
        cartProductList.forEach(element => {
            deliveryPriceCalculation += Number(element.itemId.deliveryPrice) * Number(element.quantity)
        });
        let delFees = deliveryPriceCalculation;
        let total = (totalCalculator("subtotal") + delFees)
        setTotalAmount(total)
        setDeliveryFees(delFees)
        setDeliveryLoader(false);
        return setLoader(false);
    }

    function validatePayment() {
        if (paymentSelected === "") {
            return ToastAndroid.showWithGravity("Select payment type", ToastAndroid.CENTER, ToastAndroid.SHORT);
        } else if (addressList.length === 0) {
            return ToastAndroid.showWithGravity("Select address", ToastAndroid.CENTER, ToastAndroid.SHORT);
        } else {
            return newOrderFunction();
            // let total = Number(deliveryFees + totalCalculator("subtotal"));
            // let payAmount = payType === "full" ? total : (50 / 100) * total;
            // var options = {
            //     description: 'Online payment',
            //     currency: 'INR',
            //     key: 'rzp_test_e8HTrM8Epd80VR', // Your api key
            //     amount: String(payAmount) + "00",
            //     name: "Handmade Paintings",
            //     prefill: {
            //         email: user.email,
            //         contact: user.phone,
            //         name: user.name
            //     },
            //     theme: { color: COLOUR.PRIMARY }
            // }

            // RazorpayCheckout.open(options).then((data) => {
            //     console.log(data)
            //     updateAFEvent(PAY_SUCCESS, {"DATA": data.razorpay_payment_id});
            //     // handle success
            //     newOrderFunction();
            // }).catch((error) => {
            //     // handle failure
            //     updateAFEvent(PAY_FAILURE, {"ERROR_DATA": error});
            //     Alert.alert("","Payment failed. Do you want to try again?", [
            //         {
            //             text: "TRY AGAIN",
            //             onPress: () => validatePayment()
            //         },
            //         {
            //             text: "CANCEL"
            //         }
            //     ])
            //     console.log(`Error: ${error.code} | ${error.description}`);
            // });
        }
    }

    function newOrderFunction() {
        setOrderButtonLoader(true);
        let ordid = `ORD_HNDMD_${moment()}`;
        var product = new Array();
        let total = Number(deliveryFees + totalCalculator("subtotal"));
        let paid = payType === "full" ? total : (50 / 100) * total;
        cartProductList.map(item => {
            product.push({
                productId: item.itemId._id,
                quantity: 1,
                productOwner: item.itemId.productOwner
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
            amountPaid: Number(total),
            amountDue: 0,
            orderIdFromApp: ordid
        }
        console.log(options)
        return postMethod(`/order/new`, options).then((res) => {
            console.log("order response", res)
            updateAFEvent(ORDER_TRIGGERED, { "UID": user._id });
            return initiatePayment(res.token, paid, ordid, res.data);
        }).catch(error => {
            updateAFEvent(ORDER_FAILURE, { "ERROR_DATA": error, "DATA": options });
            setOrderConfirm(false)
            setPayVisible(false);
            setOrderButtonLoader(false);
            ToastAndroid.showWithGravity(error, ToastAndroid.CENTER, ToastAndroid.LONG);
            return props.navigation.navigate("CartScreen");
        })
    }

    function initiatePayment(token, amount, orderId, orderData) {
        AllInOneSDKManager.startTransaction(
            orderId,
            PTM_MID,
            token,
            String(amount),
            "",
            true,
            false,
            ""
        ).then(async (result) => {
            console.log("Paytm Response: ",result)
            // "RESPCODE": "227" is failure
            // "RESPCODE": "402" is failure
            // "RESPCODE\":\"141\" is failure
            // "RESPCODE": "01"
            if (result?.RESPCODE == "01") {
                setOrderConfirm(true)
                let options = {
                    "status": "PROCESSING",
                    "payment_details": result
                }
                orderData.map(item => {
                    dispatch(updateOrderDetails(item._id, options))
                })
                deleteCartFunction();
                let message = `You got new order from customer. Go to orders tab to see all order details.`;
                return dispatch(sendNotificationToAdmin(message)).then(res => {
                    console.log(res)
                })
            } else {
                ToastAndroid.showWithGravity(result.RESPMSG, ToastAndroid.CENTER, ToastAndroid.LONG);
                return setOrderButtonLoader(false);
            }
            let sample_response = {
                "BANKNAME": "JPMorgan Chase Bank",
                "BANKTXNID": "777001482534311",
                "CHECKSUMHASH": "v0vgOhJLLgZWrLHq3ORRxWdCniQzP6rS5UTdthGE8ZAyWM+ebrQa904DzX4aAJL3UboXR4cVhgPshGV6UXjPxC836D4L0NvHHSubIjN0O8U=",
                "CURRENCY": "INR",
                "GATEWAYNAME": "HDFC",
                "MID": "PXizyI79545785270970",
                "ORDERID": "ORD_HNDMD_1673611200456",
                "PAYMENTMODE": "CC",
                "RESPCODE": "01",
                "RESPMSG": "Txn Success",
                "STATUS": "TXN_SUCCESS",
                "TXNAMOUNT": "50000.00",
                "TXNDATE": "2023-01-14 09:26:58.0",
                "TXNID": "20230114111212800110168264604416980"
            }
        })
            .catch((err) => {
                console.log(err);
            });
    }

    function deleteCartFunction() {
        console.log("deleteCartFunction")
        deleteMethod(`/cart/user/${user._id}`).then(res => {
            updateAFEvent(DEL_CART_PRODUCTS_SUCCESS, "");
            console.log("Cart ===> ", res)
            setOrderConfirm(false)
            setPayVisible(false);
            dispatch(updateCartProductList(user._id));
            dispatch(updateCartList(user._id));
            return setOrderSuccessModal(true);
        }).catch(error => {
            console.log(error)
            return updateAFEvent(DEL_CART_PRODUCTS_FAILURE, { "ERROR_DATA": error });
        })
    }

    function totalCalculator(type) {
        if (type === "subtotal") {
            if (cartProductList.length > 0) {
                let subtotal = 0;
                subtotal = cartProductList.reduce((prev, next) => prev + (Number(next.itemId.price) * Number(next.quantity)), 0);
                return subtotal;
            }
        }
    }

    function renderPaymentMethod() {
        return (
            <View style={[styles.cardContainer, { flexDirection: "column", justifyContent: "center", marginTop: 20 }]}>
                {PAUMENT_METHOD.map((item, index) => {
                    return <View key={index} style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 40, alignItems: "center", justifyContent: "space-between", borderBottomWidth: 2, borderColor: COLOUR.LIGHTGRAY }]}>
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
                {PAUMENT_TYPE.map((item, index) => {
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
                            onPress={() => { setAddress(index); getDeliveryAmount(index) }}
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
                back
                onGoBack={() => props.navigation.goBack()}
                title="Payment" />
            {!loader ? <ScrollView>
                <TitleContainer
                    title="Payment methods" />
                <View>
                    {renderPaymentMethod()}
                    <TitleContainer
                        title="Shipping address" />
                    {renderAddress()}
                    <TitleContainer
                        title="Payment type" />
                    {renderPaymentType()}
                    <TitleContainer
                        title="Order details" />
                    <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", paddingHorizontal: 20, height: 40, alignItems: "center", justifyContent: "space-between", overflow: "hidden" }]}>
                        <Text title={"Total Items"} type="ROBO_REGULAR" lines={1} />
                        <Text title={cartProductList.length} type="ROBO_REGULAR" lines={1} style={{ color: COLOUR.PRIMARY }} />
                    </View>
                    <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", paddingHorizontal: 20, height: 40, alignItems: "center", justifyContent: "space-between", overflow: "hidden" }]}>
                        <Text title={"Total MRP ( Inclusive of all taxes )"} type="ROBO_REGULAR" lines={1} />
                        <Text title={`₹ ` + totalCalculator("subtotal")} type="ROBO_REGULAR" lines={1} style={{ color: COLOUR.PRIMARY }} />
                    </View>
                    <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", paddingHorizontal: 20, height: 40, alignItems: "center", justifyContent: "space-between", overflow: "hidden" }]}>
                        <Text title={"Shipping Charges"} type="ROBO_REGULAR" lines={1} />
                        <Text title={`₹` + deliveryFees} type="ROBO_REGULAR" lines={1} style={{ color: COLOUR.PRIMARY }} />
                    </View>
                    <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", paddingHorizontal: 20, height: 40, alignItems: "center", justifyContent: "space-between", overflow: "hidden" }]}>
                        <Text title={"Payable Amount"} type="ROBOTO_MEDIUM" lines={1} />
                        <Text title={`₹` + (totalCalculator("subtotal") + deliveryFees)} type="ROBO_BOLD" lines={1} style={{ color: COLOUR.ORANGE_DARK }} />
                    </View>
                    <Button
                        onPress={() => validatePayment()}
                        loading={orderBtnLoader}
                        title={`Pay ₹${payType === "full" ? (totalCalculator("subtotal") + deliveryFees) : ((50 / 100) * (totalCalculator("subtotal") + deliveryFees))}`}
                        style={{ alignSelf: "center", margin: 20 }} />
                </View>
            </ScrollView> :
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <Lottie source={require('../../../assets/lottie/loader.json')} autoPlay loop style={{ width: 150, height: 150 }} />
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
            <Modal visible={orderSuccessModal}>
                <View style={styles.successContaier}>
                    <TouchableOpacity onPress={() => {
                        setOrderSuccessModal(false);
                        props.navigation.navigate("CartScreen");
                    }} style={{ position: "absolute", top: 10, right: 10 }}>
                        <Icon name="close" size={35} />
                    </TouchableOpacity>
                    <Lottie source={require('../../../assets/lottie/check.json')} autoPlay duration={10} style={{ width: 200, height: 200 }} />
                    <Text title={"Order Placed!"} type="ROBOTO_MEDIUM" lines={1} style={{ color: COLOUR.PRIMARY, fontSize: 25 }} />
                    <Text title={"Your order was placed successfully. For more details, check my orders page."} type="ROBO_REGULAR" style={{ color: COLOUR.DARK_GRAY, textAlign: "center", width: "80%", marginTop: 10, fontSize: 16 }} />
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
    },
    successContaier: {
        width: "100%",
        height: "100%",
        backgroundColor: COLOUR.WHITE,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center"
    }
})