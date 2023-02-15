import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, ToastAndroid } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Text from "../../../component/text";
import Button from "../../../component/button";
import Input from "../../../component/inputBox";
import { putMethod } from "../../../utils/function";
const { width } = Dimensions.get("screen");
import { updateAFEvent } from "../../../utils/appsflyerConfig";
import { RESET_INIT, RESET_FAILUER, RESET_SUCCESS } from "../../../utils/events";

export default function ResetScreen(props) {
    const [btnLoader, setBtnLoader] = useState(false);
    const [password, setPassword] = useState("");

    useEffect(() => {
        updateAFEvent(RESET_INIT, "");
    }, [])

    function resetPassword() {
        if (password != "" && password.length < 8) {
            ToastAndroid.showWithGravity("Password should be atleast 8 characters.", ToastAndroid.SHORT, ToastAndroid.CENTER);
        } else {
            if (password != "" && password.length > 7) {
                setBtnLoader(true)
                var data = {
                    passwordHash: password
                }
                let uid = props.route.params.id;
                putMethod(`/user/password/${uid}`, data).then(res => {
                    setPassword("");
                    updateAFEvent(RESET_SUCCESS, "");
                    ToastAndroid.showWithGravity("Password updated successfully.", ToastAndroid.SHORT, ToastAndroid.CENTER);
                    setBtnLoader(false)
                    return props.navigation.navigate("LoginScreen");
                }).then(error => {
                    console.log(error)
                    ToastAndroid.showWithGravity("Something went wrong. Please try again.", ToastAndroid.SHORT, ToastAndroid.CENTER);
                    setBtnLoader(false)
                    return updateAFEvent(RESET_FAILUER, { "ERROR_DATA": error });
                })
            } else {
                return ToastAndroid.showWithGravity("Please fill all fields.", ToastAndroid.SHORT, ToastAndroid.CENTER);
            }
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text title={"Set your password"} type="ROBOTO_BOLD" lines={2} style={[{ color: COLOUR.BLACK, fontSize: 24 }]} />
                <Text title={"Password should be atleast 8 characters\n"} type="LOUIS_LIGHT" lines={2} style={[{ color: COLOUR.BLACK, fontSize: 14, marginTop: 20 }]} />
            </View>
            <View style={styles.inputContainer}>
                <Input
                    placeholder="Password"
                    value={password}
                    onChangeText={data => setPassword(data)}
                    eye={true}
                    secureTextEntry={true}
                    style={[styles.inputStyle, { width: "100%", marginTop: 15 }]} />
            </View>
            <Button
                title="Update Password"
                onPress={() => resetPassword()}
                style={styles.login} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE
    },
    titleContainer: {
        width: "100%",
        height: "25%",
        justifyContent: "center",
        padding: 20,
        alignItems: "center"
    },
    login: {
        width: width - 40,
        alignSelf: "center"
    },
    inputContainer: {
        width: "90%",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 20
    },
    forgot: {
        width: width,
        height: 50,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    unfocus: {
        width: 50,
        height: 50,
        backgroundColor: COLOUR.LIGHTGRAY,
        borderRadius: 25,
        color: COLOUR.PRIMARY
    },
    focus: {
        width: 50,
        height: 50,
        backgroundColor: COLOUR.CYON_LIGHT,
        borderRadius: 25
    }
})