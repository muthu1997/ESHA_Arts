import React, {useEffect} from "react";
import { View, StyleSheet, Image, StatusBar, Dimensions, TouchableOpacity, PermissionsAndroid, Platform } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../../../component/header";
import Text from "../../../component/text";
import SplashScreen from 'react-native-splash-screen'
import CameraRoll from "@react-native-community/cameraroll";

export default function Corousal(props) {
   
    return (
        <View style={styles.container}>
           
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE
    },
   
})