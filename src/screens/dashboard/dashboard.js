import React, { useState, useReducer, useEffect } from "react";
import { View, StyleSheet, StatusBar, ScrollView, Dimensions, SafeAreaView, FlatList, TouchableOpacity, LogBox, Linking } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import TitleContainer from "../../../component/titleContainer";
import { getFunction, putFunction } from "../../../constants/apirequest";
import FastImage from 'react-native-fast-image'
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen'
import moment from "moment";
import Text from "../../../component/text";
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'react-native-paper';
import Lottie from 'lottie-react-native';
const { width, height } = Dimensions.get("screen");
import analytics from "@react-native-firebase/analytics";
import Button from "../../../component/button";
import {APP_VERSION} from "../../../constants/strings";
import { updateDashCategoryList, updateTopPick, updateFeatured, updateFavoruitList, updateProfileData, updateCartList, updateCartProductList } from "../../redux/action";
import {AmplitudeTrack} from "../../../constants/amplitudeConfig";

export default function DashboardScreen(props) {
    const getCategoryListData = useSelector(state => state.reducer.dash_category_list);
    const getTopPickData = useSelector(state => state.reducer.top_pick);
    const getFeatured = useSelector(state => state.reducer.featured_product);
    const user = useSelector(state => state.reducer.profile);
    const [mascelinous, setMascelinous] = useState({});
    const [versionUpdate, setVersionUpdate] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        AmplitudeTrack("Dashboard Init")
        getLocalDatas();
        getCategoryList();
        getTopPicksList();
        getFeaturedList();
        getMascelinous();
    }, [])


    const storeFCMToken = async () => {
        await AsyncStorage.getItem("TOKE_ADDED").then(res => {
            // if(res !== "YES") {
                let fcmToken = global.fcmtoken;
                var data = {
                    "token": fcmToken
                }
                console.log("toek update")
                putFunction(`/user/update/${user._id}`, data, async(res) => {
                    if (res.success === true) {
                        console.log(res)
                        await AsyncStorage.setItem("TOKE_ADDED", "YES");
                    }
                })
            // }
        });
    }

    const getLocalDatas = async () => {
        await AsyncStorage.getItem("USER_ID").then(res => {
            if (res) {
                getFavList(res);
                getUserData(res);
                getCartList(res);
                getCartProductList(res);
                storeFCMToken();
            }
        });
    }

    const getCategoryList = () => {
        getFunction('/categoryname/dashlist', res => {
            if (res !== "error") {
                dispatch(updateDashCategoryList(res.data));
            }
        })
    }

    const getTopPicksList = () => {
        getFunction('/products/gettoppick', res => {
            console.log("getTopPicksList")
            if (res !== "error") {
                dispatch(updateTopPick(res.data))
            }
        })
    }

    const getFeaturedList = () => {
        getFunction('/products/gettoppick', res => {
            console.log("getFeaturedList")
            if (res !== "error") {
                dispatch(updateFeatured(res.data))
                SplashScreen.hide();
            }
        })
    }

    function getFavList(_id) {
        getFunction(`/fav/${_id}`, res => {
            console.log("getFavList")
            if (res.success === true) {
                dispatch(updateFavoruitList(res.data))
            }
        })
    }

    const getUserData = (_id) => {
        getFunction(`/user/${_id}`, res => {
            console.log(res)
            if (res !== "error") {
                dispatch(updateProfileData(res.data));
                let usr = res.data;
                AmplitudeTrack("USER_DATA",{
                    name: usr.name,
                    id: _id
                })
            }
        })
    }

    function getCartProductList(_id) {
        getFunction(`/cartproduct/${_id}`, res => {
            console.log("getCartProductList")
            if (res !== "error") {
                dispatch(updateCartProductList(res.data));
            }
        })
    }

    const renderCategoryList = (item) => {
        return (
            <TouchableOpacity
                style={styles.caategoryButton}
                onPress={() => props.navigation.navigate("ProductList", { data: item })}
                activeOpacity={0.8}>
                <Text title={"" + item.name} type="ROBOTO_MEDIUM" style={styles.catText} />
            </TouchableOpacity>
        )
    }

    const getCartList = (_id) => {
        getFunction(`/cart/${_id}`, res => {
            if (res !== "error") {
                dispatch(updateCartList(res.data))
            }
        })
    }

    const getMascelinous = (_id) => {
        getFunction(`/user/mascelinous`, res => {
            if (res !== "error") {
                console.log(res)
                let result = res.data;
                setMascelinous(result);
                global.acceptOrder = result.APP_ACCEPT_ORDER;
                if(result.APP_VERSION !== APP_VERSION) {
                    setVersionUpdate(true);
                }
            }
        })
    }

    const renderRectProductList = (item) => {
        return (
            <TouchableOpacity
                style={styles.productRectContainer}
                onPress={() => props.navigation.navigate("ProductDetails", { data: item })}
                activeOpacity={0.8}>
                <View style={styles.produImage}>
                    <FastImage
                        style={{ width: "100%", height: "100%" }}
                        source={{
                            uri: `${item.image}`,
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </View>
                <View style={{ padding: 5, justifyContent: "space-between", flex: 1 }}>
                    <Text title={item.name} type="ROBOTO_MEDIUM" lines={2} style={[styles.catText, { color: COLOUR.BLACK, fontSize: 12 }]} />
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text title={"₹ " + item.price} type="ROBO_BOLD" lines={2} style={[styles.catText, { color: COLOUR.PRIMARY }]} />
                        <Text title={""} type="ROBO_REGULAR" lines={2} style={{ fontSize: 12, color: COLOUR.DARK_GRAY }} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const renderSquareProducts = (item) => {
        return (
            <TouchableOpacity
                style={styles.productFeatureContainer}
                onPress={() => {
                    props.navigation.navigate("ProductDetails", { data: item })
                }}
                activeOpacity={0.8}>
                <View style={styles.produFeatureImage}>
                    <FastImage
                        style={{ width: "100%", height: "100%" }}
                        source={{
                            uri: `${item.image}`,
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </View>
                <View style={{ padding: 5, justifyContent: "space-between", flex: 1 }}>
                    <Text title={item.name} type="ROBOTO_MEDIUM" lines={2} style={[styles.catText, { color: COLOUR.BLACK }]} />
                    <Text title={item.description} type="ROBO_REGULAR" lines={3} style={{ fontSize: 12, color: COLOUR.GRAY }} />
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text title={"₹ " + item.price} type="ROBO_BOLD" lines={2} style={[styles.catText, { color: COLOUR.PRIMARY }]} />
                        <Text title={""} type="ROBO_REGULAR" lines={2} style={{ fontSize: 12, color: COLOUR.DARK_GRAY }} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle={"dark-content"} />
            <Header
                home
                greetingsMessage="Welcome Back!"
                search
                username={user.name ? user.name : ""}
                onSearch={() => props.navigation.navigate("Search")} />
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                <TitleContainer
                    title="Categories" />
                <View style={{ paddingBottom: 20 }}>
                    <FlatList
                        horizontal
                        nestedScrollEnabled
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 20 }}
                        data={getCategoryListData}
                        renderItem={({ item, index }) => {
                            return <View style={{ padding: 1 }}>{renderCategoryList(item)}</View>
                        }}
                        keyExtractor={item => item._id} />
                </View>
                <TitleContainer
                    title="Top Picks" />
                <View style={{ paddingBottom: 20 }}>
                    <FlatList
                        horizontal
                        nestedScrollEnabled
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 20 }}
                        data={getTopPickData}
                        renderItem={({ item, index }) => {
                            return renderRectProductList(item)
                        }}
                        keyExtractor={item => item._id} />
                </View>
                <TitleContainer
                    title="Featured" />
                <View style={{ paddingBottom: 20 }}>
                    <FlatList
                    nestedScrollEnabled
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 20 }}
                        data={getFeatured}
                        renderItem={({ item, index }) => {
                            return renderSquareProducts(item)
                        }}
                        keyExtractor={item => item._id} />
                </View>
            </ScrollView>
            <Modal visible={versionUpdate} >
                <View style={styles.modalContainer}>
                    <Text title={"New Update Available!"} type="ROBO_BOLD" lines={1} style={{ color: COLOUR.PRIMARY }} />
                    <Text title={mascelinous.APP_UP_DESC} type="ROBO_REGULAR" style={{ color: COLOUR.DARK_GRAY, textAlign: "center", width: "80%", marginTop: 10 }} />
                        <Lottie source={require('../../../constants/update.json')} autoPlay loop={false} style={{ width: 200, height: 200 }} />
                        <Button
                        onPress={async() => {await Linking.openURL(mascelinous.APP_LINK)}}
                        title={`Update Now`}
                        style={{ alignSelf: "center", margin: 20 }} />
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE
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
        elevation: 1,
        margin: 5
    },
    produImage: {
        width: "100%",
        height: "60%",
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: COLOUR.WHITE
    },
    productFeatureContainer: {
        width: "90%",
        height: width / 3,
        backgroundColor: COLOUR.WHITE,
        borderRadius: 10,
        elevation: 1,
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
    modalContainer: {
        width: "90%",
        height: "90%",
        backgroundColor: COLOUR.WHITE,
        alignSelf: "center",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    }
})