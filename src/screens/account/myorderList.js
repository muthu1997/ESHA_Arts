import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, StatusBar, Dimensions, TouchableOpacity, FlatList, ImageBackground } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../../../component/header";
import Text from "../../../component/text";
import moment from "moment";
const { width } = Dimensions.get("screen");
import Lottie from 'lottie-react-native';
import { useSelector, useDispatch } from 'react-redux';
import {updateOrderList } from "../../redux/action";
import { postFunction, getFunction } from "../../../constants/apirequest";

export default function MyOrders(props) {
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.reducer.profile);
    const orderList = useSelector(state => state.reducer.orderList);
    const dispatch = useDispatch();

    useEffect(() => {
        getOrderList();
    }, [])

    function getOrderList() {
        getFunction(`/order/user/${user._id}`, res => {
            if (res !== "error") {
                console.log(JSON.stringify(res.data))
                dispatch(updateOrderList(res.data));
            }
            setLoading(false);
        })
    }

    function renderOrderList(item) {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate("MyOrdersDetails", { data: item._id })} style={[styles.cardContainer,{borderLeftWidth: 2, borderColor: item.status === "PROCESSING" ? COLOUR.CYON : item.status === "INPROCESS" ? COLOUR.YELLOW : item.status === "PAYMENT" ? COLOUR.DARK_BLUE : item.status === "SHIPMENT" ? COLOUR.SECONDARY : ""}]}>

                <View style={styles.dataContainer}>
                    <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text title={item.status === "PAYMENT" ? "WAITING FOR PAYMENT" : item.status === "SHIPMENT" ? "ORDER SHIPPED" : item.status} type="ROBOTO_MEDIUM" lines={1} style={{ color: item.status === "PROCESSING" ? COLOUR.CYON : item.status === "INPROCESS" ? COLOUR.YELLOW : item.status === "PAYMENT" ? COLOUR.DARK_BLUE : item.status === "SHIPMENT" ? COLOUR.SECONDARY : "" }} />
                        <Text title={moment(item.dateOrdered).format("DD MMM YYYY")} type="ROBOTO_MEDIUM" lines={1} style={{ color: COLOUR.PRIMARY }} />
                    </View>
                    <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text title={item.orderItems.length + ' items'} type="ROBOTO_MEDIUM" lines={2} style={{ fontSize: 14, color: COLOUR.BLACK }} />
                    </View>
                    <Text title={item.orderItems.map(item => { return `${item.product.name}, ` })} type="ROBOTO_MEDIUM" lines={1} style={{ fontSize: 12, color: COLOUR.BLACK }} />
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
                style={{ backgroundColor: "transparent" }}
            />
            {loading ?
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <Lottie source={require('../../../constants/loader.json')} autoPlay loop style={{ width: 200, height: 200 }} />
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
        borderBottomWidth: 1,
        borderColor: COLOUR.GRAY
    },
    dataContainer: {
        width: "100%",
        height: "100%",
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
})