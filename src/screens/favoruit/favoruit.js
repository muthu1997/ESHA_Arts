import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, StatusBar, Dimensions, TouchableOpacity, FlatList, DeviceEventEmitter } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../../../component/header";
import Text from "../../../component/text";
import { getFunction, deleteFunction } from "../../../constants/apirequest";
const { width } = Dimensions.get("screen");
import { updateFavProductList, updateFavoruitList } from "../../redux/action";
import { useSelector, useDispatch } from 'react-redux';
import Lottie from 'lottie-react-native';
import {AmplitudeTrack} from "../../../constants/amplitudeConfig";

export default function FavoruitScreen(props) {
    const favList = useSelector(state => state.reducer.favoruit_list);
    const favProductList = useSelector(state => state.reducer.favoruit_product_list);
    const user = useSelector(state => state.reducer.profile);
    const [loader, setLoader] = useState(true);
    const [favLoader, setFavLoader] = useState(false);
    const [currentLoader, setCurrentLoader] = useState("");
    const [loggedOut, setLoggedOut] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            getFavoruitList();
        } else {
            setLoggedOut(true)
        }
    }, [])

    DeviceEventEmitter.addListener("REFRESH_CART", res => {
        if(res === "yes") {
            setTimeout(() => {
                DeviceEventEmitter.emit("REFRESH_CART", "no")
            },1000)
            setLoggedOut(false)
            if (user) {
                getFavoruitList();
            }
        }
        if(res === "logout") {
            setTimeout(() => {
                DeviceEventEmitter.emit("REFRESH_CART", "no")
            },1000)
            setLoggedOut(true)
        }
    })

    function getFavoruitList() {
        getFunction(`/fav/productlist/${user._id}`, res => {
            if (res.success === true) {
                dispatch(updateFavProductList(res.data))
                AmplitudeTrack("FAV_COUNT", {number: res.data?.length})
            }
            setLoader(false);
            setFavLoader(false);
            setCurrentLoader("")
            getFavList();
        })
    }

    function getFavList() {
        getFunction(`/fav/${user._id}`, res => {
            console.log("fav")
            if (res.success === true) {
                dispatch(updateFavoruitList(res.data))
            }
        })
    }

    function deleteFavProduct(productId) {
        setFavLoader(true);
        setCurrentLoader(productId)
        let favFilter = favList.filter(x => x.itemId === productId)
        deleteFunction(`/fav/${favFilter[0]._id}`, res => {
            getFavoruitList();
            AmplitudeTrack("DELETE_FAV", {product: favFilter[0]._id})
        })
    }

    function renderFavoruitCard(item, index) {
        return (
            <View style={styles.cardContainer}>
                <View style={{ width: "100%", height: 20, justifyContent: "center" }}>

                </View>
                <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate("ProductDetails", { data: item })} style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                </TouchableOpacity>
                <View style={styles.dataContainer}>
                    <Text title={item.name} type="ROBOTO_MEDIUM" lines={1} />
                    <View style={{ width: "100%", alignItems: "center", justifyContent: "space-between", flexDirection: "row" }}>
                        <Text title={`₹ ${item.price}`} type="ROBO_BOLD" lines={2} style={{ color: COLOUR.PRIMARY }} />
                        {!favLoader || currentLoader !== item._id ? <TouchableOpacity onPress={() => deleteFavProduct(item._id)} activeOpacity={0.8} style={{ width: 35, height: 35, marginVertical: 5, backgroundColor: COLOUR.WHITE, elevation: 2, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                            <Icon name="heart" size={20} color={COLOUR.RED} />
                        </TouchableOpacity> :
                            <TouchableOpacity activeOpacity={0.8} style={{ width: 35, height: 35, marginVertical: 5, backgroundColor: COLOUR.WHITE, elevation: 2, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                                <Lottie source={require('../../../constants/loader.json')} autoPlay loop style={{ width: 30, height: 30 }} />
                            </TouchableOpacity>}
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle={"dark-content"} />
            <Header
                style={{ backgroundColor: "transparent" }}
                singleTitle="Favoruit Photos" />
            {!loggedOut ?
                <View style={{ flex: 1, alignItems: "center" }}>
                    {loader ?
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                            <Lottie source={require('../../../constants/loader.json')} autoPlay loop style={{ width: 200, height: 200 }} />
                            <Text title={"Loading..."} type="ROBO_BOLD" lines={2} style={[styles.catText, { color: COLOUR.PRIMARY }]} />
                        </View> :
                        <FlatList
                            data={favProductList}
                            numColumns={2}
                            renderItem={({ item, index }) => {
                                return renderFavoruitCard(item.itemId, index)
                            }}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={() => {
                                return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                    <Text title={"No products found in your favoruit list."} type="ROBO_REGULAR" lines={1} />
                                </View>
                            }}
                            keyExtractor={item => item._id} />}
                </View> :
                <View style={styles.logoutContainer}>
                    <Lottie source={require('../../../constants/log_cont.json')} autoPlay loop style={{ width: width / 1.5, height: width / 1.5 }} />
                    <Text title={"Login to see favoruit products."} type="LOUIS_LIGHT" />
                </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cardContainer: {
        width: width / 2.5,
        borderRadius: 10,
        paddingHorizontal: 10,
        margin: 5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLOUR.WHITE,
        elevation: 2
    },
    imageContainer: {
        width: "100%",
        height: width / 2.5,
    },
    dataContainer: {
        width: "100%"
    },
    logoutContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    }
})