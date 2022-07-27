import React from "react";
import { View, StyleSheet, Image, StatusBar, Dimensions, TouchableOpacity, Linking } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../../../component/header";
import Text from "../../../component/text";
import {trainer} from "../../../constants/icons";

export default function Corousal(props) {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.BACKGROUND} barStyle="dark-content" />
            <Header
                title="Trainer"
                navigation={props.navigation}
                back
            />
            <View style={styles.mainContainer}>
                <View elevation={5} style={styles.profile}>
                    <Image source={trainer} style={styles.mainIcon} />
                </View>
                <Text style={{ color: COLOUR.PRIMARY, marginVertical: 10 }} title="Baranidaran Alagappan" type="title" />
                <Text title={`Gym Trainer`} type="paragraph" />
                <View style={styles.nameContainer}>
                <TouchableOpacity onPress={() => Linking.openURL(`tel:+91 9940700537`)} activeOpacity={0.8} style={styles.socialButton}>
                        <Icon name="phone" size={25} color={COLOUR.WHITE} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL('instagram://user?username=dbarani')} activeOpacity={0.8} style={styles.socialButton}>
                        <Icon name="instagram" size={25} color={COLOUR.WHITE} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL('whatsapp://send?phone=+919940700537&text=Hello sir, this is a message from the PHOENIX application customer.')} activeOpacity={0.8} style={styles.socialButton}>
                        <Icon name="whatsapp" size={25} color={COLOUR.WHITE} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE
    },
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
    },
    mainIcon: {
        width: "100%",
        height: "100%"
    },
    buttonStyle: {
        marginTop: "15%"
    },
    profile: {
        width: Dimensions.get("screen").width / 1.2,
        height: Dimensions.get("screen").height / 2.3,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: COLOUR.WHITE,
        borderWidth: 5,
        borderColor: COLOUR.LIGHTBG
    },
    nameContainer: {
        width: "100%",
        height: 100,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLOUR.PRIMARY,
        elevation: 3,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 5
    }
})