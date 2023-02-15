import React, { useState, useRef } from "react";
import { View, StyleSheet, Animated, TouchableWithoutFeedback, Text } from "react-native";
import * as COLORS from "../constants/colors";
const c_width = 175;
const c_height = 40;
export function AnimatedSwitch() {
    const defaultValue = new Animated.Value(0);
    function toggleAnimation() {
        Animated.timing(defaultValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
        }).start()
    }
    const button_animated_style = defaultValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["red", "green"]
    })
    const backgroundStyle = {
        backgroundColor: button_animated_style
    }
    return <TouchableWithoutFeedback onPress={() => toggleAnimation()} style={styles.container}>
        <View style={styles.main_container}>
            {/* <Animated.Text style={{opacity: button_animated_style}}>{JSON.stringify(defaultValue)}</Animated.Text> */}
            <Animated.View style={[styles.button, backgroundStyle]}>
            </Animated.View>
        </View>
    </TouchableWithoutFeedback>
}

const styles = StyleSheet.create({
    container: {
        width: c_width,
        height: c_height
    },
    main_container: {
        width: c_width,
        height: c_height,
        borderRadius: 50,
        backgroundColor: COLORS.LIGHTBG,
        elevation: 2
    },
    button: {
        width: c_height,
        height: c_height,
        borderRadius: c_height / 2,
        position: "absolute",
        backgroundColor: COLORS.PRIMARY,
    }
})