import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import * as COLOR from "../constants/colors";

export function CustomButton(props) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.custom_button, props.btnstyle]}
            {...props}
            >
            {props.children}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    custom_button: {
        width: "100%",
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 3,
        backgroundColor: COLOR.PRIMARY
    }
})