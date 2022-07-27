import * as React from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import Text from "./text";
import * as COLOUR from "../constants/colors";
import FastImage from 'react-native-fast-image';
const {width, height} = Dimensions.get("screen")

const DashboardOrder = props => {
    return (
        <View style={[styles.headerContainer, props.style]}>
           <FlatList
                data={props.data}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    return item.day === "Sunday" ? null : <TouchableOpacity onPress={() => props.onPress(item, index)} activeOpacity={0.8} style={[styles.card, {alignItems:"center"}]}>
                        {item.image.length > 0 ?
                    <FastImage source={{uri: `https://drive.google.com/uc?export=view&id=${props.dashboard ? item.image : item.image[0]}`,priority: FastImage.priority.high}} style={{width: "100%", height: "100%"}} /> 
                    :
                    <Icon name="image" size={50} /> }
                        <View style={styles.catIcon}>
                        <Text type="heading" lines={1} title={props.isDetail ? item.name : item.day} style={styles.catText} />
                        <Text type="label" title={props.isDetail ? `${item.rep} Reps and ${item.set} Sets` : item.workout} style={styles.catText} />
                        </View>
                    </TouchableOpacity>
                }}
                keyExtractor={(item, index) => index} />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    card: {
        width: width / 2.5,
        height: Dimensions.get("screen").height / 5,
        backgroundColor: COLOUR.CARD_BG,
        margin: 5,
        borderRadius: 10,
        justifyContent: "center",
        elevation: 1,
        overflow: "hidden"
    },
    catIcon: {
        width: "100%",
        paddingLeft:10,
        paddingBottom: 5,
        justifyContent: 'center',
        position: "absolute",
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    catText: {
        color: COLOUR.WHITE,
        fontSize: 14
    }
});

export default DashboardOrder;