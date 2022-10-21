import React, { useState, useReducer, useEffect } from "react";
import { View, StyleSheet, StatusBar, ScrollView, Dimensions, Image, FlatList, TouchableOpacity, LogBox, Touchable } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import Text from "../../../component/text";
import { useSelector, useDispatch } from 'react-redux';
import { updateProdByCat } from "../../redux/action";
import { getFunction } from "../../../constants/apirequest";
const { width, height } = Dimensions.get("screen");
import Lottie from 'lottie-react-native';

export default function DashboardScreen(props) {
    const getCategoryProductListData = useSelector(state => state.reducer.prod_by_cat_list);
    const [loader, setLoader] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(props.route.params.data._id)
        getProductList();
    }, [])

    const getProductList = () => {
        getFunction(`/product/listbycatid/${props.route.params.data._id}`, res => {
            console.log(res)
            if (res !== "error") {
                dispatch(updateProdByCat(res.data))
            }
            setLoader(false);
        })
    }

    const renderRectProductList = (item) => {
        return (
            <TouchableOpacity
                style={styles.productRectContainer}
                onPress={() => props.navigation.navigate("ProductDetails", { data: item })}
                activeOpacity={0.8}>
                <View style={styles.produImage}>
                    <Image source={{ uri: item.image }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                </View>
                <View style={{ padding: 5, justifyContent: "space-between", flex: 1 }}>
                    <Text title={item.name} type="ROBOTO_MEDIUM" lines={2} style={[styles.catText, { color: COLOUR.BLACK }]} />
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text title={"₹ " + item.price} type="ROBO_BOLD" lines={2} style={[styles.catText, { fontSize: 12,color: COLOUR.DARK_GRAY }]} />
                        <Text title={"/ Per Photo"} type="ROBO_REGULAR" lines={2} style={{ fontSize: 12, color: COLOUR.DARK_GRAY }} />
                    </View>
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
                title={props.route.params.data.name} />
            <View style={{ alignItems: "center", flex: 1 }}>
                {loader ?
                <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Lottie source={require('../../../constants/loader.json')} autoPlay loop style={{width: 200, height: 200}} />
                        <Text title={"Loading..."} type="ROBO_BOLD" lines={2} style={[styles.catText, { color: COLOUR.PRIMARY }]} />
            </View> :  
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={getCategoryProductListData}
                    numColumns={2}
                    renderItem={({ item, index }) => {
                        return renderRectProductList(item)
                    }}
                    ListEmptyComponent={() => {
                        return <Text title={"No data found"} type="ROBO_REGULAR" lines={2} style={{ fontSize: 12, color: COLOUR.DARK_GRAY }} />
                    }}
                    keyExtractor={item => item._id} /> }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE,
        justifyContent:"center",
        alignItems:"center"
    },
    caategoryButton: {
        height: 35,
        backgroundColor: COLOUR.WHITE,
        borderRadius: 5,
        borderWidth: 1,
        paddingHorizontal: 10,
        marginHorizontal: 5,
        alignItems: "center",
        justifyContent: "center",
        borderColor: COLOUR.LIGHTGRAY
    },
    catText: {
        color: COLOUR.DARK_GRAY
    },
    productRectContainer: {
        width: width / 2.5,
        height: width / 2,
        backgroundColor: COLOUR.WHITE,
        borderRadius: 10,
        elevation: 5,
        margin: 5
    },
    produImage: {
        width: "100%",
        height: "60%",
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: COLOUR.WHITE,
    },
    productFeatureContainer: {
        width: "90%",
        height: width / 3,
        backgroundColor: COLOUR.WHITE,
        borderRadius: 10,
        elevation: 2,
        margin: 5,
        flexDirection: "row",
        alignItems: "center"
    },
    produFeatureImage: {
        width: "30%",
        height: "80%",
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: COLOUR.WHITE,
        marginLeft: 5
    },
})