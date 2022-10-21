import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import * as COLOUR from "../../../constants/colors";
import WebView from "react-native-webview";

export default function TermsandConditions(props) {

    return (
        <View style={styles.container}>
             <WebView source={{
                uri: 'https://sites.google.com/view/easha-chat/home'
            }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE
    }
})