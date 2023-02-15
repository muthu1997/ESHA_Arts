import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar, Dimensions, Image, FlatList, TouchableOpacity, LogBox, Touchable } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import TitleContainer from "../../../component/titleContainer";
import Input from "../../../component/inputBox";
import Text from "../../../component/text";
import { getFunction } from "../../../constants/apirequest";
import Lottie from 'lottie-react-native';
const { width } = Dimensions.get("screen");
import { updateAFEvent } from "../../../utils/appsflyerConfig";
import { SEARCH_DATA, SEARCH_FAILURE, SEARCH_INIT } from "../../../utils/events";

export default function SearchScreen(props) {
    const [getSearchList, setSearchList] = useState([]);
    const [getSearchParams, setSearchParams] = useState("");
    const [loader, setLoader] = useState(false);
    const [emptyMessage, setEmptyMessage] = useState("Search by product name");

    useEffect(() => {
        updateAFEvent(SEARCH_INIT, "");
    }, [])

    function startSearching() {
        updateAFEvent(SEARCH_DATA, { "DATA": getSearchParams });
        setLoader(true)
        setSearchList("")
        getFunction(`/product/search/${String(getSearchParams)}`, res => {
            if (res !== "error") {
                setSearchList(res.data);
                if(res.data.length === 0) {
                    setEmptyMessage("No products found!")
                }
            }
            setLoader(false)
        }).catch(error => {
            updateAFEvent(SEARCH_FAILURE, { "ERROR_DATA": error });
        })
    }

    const renderRectProductList = (item) => {
        return (
            <TouchableOpacity
                style={styles.productRectContainer}
                onPress={() => props.navigation.navigate("ProductDetails", { id: item._id })}
                activeOpacity={0.8}>
                <View style={styles.produImage}>
                    <Image source={{ uri: item.image[0].image }} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                </View>
            </TouchableOpacity>
        )
    }

    if (loader) {
        return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Lottie source={require('../../../assets/lottie/loader.json')} autoPlay loop style={{ width: 150, height: 150 }} />
            <Text title={"Loading..."} type="ROBO_REGULAR" lines={2} style={[styles.catText, { color: COLOUR.PRIMARY }]} />
        </View>
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
            <>
                <TitleContainer
                    title="Search Results" />
                <View style={{ flex: 1, alignItems: "center" }}>
                    <FlatList
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        data={getSearchList}
                        renderItem={({ item, index }) => {
                            return renderRectProductList(item)
                        }}
                        ListEmptyComponent={() => {
                            return <View style={styles.initialStyle}>
                                <Text title={emptyMessage} type="ROBO_REGULAR" lines={2} style={{ fontSize: 12, color: COLOUR.DARK_GRAY }} />
                            </View>
                        }}
                        keyExtractor={item => item._id} />
                </View>
            </>
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
        margin: 5
    },
    produImage: {
        width: "100%",
        height: "100%",
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