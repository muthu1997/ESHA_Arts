import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, StatusBar, Dimensions, TouchableOpacity, FlatList, Platform } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../../../component/header";
import Text from "../../../component/text";
import { getFunction } from "../../../constants/apirequest";
import TitleContainer from "../../../component/titleContainer";
import Button from "../../../component/button";
import { useSelector, useDispatch } from 'react-redux';
import { updateCategoryList } from "../../redux/action";
import Lottie from 'lottie-react-native';
const { width } = Dimensions.get("screen");

export default function CartScreen(props) {
    const getCategoryListData = useSelector(state => state.reducer.category_list);
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (getCategoryListData.length === 0) {
            setLoader(true);
            getCategoryList();
        }
    })

    const getCategoryList = () => {
        getFunction(`/category/list`, res => {
            console.log(res)
            if (res !== "error") {
                dispatch(updateCategoryList(res.data))
            }
            setLoader(false);
        })
    }

    function renderCategoryCard(item, index) {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate("ProductList", {data: item})} style={styles.cardContainer}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={{ width: "100%", height: "100%" }} resizeMode="stretch" />
                </View>
                <View style={styles.dataContainer}>
                    <Text title={item.name} type="ROBOTO_MEDIUM" lines={1} />
                    <Text title={"15 Photos"} type="ROBOTO_MEDIUM" lines={2} style={{ fontSize: 14, color: COLOUR.PRIMARY }} />
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle={"dark-content"} />
            <Header
                style={{ backgroundColor: "transparent" }}
                singleTitle="Product Categories" />
            <View style={{ flex: 1, alignItems: "center" }}>
                {loader ?
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <Lottie source={require('../../../constants/loader.json')} autoPlay loop style={{ width: 200, height: 200 }} />
                        <Text title={"Loading..."} type="ROBO_BOLD" lines={2} style={[styles.catText, { color: COLOUR.PRIMARY }]} />
                    </View> :
                    <FlatList
                        data={getCategoryListData}
                        numColumns={2}
                        renderItem={({ item, index }) => {
                            return renderCategoryCard(item, index)
                        }}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={item => item._id} />}
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
        width: width / 2.5,
        borderRadius: 5,
        padding: 5,
        margin: 5,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
        backgroundColor: COLOUR.WHITE
    },
    imageContainer: {
        width: "100%",
        height: width / 2.5,
        borderRadius: 5,
        overflow: "hidden"
    },
    dataContainer: {
        width: "100%",
        alignItems:"center",
        justifyContent:"center"
    }
})