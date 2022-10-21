import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, ToastAndroid, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Text from "../../../component/text";
import Button from "../../../component/button";
import Input from "../../../component/inputBox";
import { postFunction, getFunction } from "../../../constants/apirequest";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
const { width } = Dimensions.get("screen");

export default function Signup(props) {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [ccode, setCCode] = useState("");
    const [password, setPassword] = useState("");
    const [mail, setMail] = useState("");
    const [btnLoader, setBtnLoader] = useState(false);

    function signupFunction() {
        if (password != "" && password.length < 8) {
            ToastAndroid.showWithGravity("Password should be atleast 8 characters.", ToastAndroid.SHORT, ToastAndroid.CENTER);
        } else {
            if (name != "" && mobile != "" && mail != "" && password != "" && password.length > 7) {
                setBtnLoader(true)
                var data = {
                    name: name,
                    phone: mobile,
                    email: mail,
                    passwordHash: password,
                    country_code: ccode,
                    status: "PENDING"
                }
                postFunction('/user/add', data, res => {
                    if (res.success === true) {
                        setMobile("");
                        setName("");
                        setMail("");
                        setPassword("");
                        setBtnLoader(false)
                        global.isFromSignup = true;
                        props.navigation.navigate("OTPScreen");
                    } else {
                        ToastAndroid.showWithGravity(res.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
                        setBtnLoader(false)
                    }
                })
            } else {
                ToastAndroid.showWithGravity("Please fill all fields.", ToastAndroid.SHORT, ToastAndroid.CENTER);
            }
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => props.navigation.goBack()}
                    style={styles.backButton}>
                    <Icon name="arrow-left" size={30} />
                </TouchableOpacity>
            </View>
            <View style={styles.titleContainer}>
                <Text title={"Sign up"} type="ROBOTO_BOLD" lines={2} style={[{ color: COLOUR.BLACK, fontSize: 24 }]} />
                <Text title={"Welcome!"} type="LOUIS_LIGHT" lines={2} style={[{ color: COLOUR.BLACK, fontSize: 18 }]} />
            </View>
            <View style={styles.inputContainer}>
                <Input
                    placeholder="Full Name"
                    value={name}
                    onChangeText={data => setName(data)}
                    style={[styles.inputStyle, { width: "100%" }]} />
                <Input
                    placeholder="Mobile Number"
                    value={mobile}
                    country={true}
                    onBlur={data => setCCode(data)}
                    onChangeText={data => setMobile(data)}
                    style={[styles.inputStyle, { width: "100%" }]} />
                <Input
                    placeholder="Email Address"
                    value={mail}
                    onChangeText={data => setMail(data)}
                    style={[styles.inputStyle, { width: "100%" }]} />
                <Input
                    placeholder="Password"
                    onChangeText={data => setPassword(data)}
                    eye={true}
                    value={password}
                    secureTextEntry={true}
                    style={[styles.inputStyle, { width: "100%" }]} />
            </View>
            <Button
                title="Sign Up"
                loading={btnLoader}
                onPress={() => signupFunction()}
                style={styles.login} />
            <View style={styles.forgot}>
                <Text title={"Already a member?"} type="ROBO_REGULAR" style={[{ color: COLOUR.BLACK }]} />
                <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate("LoginScreen")}>
                    <Text title={"Sign In"} type="ROBO_REGULAR" style={[{ color: COLOUR.PRIMARY }]} />
                </TouchableOpacity>
            </View>
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
        height: "20%",
        justifyContent: "center",
        padding: 20
    },
    iconContainer: {
        width: width,
        height: 80,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: 20
    },
    backButton: {
        width: 50,
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        borderColor: COLOUR.GRAY,
        overflow: "hidden"
    },
    register: {
        width: width / 3,
        height: 35
    },
    inputContainer: {
        width: width,
        height: "40%",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20
    },
    login: {
        width: width - 40,
        alignSelf: "center"
    },
    forgot: {
        width: width,
        height: 50,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    }
})