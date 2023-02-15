import React, { useState } from 'react';
import { StyleSheet, FlatList, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import Text from "./text";
import * as COLOUR from "../constants/colors";
import { install, repair, service } from "../constants/icons";
const { width, height } = Dimensions.get("screen");

const MainCategory = props => {
    const [getSelected, setSelected] = useState(0);

    function selectFunction(index) {
        setSelected(index)
    }
    return (
        <View style={[styles.headerContainer, props.style]}>
            <FlatList
                data={props.data}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    return <TouchableOpacity 
                    activeOpacity={0.8} 
                    onPress={() => {selectFunction(index);props.selectedCategory(item._id)}} 
                    style={[styles.card, {backgroundColor: getSelected === index ? COLOUR.PRIMARY : COLOUR.CARD_BG }]}>
                        <Text type="ROBO_REGULAR" title={item.name} style={[styles.catText, { color: getSelected === index ? COLOUR.WHITE : COLOUR.PRIMARY }]} />
                    </TouchableOpacity>
                }} />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        width: "100%",
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    backgroundStyle: {
        width: "100%",
        height: "50%",
        backgroundColor: COLOUR.LIGHTBG,
        position: "absolute",
        top: 0,
        borderBottomRightRadius: 100,
        borderBottomLeftRadius: 100
    },
    card: {
        width: "100%",
        height: width / 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 0.5,
        borderColor: COLOUR.DARK_GRAY
    },
    catIcon: {
        width: width / 8.5,
        height: width / 8.5,
        backgroundColor: COLOUR.LIGHTBG,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    catText: {
        marginTop: 10,
    }
});

export default MainCategory;