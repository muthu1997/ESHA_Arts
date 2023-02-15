import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { CustomButton } from "./customButton";
import Text from "./text";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ADD_ICON, REMOVE_ICON, ICON_SIZE } from "../constants/strings";
import * as COLOR from "../constants/colors";

export function CartQtyButton(props) {
    return (
        <View style={styles.container1}>
            {props.loader ? <ActivityIndicator size={"small"} color={COLOR.PRIMARY} /> :
                <View style={styles.container}>
                    <CustomButton onPress={() => props.onRemoveQuantity(props.quantity > 1 ? props.quantity - 1 : 0)} btnstyle={[styles.custom_button]}>
                        <Icon name={REMOVE_ICON} size={ICON_SIZE} color={COLOR.WHITE} />
                    </CustomButton>
                    <Text title={props.quantity} type={"ROBO_REGULAR"} />
                    <CustomButton onPress={() => props.onAddQuantity(props.quantity + 1)} btnstyle={styles.custom_button}>
                        <Icon name={ADD_ICON} size={ICON_SIZE} color={COLOR.WHITE} />
                    </CustomButton>
                </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 35,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row"
    },
    container1: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    custom_button: {
        width: "35%",
        height: "100%"
    }
})