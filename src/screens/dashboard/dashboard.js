import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar, ScrollView, Dimensions, FlatList, TouchableOpacity, LogBox, Linking, SectionList } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import TitleContainer from "../../../component/titleContainer";
import { putMethod } from "../../../utils/function";
import FastImage from 'react-native-fast-image'
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen'
import Text from "../../../component/text";
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'react-native-paper';
import Lottie from 'lottie-react-native';
import * as STRINGS from "../../../constants/strings";
const { width } = Dimensions.get("screen");
import Button from "../../../component/button";
import { APP_VERSION } from "../../../constants/strings";
import { updateDashCategoryList, updateTopPick, updateFeatured, updateFavoruitList, updateProfileData, updateCartList, updateCartProductList, getImageSize, getMascelinous, updateLandscape, updateAddressList } from "../../redux/action";
import { updateUID } from "../../../utils/appsflyerConfig";
import { APP_UPDATE_EXECUTED, DASHBOARD_INIT, FCM_TOKEN_SAVED, TAP_PRODUCT_LANDSCAPE, TAP_PRODUCT_PORTRAIT, TAP_PRODUCT_SQUARE, ANDROID_DEVICE } from "../../../utils/events";
import { updateAFEvent } from "../../../utils/appsflyerConfig";
import { sendFirebaseNotification } from "../../../utils/function";
import ImageWithResizeMode from "../../../component/imageView";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { AnimatedSwitch } from "../../../component/switch";

export default function DashboardScreen(props) {
    const user = useSelector(state => state.reducer.profile);
    const [dashboardProducts, setDashboardProducts] = useState([]);
    const [imageDimensions, setImageDimensions] = useState([]);
    const [mascelinous, setMascelinous] = useState({});
    const [versionUpdate, setVersionUpdate] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        updateAFEvent(DASHBOARD_INIT, "");
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        getLocalDatas();
        getMainDatas();
        getMascelinousFunction();
        getImageSizeFunction()
    }, [])

    const getMainDatas = async () => {
        console.log("Inside getMainDatas")
        return await new Promise.all([dispatch(updateDashCategoryList()), dispatch(updateTopPick()), dispatch(updateFeatured()), dispatch(updateLandscape()), dispatch(updateFeatured())])
            .then(response => {
                console.log("result")
                let result = [
                    { title: "Categories", data: response[0], type: "BUTTON" },
                    { title: "Top Picks", data: response[1], type: "PORTRAIT" },
                    { title: "Featured", data: response[2], type: "SQUARE" },
                    { title: "More", data: response[3], type: "PORTRAIT" },
                    { title: "For You", data: response[4], type: "SQUARE" }
                ];
                console.log(result)
                setDashboardProducts(result);
                return SplashScreen.hide();
            }).catch(error => {
                console.log(error);
                return SplashScreen.hide();
            })
    }

    const storeFCMToken = async () => {
        await AsyncStorage.getItem(STRINGS.FIREBASE_TOKEN).then(res => {
            if (res !== "YES") {
                let fcmToken = global.fcmtoken;
                var data = {
                    "token": fcmToken
                }
                putMethod(`/user/update/${user._id}`, data).then(async (res) => {
                    updateAFEvent(FCM_TOKEN_SAVED, { "DEVICE": ANDROID_DEVICE });
                    await AsyncStorage.setItem(STRINGS.FIREBASE_TOKEN, "YES");
                })
            }
        });
    }

    const getImageSizeFunction = async () => {
        dispatch(getImageSize());
    }

    const getLocalDatas = async () => {
        setTimeout(() => {
            sendFirebaseNotification("Hello")
        }, 5000)
        setTimeout(async () => {
            if (global.headers = true) {
                await AsyncStorage.getItem(STRINGS.UID).then(res => {
                    if (res) {
                        updateUID(res);
                        getFavList(res);
                        getUserData(res);
                        getCartList(res);
                        getCartProductList(res);
                        storeFCMToken();
                        dispatch(updateAddressList(res));
                    }
                })
            }
        }, 2000)
    }

    function getFavList(_id) {
        dispatch(updateFavoruitList(_id))
    }

    const getUserData = (_id) => {
        dispatch(updateProfileData(_id));
    }

    function getCartProductList(_id) {
        dispatch(updateCartProductList(_id));
    }

    const renderCategoryList = (item) => {
        return (
            <TouchableOpacity
                style={styles.caategoryButton}
                onPress={() => {
                    updateAFEvent(FCM_TOKEN_SAVED, { "DEVICE": ANDROID_DEVICE });
                    props.navigation.navigate("ProductList", { data: item._id })
                }}
                activeOpacity={0.8}>
                <View style={styles.catImage}>
                    <FastImage
                        style={{ width: 40, height: 40 }}
                        source={{
                            uri: item.image,
                            priority: FastImage.priority.high
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </View>
                <Text title={"" + item.name} type="ROBOTO_MEDIUM" style={styles.catText} />
            </TouchableOpacity>
        )
    }

    const getCartList = (_id) => {
        dispatch(updateCartList(_id));
    }

    const getMascelinousFunction = () => {
        dispatch(getMascelinous())
            .then(response => {
                setMascelinous(response);
                global.acceptOrder = response.APP_ACCEPT_ORDER;
                if (response.APP_VERSION !== APP_VERSION) {
                    setVersionUpdate(true);
                }
            }).catch(error => {
                console.log("getMascelinousFunction: ", error)
            })
    }

    const renderRectProductList = (item, index) => {
        return (
            <TouchableOpacity
                style={styles.productRectContainer}
                onPress={() => {
                    updateAFEvent(TAP_PRODUCT_PORTRAIT, { "PRODUCT": item.name });
                    props.navigation.navigate("ProductDetails", { id: item._id })
                }}
                activeOpacity={0.8}>
                <View style={styles.produImage}>
                    <ImageWithResizeMode source={{ uri: item.image[0].image }} />
                </View>
                <View style={{ justifyContent: "center", marginTop: 10 }}>
                    <Text title={`${item.name}`} type="ROBO_BOLD" lines={2} style={[styles.catText, { color: COLOUR.BLACK }]} />
                    <View style={{ flexDirection: "row" }}>
                        <Text title={`₹${item.mrp}`} type="ROBOTO_MEDIUM" lines={1} style={[styles.catText, { color: COLOUR.GRAY, fontSize: 16, textDecorationLine: "line-through" }]} />
                        <Text title={` ₹${item.price}`} type="ROBOTO_MEDIUM" lines={1} style={[styles.catText, { color: COLOUR.BLACK, fontSize: 16 }]} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const renderLandscapeCard = (item) => {
        return (
            <TouchableOpacity
                style={styles.productLandContainer}
                onPress={() => {
                    updateAFEvent(TAP_PRODUCT_LANDSCAPE, { PRODUCT: item.name });
                    props.navigation.navigate("ProductDetails", { id: item._id })
                }}
                activeOpacity={0.8}>
                <View style={[styles.produImage, { alignItems: "center", height: "100%" }]}>
                    <FastImage
                        style={{ width: "95%", height: "100%" }}
                        source={{
                            uri: `${item.image[0].image}`,
                            priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    const renderSquareProducts = (item) => {
        return (
            <TouchableOpacity
                style={[styles.productRectContainer, { margin: 0, borderRadius: 0, marginBottom: 5 }]}
                onPress={() => {
                    updateAFEvent(TAP_PRODUCT_PORTRAIT, { "PRODUCT": item.name });
                    props.navigation.navigate("ProductDetails", { id: item._id })
                }}
                activeOpacity={0.8}>
                <View style={[styles.produImage, { borderRadius: 0 }]}>
                    <ImageWithResizeMode source={{ uri: item.image[0].image }} custom_style={{ width: "100%", height: "100%" }} />
                    {/* <FastImage
                        style={{ width: "100%", height: "100%" }}
                        source={{
                            uri: `${item.image[0].image}`,
                            priority: FastImage.priority.high
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    /> */}
                </View>
                <View style={{ justifyContent: "center", marginTop: 10 }}>
                    <Text title={item.name} type="ROBO_BOLD" lines={2} style={[styles.catText, { color: COLOUR.BLACK }]} />
                    <View style={{ flexDirection: "row" }}>
                        <Text title={`₹${item.mrp}`} type="ROBOTO_MEDIUM" lines={1} style={[styles.catText, { color: COLOUR.GRAY, fontSize: 16, textDecorationLine: "line-through" }]} />
                        <Text title={` ₹${item.price}`} type="ROBOTO_MEDIUM" lines={1} style={[styles.catText, { color: COLOUR.BLACK, fontSize: 16 }]} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    function renderLanscape(data) {
        return <View>
            <FlatList
                horizontal
                nestedScrollEnabled
                bounces
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={data}
                renderItem={({ item, index }) => {
                    return renderLandscapeCard(item)
                }}
                keyExtractor={item => item._id} />
        </View>
    }

    function renderTopPicks(data) {
        return <>
            <View style={{ paddingBottom: 20 }}>
                <FlatList
                    horizontal
                    nestedScrollEnabled
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: 20 }}
                    data={data}
                    renderItem={({ item, index }) => {
                        return renderRectProductList(item, index)
                    }}
                    keyExtractor={item => item._id} />
            </View>
        </>
    }

    function renderCategories(data) {
        return <>
            <View style={{ paddingBottom: 20 }}>
                <FlatList
                    horizontal
                    nestedScrollEnabled
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: 20 }}
                    data={data}
                    renderItem={({ item, index }) => {
                        return <View style={{ padding: 1 }}>{renderCategoryList(item)}</View>
                    }}
                    keyExtractor={(item, index) => index} />
            </View>
        </>
    }

    function renderFeatured(data) {
        return <>
            <View style={{ paddingBottom: 20, alignItems: "center" }}>
                <FlatList
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: 20 }}
                    data={data}
                    numColumns={2}
                    renderItem={({ item, index }) => {
                        return renderSquareProducts(item)
                    }}
                    keyExtractor={item => item._id} />
            </View>
        </>
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle={"dark-content"} />
            <Header
                home
                greetingsMessage="Welcome Back!"
                search
                username={user?.name ? user.name : ""}
                onSearch={() => props.navigation.navigate("Search")} />
            {/* <View style={{ width: "100%", height: 500, alignItems: "center", justifyContent: "center" }}>
                <AnimatedSwitch />
            </View> */}
            <SectionList
                sections={dashboardProducts}
                keyExtractor={(item, index) => item + index}
                renderItem={({ section: { title }, item }) => null}
                renderSectionHeader={({ section }) => (
                    <>
                        {section.title ? <TitleContainer
                            title={section.title} /> : null}
                        {section.type === "BUTTON" ? renderCategories(section.data) : section.type === "PORTRAIT" ? renderTopPicks(section.data) : section.type === "SQUARE" ? renderFeatured(section.data) : null}
                    </>
                )}
            />
            <Modal visible={versionUpdate} >
                <View style={styles.modalContainer}>
                    <Text title={"New Update Available!"} type="ROBO_BOLD" lines={1} style={{ color: COLOUR.PRIMARY }} />
                    <Text title={mascelinous.APP_UP_DESC} type="ROBO_REGULAR" style={{ color: COLOUR.DARK_GRAY, textAlign: "center", width: "80%", marginTop: 10 }} />
                    <Lottie source={require('../../../constants/update.json')} autoPlay loop={false} style={{ width: 200, height: 200 }} />
                    <Button
                        onPress={async () => {
                            updateAFEvent(APP_UPDATE_EXECUTED, { "CURRENT_VERSION": APP_VERSION });
                            await Linking.openURL(mascelinous.APP_LINK)
                        }}
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
        height: 50,
        backgroundColor: COLOUR.WHITE,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
        borderColor: COLOUR.LIGHTGRAY,
        flexDirection: "row"
    },
    catImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 5,
        overflow: "hidden"
    },
    catText: {
        color: COLOUR.DARK_GRAY,
        fontSize: 12
    },
    productRectContainer: {
        width: width / 2,
        backgroundColor: COLOUR.WHITE,
        borderRadius: 10,
        margin: 5
    },
    productLandContainer: {
        width: width - 20,
        height: width / 1.5,
        backgroundColor: COLOUR.WHITE,
        elevation: 1
    },
    produImage: {
        width: width / 2,
        height: width / 2,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: COLOUR.WHITE
    },
    productFeatureContainer: {
        width: width / 2.2,
        backgroundColor: COLOUR.WHITE,
        borderRadius: 10,
        margin: 5,
        borderWidth: 0.5
    },
    produFeatureImage: {
        width: "100%",
        height: width / 2.2,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: COLOUR.WHITE
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