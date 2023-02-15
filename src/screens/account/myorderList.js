import React, { useEffect, useState } from "react";
import { View, StyleSheet, StatusBar, Dimensions, TouchableOpacity, FlatList, ToastAndroid, Image } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import Text from "../../../component/text";
import moment from "moment";
import Lottie from 'lottie-react-native';
import { useSelector, useDispatch } from 'react-redux';
import {updateOrderList } from "../../redux/action";
import { updateAFEvent } from "../../../utils/appsflyerConfig";
import { MY_ORDERLIST_INIT, GET_ORDERLIST_SUCCESS, GET_ORDERLIST_FAILURE } from "../../../utils/events";
const {width} = Dimensions.get("screen");
export default function MyOrders(props) {
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.reducer.profile);
    const orderList = useSelector(state => state.reducer.orderList);
    const dispatch = useDispatch();

    useEffect(() => {
        updateAFEvent(MY_ORDERLIST_INIT, "");
        getOrderList();
    }, [])

    function getOrderList() {
        dispatch(updateOrderList(user._id)).then(res => {
            setLoading(false);
            updateAFEvent(GET_ORDERLIST_SUCCESS, "");
        }).catch(error => {
            ToastAndroid.show(error, ToastAndroid.BOTTOM, ToastAndroid.CENTER);
            updateAFEvent(GET_ORDERLIST_FAILURE, {"ERROR_DATA": error});
        })
    }

    function renderOrderList(item) {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate("MyOrdersDetails", { data: item._id })} style={[styles.cardContainer]}>
                <View style={styles.productImage}>
                    <Image source={{uri: item.orderItems[0].product.image[0].image}} style={styles.imageContainer} resizeMode="contain" />
                </View>
                <View style={styles.dataContainer}>
                    <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text title={item.status === "PAYMENT" ? "WAITING FOR PAYMENT" : item.status === "SHIPMENT" ? "ORDER SHIPPED" : item.status} type="ROBOTO_MEDIUM" lines={1} style={{ color: item.status === "PROCESSING" ? COLOUR.CYON : item.status === "INPROCESS" ? COLOUR.YELLOW : item.status === "PAYMENT" ? COLOUR.DARK_BLUE : item.status === "SHIPMENT" ? COLOUR.SECONDARY : COLOUR.GRAY }} />
                        <Text title={moment(item.dateOrdered).format("DD MMM YYYY")} type="ROBOTO_MEDIUM" lines={1} style={{ color: COLOUR.PRIMARY }} />
                    </View>
                    <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text title={`${item.orderItems[0].product.name} ${item.orderItems.length > 1 ? " items" : " item"}`} type="ROBOTO_MEDIUM" lines={2} style={{ fontSize: 12, color: COLOUR.BLACK }} />
                    </View>
                    <Text title={`Quantity: ${item.orderItems[0].quantity}`} type="ROBOTO_MEDIUM" lines={1} style={{ fontSize: 12, color: COLOUR.SECONDARY }} />
                </View>
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle={"dark-content"} />
            <Header
                back
                onGoBack={() => props.navigation.goBack()}
                title="My Orders"
            />
            {loading ?
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Lottie source={require('../../../assets/lottie/loader.json')} autoPlay loop style={{ width: 150, height: 150 }} />
                    <Text title={"Loading..."} type="ROBO_BOLD" lines={2} style={[styles.catText, { color: COLOUR.PRIMARY }]} />
                </View> :
                <FlatList
                    data={orderList}
                    renderItem={({ item, index }) => {
                        return renderOrderList(item)
                    }}
                    keyExtractor={item => item._id}
                    ListEmptyComponent={() => {
                        return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                            <Text title={"No orders found."} type="ROBO_REGULAR" lines={1} />
                        </View>
                    }}
                    showsVerticalScrollIndicator={false}
                />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE,
    },
    cardContainer: {
        width: "90%",
        backgroundColor: COLOUR.WHITE,
        borderRadius: 10,
        padding: 10,
        margin: 5,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 0.5,
        borderColor: COLOUR.GRAY
    },
    dataContainer: {
        flex: 1
    },
    dimensionContainer: {
        width: "40%",
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: COLOUR.GRAY,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10
    },
    priceContainer: {
        width: "30%",
        height: "100%",
        alignItems: "flex-end",
        justifyContent: "space-between"
    },
    imageContainer: {
        width: "25%",
        height: "100%",
    },
    productImage: {
        width: width / 4,
        height: width / 4,
        backgroundColor: COLOUR.WHITE,
        marginRight: 5,
        borderRadius: 5,
        elevation: 3
    },
    imageContainer: {
        width: "100%",
        height: "100%"
    }
})