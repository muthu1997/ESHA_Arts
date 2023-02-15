import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Dimensions, TouchableOpacity, ToastAndroid, ScrollView, Touchable } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MIcon from "react-native-vector-icons/MaterialIcons";
import Header from "../../../component/header";
import Text from "../../../component/text";
import Button from "../../../component/button";
const { height, width } = Dimensions.get("screen");
import Lottie from 'lottie-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { updateFavoruitList, updateFavProductList, removeFromCart, addToCart } from "../../redux/action";
import { postMethod, deleteMethod } from "../../../utils/function";
import ImageZoom from 'react-native-image-pan-zoom';
import TitleContainer from "../../../component/titleContainer";
import { getMethod } from "../../../utils/function";
import RNSingleSelect, {
    ISingleSelectDataType,
} from "@freakycoder/react-native-single-select";
import Share from 'react-native-share';
import Star from "react-native-star-view";

const starCount = [0, 1, 2, 3, 4];
export default function Corousal(props) {
    const [deleteFav, setDeleteFav] = useState("");
    const [favFilter, setFaveFilter] = useState(props.route.params.data);
    const user = useSelector(state => state.reducer.profile);
    const favList = useSelector(state => state.reducer.favoruit_list);
    const cartList = useSelector(state => state.reducer.cart_list);
    const sizeListData = useSelector(state => state.reducer.image_size);
    const [sizeList, setSizeListData] = useState([]);
    const [favLoader, setFavLoader] = useState(false);
    const [getSizeList, setSizeList] = useState([]);
    const [getCartLoader, setCartLoader] = useState(false);
    const [imagePreview, setImagePreview] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [loader, setLoader] = useState(true);
    const [getParam, setParams] = useState({});
    const [getProductRatings, setProductRatings] = useState([]);
    const [productRatingStatus, setProductRatingStatus] = useState(0);
    const [productRatingCount, setProductRatingCount] = useState(0);
    const [productReviewCount, setProductReviewCount] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        getProductDetails(props.route.params.id);
    }, [])

    const getProductDetails = async (id) => {
        console.log(id)
        return await new Promise.all([getMethod(`/productid/${id}`), getMethod(`/review/${id}`)]).then(res => {
            let response = res[0];
            setParams(response.data[0])
            let getParam = response.data[0];
            let sizeList = sizeListData.filter(x => x.size_type === getParam.imageType);
            setSizeListData(sizeList);
            let favFilter = favList?.filter(x => x.itemId === getParam._id).length
            setFaveFilter(favFilter > 0 ? COLOUR.RED : COLOUR.GRAY);
            if (sizeList.length > 0) {
                let result = new Array();
                sizeList.forEach((element) => {
                    result.push({
                        id: element._id,
                        value: element.size_title,
                        data: {
                            height: element.height,
                            width: element.width,
                            length: element.length,
                            price: element.price
                        }
                    })
                });
                setSizeList(result);
                setSelectedSize(result[0]);
            }
            //product ratings and reviews response handling
            let reviewedStatus = res[1].data;
            if (reviewedStatus.length > 0) {
                setProductRatings(reviewedStatus);
                setProductRatingCount(reviewedStatus.length);
                setProductReviewCount(reviewedStatus.filter(x => x.description !== "").length);
                let fivestar = reviewedStatus.filter(x => x.rating === 5).length;
                let fourstar = reviewedStatus.filter(x => x.rating === 4).length;
                let threestar = reviewedStatus.filter(x => x.rating === 3).length;
                let twostar = reviewedStatus.filter(x => x.rating === 2).length;
                let onestar = reviewedStatus.filter(x => x.rating === 1).length;
                let topCalcuator = (Number(fivestar) * 5) + (Number(fourstar) * 4) + (Number(threestar) * 3) + (Number(twostar) * 2) + (Number(onestar) * 1);
                let bottomCalcuator = Number(fivestar) + Number(fourstar) + Number(threestar) + Number(twostar) + Number(onestar);
                let final_rating = Number(topCalcuator) / Number(bottomCalcuator);
                setProductRatingStatus(final_rating)
            }
            return setTimeout(() => {
                setLoader(false);
            }, 200)
        }).catch(err => {
            console.log(err);
            return setLoader(false);
        })
    }

    async function updateFavoruitProduct(id) {
        setFavLoader(true);
        var data = { itemId: id, userId: user._id }
        console.log(data)
        postMethod('/fav/new', data).then(res => {
            dispatch(updateFavoruitList(user._id)).then(response => {
                console.log(response)
                let favFilter = response.filter(x => x.itemId === getParam._id).length
                setFaveFilter(favFilter > 0 ? COLOUR.RED : COLOUR.GRAY)
                setFavLoader(false);
            })
            dispatch(updateFavProductList(user._id))
        }).catch(error => {
            setFavLoader(false);
        })
    }

    function deleteFavProduct() {
        setFavLoader(true);
        let favFilter = favList.filter(x => x.itemId === getParam._id)
        deleteMethod(`/fav/${favFilter[0]._id}`).then(res => {
            setDeleteFav("Done")
            dispatch(updateFavoruitList(user._id)).then(response => {
                console.log(response)
                let favFilter = response.filter(x => x.itemId === getParam._id).length
                setFaveFilter(favFilter > 0 ? COLOUR.RED : COLOUR.GRAY)
                setFavLoader(false);
            })
            return dispatch(updateFavProductList(user._id))
        }).catch(error => {
            return ToastAndroid.show("Something went wrong. Please try again later.")
        })
    }

    function addCartList() {
        if (user) {
            setCartLoader(true);
            var data = { itemId: getParam._id, userId: user._id, quantity: 1 }
            dispatch(addToCart(data)).then(response => {
                ToastAndroid.show("Item added to cart.", ToastAndroid.CENTER, ToastAndroid.CENTER)
                setTimeout(() => {
                    setCartLoader(false);
                }, 1000)
            }).catch(error => {
                ToastAndroid.show(error, ToastAndroid.CENTER, ToastAndroid.CENTER)
            })
        } else {
            ToastAndroid.show("Please login to add this product to cart list.", ToastAndroid.CENTER, ToastAndroid.CENTER)
        }
    }


    function deleteCartProduct() {
        setCartLoader(true);
        let cartData = cartList.filter(x => x.itemId === getParam._id)
        console.log(cartData[0]._id)
        dispatch(removeFromCart(cartData[0]._id, user._id)).then(response => {
            ToastAndroid.show("Item removed from cart.", ToastAndroid.CENTER, ToastAndroid.CENTER)
            setTimeout(() => {
                setCartLoader(false);
            }, 1000)
        }).catch(error => {
            ToastAndroid.show("Something went wrong. Please try again later.", ToastAndroid.BOTTOM, ToastAndroid.CENTER)
        })
    }

    if (loader) {
        return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Lottie source={require('../../../assets/lottie/loader.json')} autoPlay loop style={{ width: 150, height: 150 }} />
            <Text title={"Loading..."} type="ROBO_BOLD" lines={2} style={[styles.catText, { color: COLOUR.PRIMARY }]} />
        </View>
    }
    if (imagePreview) {
        return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ImageZoom
                cropWidth={Dimensions.get('window').width}
                cropHeight={height - 100}
                imageWidth={width}
                panToMove={true}
                imageHeight={height / 2}>
                <Image source={{ uri: selectedImage }} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
            </ImageZoom>
            <TouchableOpacity onPress={() => { setImagePreview(false); setSelectedImage("") }} activeOpacity={1} style={{ width: 30, height: 30, alignItems: "center", justifyContent: "center", position: "absolute", top: 10, right: 10 }}>
                <Icon name="close" size={25} />
            </TouchableOpacity>
        </View>
    }
    return (
        <View style={styles.container}>
            <Header
                back
                onGoBack={() => props.navigation.goBack()} />
            <ScrollView nestedScrollEnabled>
                <View style={styles.imageContainer}>
                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                        {getParam.image && getParam.image.map((item, index) => {
                            return <TouchableOpacity key={index} onPress={() => { setSelectedImage(item.image); setImagePreview(true) }} activeOpacity={1} style={{ width: width, alignItems: "center", justifyContent: "center" }}>
                                <Image source={{ uri: item.image }} style={styles.imageStyle} resizeMode="contain" />
                                <Text title={`${index + 1} / ${getParam.image.length}`} type="ROBO_REGULAR" lines={2} style={[styles.catText, { color: COLOUR.PRIMARY, position: "absolute", top: 5, left: 5 }]} />
                            </TouchableOpacity>
                        })}
                    </ScrollView>

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
                            <Lottie source={require('../../../constants/btnloader.json')} autoPlay loop style={{ width: 30, height: 30 }} />
                        </TouchableOpacity>}
                </View>
                <View style={{ flex: 1, paddingHorizontal: 20 }}>
                    <Text title={getParam.name} type="LOUIS_LIGHT" style={[styles.catText, { color: COLOUR.BLACK, fontSize: 20 }]} />
                    {getProductRatings.length > 0 ? <View style={styles.starContainer}>
                        {
                            starCount.map(item => {
                                return <Icon key={item} name={item === 4 ? "star-half-full" : "star"} color={COLOUR.PRIMARY} size={15} />
                            })
                        }
                        <Text title={getProductRatings.length} type="ROBO_REGULAR" lines={2} style={[styles.catText, { color: COLOUR.BLACK, fontSize: 12 }]} />
                    </View> : null}
                    {getParam.width !== "" ? <View style={styles.dimensionContainer}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <TouchableOpacity style={styles.iconButton} activeOpacity={0.9}>
                                <Icon name="arrow-expand-horizontal" size={20} color={COLOUR.WHITE} />
                            </TouchableOpacity>
                            <View>
                                <Text title={"Width"} type="ROBOTO_MEDIUM" lines={2} style={[styles.catText, { color: COLOUR.BLACK, paddingHorizontal: 10, fontSize: 12 }]} />
                                <Text title={`${getParam?.width} ${getParam?.whType}`} type="ROBOTO_MEDIUM" lines={2} style={[styles.catText, { color: COLOUR.BLACK, paddingHorizontal: 10, fontSize: 14 }]} />
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <TouchableOpacity style={styles.iconButton} activeOpacity={0.9}>
                                <Icon name="arrow-expand-vertical" size={20} color={COLOUR.WHITE} />
                            </TouchableOpacity>
                            <View>
                                <Text title={"Height"} type="ROBOTO_MEDIUM" lines={2} style={[styles.catText, { color: COLOUR.BLACK, paddingHorizontal: 10, fontSize: 12 }]} />
                                <Text title={`${getParam?.height} ${getParam?.whType}`} type="ROBOTO_MEDIUM" lines={2} style={[styles.catText, { color: COLOUR.BLACK, paddingHorizontal: 10, fontSize: 14 }]} />
                            </View>
                        </View>
                    </View> : null}
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", height: 75, marginVertical: 10 }}>
                        <View>
                            <Text title={`Price`} type="ROBOTO_MEDIUM" lines={2} style={[styles.catText, { color: COLOUR.BLACK, fontSize: 12 }]} />
                            <Text title={'₹ ' + getParam?.mrp} type="ROBOTO_MEDIUM" lines={2} style={[styles.catText, { color: COLOUR.GRAY, fontSize: 22, textDecorationLine: 'line-through' }]} />
                        </View>
                        <View>
                            <Text title={``} type="ROBOTO_MEDIUM" lines={2} style={[styles.catText, { color: COLOUR.BLACK, fontSize: 12 }]} />
                            <Text title={'₹ ' + getParam?.price} type="ROBOTO_MEDIUM" lines={2} style={[styles.catText, { color: COLOUR.BLACK, fontSize: 22 }]} />
                        </View>
                        {cartList?.filter(x => x.itemId === getParam._id).length > 0 ?
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
                    <Text title={getParam.description} type="ROBOTO_MEDIUM" style={[styles.catText, { color: COLOUR.DARK_GRAY, marginVertical: 10 }]} />
                    {getParam.specification ?
                        <View style={styles.specificationContainer}>
                            <TitleContainer
                                title={"Specifications"} style={{ paddingHorizontal: 0 }} />
                            <Text title={getParam.specification} type="ROBO_REGULAR" style={[styles.catText, { color: COLOUR.DARK_GRAY, marginVertical: 10 }]} />
                        </View> : null}
                    <View style={styles.sellerContainer}>
                        <TitleContainer
                            small={true}
                            title={"Sold By"}
                            secondaryTitle={getParam.productOwner?.shopName}
                            secStyle={{ color: COLOUR.BLUE }}
                            style={{ paddingHorizontal: 0 }} />
                    </View>
                    {getProductRatings.length > 0 ?
                        <View style={styles.starRatingContainer}>
                            <TitleContainer
                                small={true}
                                title={"Ratings & Reviews"}
                                style={{ paddingHorizontal: 0 }} />
                            <Text title={productRatingStatus > 4 ? "Very Good" : productRatingStatus > 3 ? "Good" : productRatingStatus > 2 ? "Average" : "OK"} type="ROBO_REGULAR" style={[styles.catText, { color: COLOUR.PRIMARY, marginVertical: 5, fontSize: 16 }]} />
                            <Star score={productRatingStatus} />
                            <Text title={`${productRatingCount} ratings and ${productReviewCount} reviews`} type="ROBO_REGULAR" style={[styles.catText, { color: COLOUR.DARK_GRAY, marginVertical: 5, fontSize: 12 }]} />
                        </View> : null}
                    {getProductRatings.length > 0 ?
                        <View style={styles.reviewContainer}>
                            {
                                getProductRatings.filter(x => x.description !== "")?.map(item => {
                                    return <View style={styles.reviewContent} key={item._id}>
                                        <View style={{ flexDirection: "row" }}>
                                            {
                                                item.image?.map((item1, index) => <TouchableOpacity onPress={() => { setSelectedImage(item1.image); setImagePreview(true) }} activeOpacity={1} style={{ marginRight: 5 }} key={index}><Image source={{ uri: item1.image }} resizeMode="contain" style={styles.reviewImage} /></TouchableOpacity>)
                                            }
                                        </View>
                                        <Text title={`${item.description}`} lines={4} type="ROBO_REGULAR" style={[styles.catText, { color: COLOUR.DARK_GRAY, marginVertical: 5, fontSize: 12 }]} />
                                        <Text title={`${item.userId.name}`} type="ROBO_REGULAR" style={[styles.catText, { color: COLOUR.DARK_GRAY, fontSize: 10 }]} />
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <MIcon name="verified" color={COLOUR.GREEN} size={15} />
                                            <Text title={`Verified Purchase`} type="ROBO_REGULAR" style={[styles.catText, { color: COLOUR.GREEN, fontSize: 10 }]} />
                                        </View>
                                    </View>
                                })
                            }
                        </View> : null}
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
        width: 35,
        height: 35,
        borderRadius: 20,
        backgroundColor: COLOUR.WHITE,
        elevation: 3,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 10,
        right: 60
    },
    dimensionContainer: {
        width: "100%",
        height: 75,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    iconButton: {
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: COLOUR.SECONDARY,
        elevation: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    sizeContainer: {
        width: "100%",
    },
    starContainer: {
        width: "100%",
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    specificationContainer: {
        width: "100%",
        borderTopColor: COLOUR.LIGHTGRAY,
        borderTopWidth: 2
    },
    sellerContainer: {
        width: "100%",
        borderTopColor: COLOUR.LIGHTGRAY,
        borderTopWidth: 2
    },
    starRatingContainer: {
        width: "100%",
        borderTopColor: COLOUR.LIGHTGRAY,
        borderTopWidth: 2,
        paddingBottom: 10
    },
    reviewContainer: {
        width: "100%"
    },
    reviewContent: {
        width: "100%",
        paddingVertical: 5,
        borderBottomWidth: 0.5,
        borderColor: COLOUR.GRAY
    },
    reviewImage: {
        width: 60,
        height: 60
    }
})