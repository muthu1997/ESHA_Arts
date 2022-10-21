import React, { useState, useReducer, useEffect } from "react";
import { View, StyleSheet, StatusBar, Dimensions, Image, FlatList, TouchableOpacity, LogBox, Touchable } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import TitleContainer from "../../../component/titleContainer";
import Services from "../../../component/Services";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen'
import moment from "moment";
import Input from "../../../component/inputBox";
import Text from "../../../component/text";
import { Workouts, InterMediateWorkoutPlan } from "../../../constants/seedData";
import { useSelector, useDispatch } from 'react-redux';
import { updateWorkoutPlan, updateWorkoutData } from "../../redux/action";
import { getFunction } from "../../../constants/apirequest";
import firebase from '@react-native-firebase/app';
import Icon from "react-native-vector-icons/FontAwesome";
import { Item } from "react-native-paper/lib/typescript/components/List/List";
import Lottie from 'lottie-react-native';
const { width, height } = Dimensions.get("screen");

export default function SearchScreen(props) {
    const [getSearchList, setSearchList] = useState([]);
    const [getSearchParams, setSearchParams] = useState("");
    const [loader, setLoader] = useState(false);

    function startSearching() {
        setLoader(true)
        setSearchList("")
        getFunction(`/product/search/${String(getSearchParams)}`, res => {
            if (res !== "error") {
                setSearchList(res.data)
            }
            setLoader(false)
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
                        <Text title={"₹ " + item.price} type="ROBO_BOLD" lines={2} style={[styles.catText, { color: COLOUR.PRIMARY }]} />
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
                onGoBack={() => props.navigation.goBack()}
                back
                title="Search your needs"
            />
            <View style={{ width: "100%", paddingHorizontal: 20, alignItems: "center", justifyContent: "center" }}>
                <Input
                    placeholder="Search photos here."
                    onChangeText={data => setSearchParams(data)}
                    value={getSearchParams}
                    returnKeyType="search"
                    keyboardType="default"
                    onSubmitEditing={() => startSearching()}
                    style={[styles.searchButton, { width: props.filter ? "80%" : "100%", backgroundColor: COLOUR.LIGHTGRAY, alignSelf: "center" }]} />
            </View>
            {getSearchList.length > 0 ?
                <>
                    <TitleContainer
                        title="Search Results" />
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <FlatList
                            numColumns={2}
                            showsHorizontalScrollIndicator={false}
                            data={getSearchList}
                            renderItem={({ item, index }) => {
                                return renderRectProductList(item)
                            }}
                            keyExtractor={item => item._id} />
                    </View>
                </> : loader ?
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <Lottie source={require('../../../constants/loader.json')} autoPlay loop style={{ width: 200, height: 200 }} />
                        <Text title={"Loading..."} type="ROBO_REGULAR" lines={2} style={[styles.catText, { color: COLOUR.PRIMARY }]} />
                    </View> :
                    <View style={styles.initialStyle}>
                        <Text title={"Search with god name..."} type="ROBO_REGULAR" lines={2} style={{ fontSize: 12, color: COLOUR.DARK_GRAY }} />
                    </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE
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
        backgroundColor: COLOUR.WHITE
    },
    searchButton: {
        height: 50,
        backgroundColor: COLOUR.WHITE,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "flex-start",
        paddingLeft: 10,
        marginVertical: 10,
        borderRadius: 10
    },
    initialStyle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
})