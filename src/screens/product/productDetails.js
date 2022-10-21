import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, StatusBar, Dimensions, TouchableOpacity, ToastAndroid, ScrollView } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../../../component/header";
import Text from "../../../component/text";
import Button from "../../../component/button";
const { width, height } = Dimensions.get("screen");
import Lottie from 'lottie-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { updateFavoruitList, updateFavProductList, updateCartList, updateCartProductList } from "../../redux/action";
import { postFunction, getFunction, deleteFunction } from "../../../constants/apirequest";
import ImageZoom from 'react-native-image-pan-zoom';

export default function Corousal(props) {
    const [getParam, setParam] = useState(props.route.params.data);
    const [deleteFav, setDeleteFav] = useState("");
    const [favFilter, setFaveFilter] = useState(props.route.params.data);
    const user = useSelector(state => state.reducer.profile);
    const favList = useSelector(state => state.reducer.favoruit_list);
    const cartList = useSelector(state => state.reducer.cart_list);
    const [favLoader, setFavLoader] = useState(false);
    const [getCartLoader, setCartLoader] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        let favFilter = favList.filter(x => x.itemId === getParam._id).length
        setFaveFilter(favFilter > 0 ? COLOUR.RED : COLOUR.GRAY)
    }, [])

    async function updateFavoruitProduct(id) {
        setFavLoader(true);
        var data = { itemId: id, userId: user._id }
        postFunction('/fav/new', data, res => {
            console.log(res)
            if (res.success === true) {
                getFavList();
                getFavoruitList();
            } else {
                setFavLoader(false);
            }
        })
    }

    function getFavList() {
        getFunction(`/fav/${user._id}`, res => {
            if (res.success === true) {
                dispatch(updateFavoruitList(res.data))
                let favFilter = res.data.filter(x => x.itemId === getParam._id).length
                setFaveFilter(favFilter > 0 ? COLOUR.RED : COLOUR.GRAY)
            }
            setFavLoader(false);
        })
    }

    function getFavoruitList() {
        getFunction(`/fav/productlist/${user._id}`, res => {
            if (res.success === true) {
                dispatch(updateFavProductList(res.data))
            }
        })
    }

    function deleteFavProduct() {
        setFavLoader(true);
        let favFilter = favList.filter(x => x.itemId === getParam._id)
        deleteFunction(`/fav/${favFilter[0]._id}`, res => {
            console.log(res)
            setDeleteFav("Done")
            getFavList();
            getFavoruitList();
        })
    }

    function addCartList() {
        if (user) {
            setCartLoader(true);
            var data = { itemId: getParam._id, userId: user._id, quantity: 1 }
            postFunction('/cart/new', data, res => {
                if (res.success === true) {
                    getCartList();
                    getCartProductList();
                }
            })
        } else {
            ToastAndroid.show("Please login to add this product to cart list.", ToastAndroid.CENTER, ToastAndroid.CENTER)
        }
    }

    function getCartProductList() {
        getFunction(`/cartproduct/${user._id}`, res => {
            if (res !== "error") {
                dispatch(updateCartProductList(res.data));
            }
        })
    }

    const getCartList = () => {
        getFunction(`/cart/${user._id}`, res => {
            if (res !== "error") {
                setCartLoader(false);
                dispatch(updateCartList(res.data))
            }
        })
    }

    function deleteCartProduct() {
        setCartLoader(true);
        let cartData = cartList.filter(x => x.itemId === getParam._id)
        deleteFunction(`/cart/${cartData[0]._id}`, res => {
            if (res.success === true) {
                getCartList();
            }
        })
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.BACKGROUND} barStyle="dark-content" />
            <ScrollView>
                <View style={styles.imageContainer}>
                    {/* <TouchableOpacity style={styles.camButton} onPress={() => hasAndroidPermission()} activeOpacity={0.9}>
                    <Icon name="camera" size={20} />
                </TouchableOpacity> */}
                    <ImageZoom cropWidth={Dimensions.get('window').width}
                        cropHeight={height / 2}
                        imageWidth={height / 3}
                        imageHeight={height / 3}>
                        <Image source={{ uri: getParam.image }} style={styles.imageStyle} resizeMode="contain" />
                    </ImageZoom>
                    {!favLoader ?
                        <TouchableOpacity onPress={() => {
                            console.log("clicked")
                            if (user) {
                                if (favFilter === COLOUR.RED) {
                                    deleteFavProduct();
                                } else {
                                    updateFavoruitProduct(getParam._id)
                                }
                            } else {
                                ToastAndroid.show("Please login to add this product to favoruit list.", ToastAndroid.CENTER, ToastAndroid.CENTER)
                            }
                        }} activeOpacity={0.8} style={{ width: 35, height: 35, backgroundColor: COLOUR.WHITE, elevation: 2, borderRadius: 20, alignItems: "center", justifyContent: "center", position: "absolute", top: 10, right: 10 }}>
                            <Icon name="heart" size={20} color={favFilter} />
                        </TouchableOpacity> :
                        <TouchableOpacity activeOpacity={0.8} style={{ width: 35, height: 35, backgroundColor: COLOUR.WHITE, elevation: 2, borderRadius: 20, alignItems: "center", justifyContent: "center", position: "absolute", top: 10, right: 10 }}>
                            <Lottie source={require('../../../constants/loader.json')} autoPlay loop style={{ width: 30, height: 30 }} />
                        </TouchableOpacity>}
                </View>
                <View style={{ flex: 1, paddingHorizontal: 20 }}>
                    <Text title={getParam.name} type="ROBO_BOLD" lines={2} style={[styles.catText, { color: COLOUR.BLACK }]} />
                    <Text title={getParam.description} type="ROBO_REGULAR" style={[styles.catText, { color: COLOUR.DARK_GRAY, marginVertical: 10 }]} />
                    <View style={styles.dimensionContainer}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <TouchableOpacity style={styles.iconButton} activeOpacity={0.9}>
                                <Icon name="arrow-expand-horizontal" size={20} color={COLOUR.WHITE} />
                            </TouchableOpacity>
                            <View>
                                <Text title={"Width"} type="ROBOTO_MEDIUM" lines={2} style={[styles.catText, { color: COLOUR.BLACK, paddingHorizontal: 10, fontSize: 12 }]} />
                                <Text title={`${getParam.width} ${getParam.type}`} type="ROBOTO_MEDIUM" lines={2} style={[styles.catText, { color: COLOUR.BLACK, paddingHorizontal: 10, fontSize: 14 }]} />
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <TouchableOpacity style={styles.iconButton} activeOpacity={0.9}>
                                <Icon name="arrow-expand-vertical" size={20} color={COLOUR.WHITE} />
                            </TouchableOpacity>
                            <View>
                                <Text title={"Height"} type="ROBOTO_MEDIUM" lines={2} style={[styles.catText, { color: COLOUR.BLACK, paddingHorizontal: 10, fontSize: 12 }]} />
                                <Text title={`${getParam.height} ${getParam.type}`} type="ROBOTO_MEDIUM" lines={2} style={[styles.catText, { color: COLOUR.BLACK, paddingHorizontal: 10, fontSize: 14 }]} />
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <TouchableOpacity style={styles.iconButton} activeOpacity={0.9}>
                                <Icon name="pine-tree" size={20} color={COLOUR.WHITE} />
                            </TouchableOpacity>
                            <View>
                                <Text title={"Frame"} type="ROBOTO_MEDIUM" lines={2} style={[styles.catText, { color: COLOUR.BLACK, paddingHorizontal: 10, fontSize: 12 }]} />
                                <Text title={`Wood`} type="ROBOTO_MEDIUM" lines={2} style={[styles.catText, { color: COLOUR.BLACK, paddingHorizontal: 10, fontSize: 14 }]} />
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", height: 75, marginVertical: 10 }}>
                        <View>
                            <Text title={`Price`} type="ROBOTO_MEDIUM" lines={2} style={[styles.catText, { color: COLOUR.BLACK, fontSize: 12 }]} />
                            <Text title={'₹ ' + getParam.price} type="ROBO_BOLD" lines={2} style={[styles.catText, { color: COLOUR.BLACK, fontSize: 22 }]} />
                        </View>
                        {cartList.filter(x => x.itemId === getParam._id).length > 0 ?
                            <Button
                                title="Remove From Cart"
                                loading={getCartLoader}
                                onPress={() => deleteCartProduct()}
                                style={{ width: "55%", backgroundColor: COLOUR.RED }} /> :
                            <Button
                                title="Add to Cart"
                                loading={getCartLoader}
                                onPress={() => addCartList()}
                                style={{ width: "55%" }} />}
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE
    },
    imageContainer: {
        width: "100%",
        height: height / 2,
        backgroundColor: COLOUR.WHITE,
        alignItems: "center",
        justifyContent: "center"
    },
    imageStyle: {
        width: height / 3,
        height: height / 3
    },
    catText: {
        color: COLOUR.DARK_GRAY
    },
    camButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLOUR.WHITE,
        elevation: 3,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 10,
        right: 10
    },
    dimensionContainer: {
        width: "100%",
        height: 75,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around"
    },
    iconButton: {
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: COLOUR.SECONDARY,
        elevation: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})