import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import * as COLOUR from "../../../constants/colors";
import { WebView } from 'react-native-webview';
import { updateAFEvent } from "../../../utils/appsflyerConfig";
import { CHAT_INIT } from "../../../utils/events";

export default function ChatScreen(props) {
    useEffect(() => {
        updateAFEvent(CHAT_INIT, "");
    },[])
    return (
        <View style={styles.container}>
            <WebView source={{
                uri: 'https://app.chaport.com/widget/show.html?appid=6347eba60c6d6fc647ff4791'
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