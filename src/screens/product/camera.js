import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, StatusBar, Dimensions, TouchableOpacity, PermissionsAndroid, Platform } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../../../component/header";
import Text from "../../../component/text";
import SplashScreen from 'react-native-splash-screen'

export default function CameraScreen(props) {
    const [permissions, setPermissions] = useState(null);
    const device = devices['back'];
    return (
        <View style={styles.container}>
            {!device || !permissions ?
                <View style={styles.permissionContainer}>
                    <Text title={"Need camera Permission.."} type="ROBO_REGULAR" lines={2} style={{ fontSize: 12, color: COLOUR.DARK_GRAY }} />
                </View> : null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE
    },
    permissionContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})