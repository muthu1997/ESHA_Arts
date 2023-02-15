import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, StatusBar, Dimensions, TouchableOpacity, FlatList, ToastAndroid } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import Text from "../../../component/text";
import { useSelector, useDispatch } from 'react-redux';
import { updateCategoryList, updateMainCategoryList } from "../../redux/action";
import Lottie from 'lottie-react-native';
const { width } = Dimensions.get("screen");
import { updateAFEvent } from "../../../utils/appsflyerConfig";
import MainCategory from "../../../component/mainCategory";
import { GET_CATEGORY_FAILURE, CATEGORY_INIT, GET_CATEGORY_SUCCESS } from "../../../utils/events";

export default function CartScreen(props) {
    const getCategoryListData = useSelector(state => state.reducer.category_list);
    const getMainCategoryListData = useSelector(state => state.reducer.main_category);
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        updateAFEvent(CATEGORY_INIT, "");
        getMainCategoryList();
        if (getCategoryListData.length === 0) {
            setLoader(true);
        }
    },[])

    const getMainCategoryList = () => {
        dispatch(updateMainCategoryList())
        .then(res => {
            getCategoryList(res[0]._id);
            setLoader(false);
        }).catch(error => {
            ToastAndroid.show("Unable to get category list.", ToastAndroid.BOTTOM, ToastAndroid.CENTER)
        })
    }

    const getCategoryList = (id) => {
        setLoader(true);
        dispatch(updateCategoryList(id))
        .then(res => {
            updateAFEvent(GET_CATEGORY_SUCCESS, "");
            setLoader(false);
        }).catch(error => {
            setLoader(false);
            updateAFEvent(GET_CATEGORY_FAILURE, {"ERROR_DATA": error});
            ToastAndroid.show("Unable to get category list.", ToastAndroid.BOTTOM, ToastAndroid.CENTER)
        })
    }

    function renderCategoryCard(item, index) {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate("ProductList", {data: item})} style={styles.cardContainer}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={{ width: "100%", height: "100%" }} resizeMode="stretch" />
                </View>
                <View style={styles.dataContainer}>
                    <Text title={item.name} type="ROBOTO_MEDIUM" lines={3} style={{fontSize: 10, textAlign: "center"}} />
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle={"dark-content"} />
            <Header
                singleTitle="CATEGORIES" />
            <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={styles.mainCategory}>
                    <MainCategory
                    data={getMainCategoryListData}
                    selectedCategory={id => getCategoryList(id)} />
                </View>
                {loader ?
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <Lottie source={require('../../../assets/lottie/loader.json')} autoPlay loop style={{ width: 150, height: 150 }} />
                        <Text title={"Loading..."} type="ROBO_BOLD" lines={2} style={[styles.catText, { color: COLOUR.PRIMARY }]} />
                    </View> :
                <View style={styles.subCategory}>
                    <FlatList
                        data={getCategoryListData}
                        numColumns={3}
                        renderItem={({ item, index }) => {
                            return renderCategoryCard(item, index)
                        }}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={item => item._id} />
                        </View>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE
    },
    cardContainer: {
        width: "33%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLOUR.WHITE,
        marginVertical: 5
    },
    imageContainer: {
        width: width / 7,
        height: width / 7,
        borderRadius: width / 5,
        overflow: "hidden",
        marginVertical: 5
    },
    dataContainer: {
        width: "100%",
        height: 35,
        justifyContent: "center",
        alignItems: "center",
    },
    mainCategory: {
        width: width / 4,
        height: "100%"
    },
    subCategory: {
        width: width / 1.4,
        height: "100%"
    }
})