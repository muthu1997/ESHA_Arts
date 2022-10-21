import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, StatusBar, Dimensions, ToastAndroid, FlatList, KeyboardAvoidingView } from "react-native";
import * as COLOUR from "../../../constants/colors";
import { query } from "../../../constants/icons";
import Header from "../../../component/header";
import Text from "../../../component/text";
import Button from "../../../component/button";
import Input from "../../../component/inputBox";
import { useSelector } from 'react-redux';
import email from "react-native-email";

export default function AddressScreen(props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const user = useSelector(state => state.reducer.profile);

    const sendQuery = () => {
        if (name != "" && description != "") {
            const mails = ["19smkumar97@gmail.com"];
            const descriptiondata = `User Name: ${name},\nPhone: ${user.phone}\nMessage: ${description}.`
            email(mails, {
                subject: "QUERY FROM EASHA CUSTOMER",
                body: descriptiondata,
                checkCanOpen: false
            }).catch(console.error)
        } else {
            ToastAndroid.show("Please fill all fields.", ToastAndroid.CENTER, ToastAndroid.CENTER)
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle={"dark-content"} />
            <Header
                back
                onGoBack={() => props.navigation.goBack()}
                title="Query" />
            <KeyboardAvoidingView style={{ flex: 1, alignItems: "center" }} behavior="padding">
                <Image source={query}
                    resizeMode="contain"
                    style={{ width: "100%", height: "30%" }} />
                <View style={styles.typeContainer}>
                    <Text title={"Write your query and we will response back within 6hours."} type="ROBOTO_MEDIUM" lines={2} style={{ fontSize: 12, color: COLOUR.BLACK }} />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="Name"
                        value={name}
                        onChangeText={data => setName(data)}
                        style={[styles.inputStyle, { width: "100%" }]} />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="Query"
                        value={description}
                        onChangeText={data => setDescription(data)}
                        multiline={true}
                        style={[styles.inputStyle, { width: "100%", height: 50, marginTop: 10 }]} />
                </View>
                <Button
                    title="Send Query"
                    onPress={() => sendQuery()}
                    style={{ marginTop: 30 }} />
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE
    },
    typeContainer: {
        width: "100%",
        height: 60,
        backgroundColor: COLOUR.LIGHTGRAY,
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "row"
    },
    inputContainer: {
        width: "100%",
        height: 60,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: 20
    },
    inputStyle: {
        width: "45%"
    }
})