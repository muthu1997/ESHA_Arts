import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, ToastAndroid, DeviceEventEmitter, ActivityIndicator } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Text from "../../../component/text";
import Button from "../../../component/button";
import Input from "../../../component/inputBox";
import { postMethod, getMethod } from "../../../utils/function";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateProfileData } from "../../redux/action";
import { useDispatch } from 'react-redux';
import * as STRINGS from "../../../constants/strings";
const { width } = Dimensions.get("screen");
import { updateAFEvent } from "../../../utils/appsflyerConfig";
import { RESET_PASSWORD, LOGIN_ERROR, LOGIN_INIT, LOGIN_SUCCESS } from "../../../utils/events";

export default function Login(props) {
    const [mobile, setMobile] = useState("");
    const [ccode, setCCode] = useState("");
    const [password, setPassword] = useState("");
    const [btnLoader, setBtnLoader] = useState(false);
    const [resetLoader, setResetLoader] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        updateAFEvent(LOGIN_INIT, "");
    }, [])

    function loginFunction() {
        if (password != "" && password.length < 8) {
            ToastAndroid.showWithGravity("Password should be atleast 8 characters.", ToastAndroid.SHORT, ToastAndroid.CENTER);
        } else {
            if (mobile != "" && password != "" && password.length > 7) {
                setBtnLoader(true)
                var data = {
                    phone: mobile,
                    password: password,
                    country_code: ccode
                }
                postMethod('/user/login', data).then(res => {
                    updateAFEvent(LOGIN_SUCCESS, "");
                    setMobile("");
                    setPassword("");
                    ToastAndroid.showWithGravity("Logged In.", ToastAndroid.SHORT, ToastAndroid.CENTER);
                    routerFunction(res);
                    setBtnLoader(false)
                }).catch(error => {
                    updateAFEvent(LOGIN_ERROR, { "ERROR_DATA": error });
                    ToastAndroid.showWithGravity("Something went wrong. Please try again.", ToastAndroid.SHORT, ToastAndroid.CENTER);
                    setBtnLoader(false)
                })
            } else {
                ToastAndroid.showWithGravity("Please fill all fields.", ToastAndroid.SHORT, ToastAndroid.CENTER);
            }
        }
    }

    async function routerFunction(data) {
        await AsyncStorage.setItem(STRINGS.UID, data.userId);
        await AsyncStorage.setItem(STRINGS.TOKEN, data.token);
        global.headers = true;
        dispatch(updateProfileData(data.userId)).then(response => {
            props.navigation.goBack();
            DeviceEventEmitter.emit("REFRESH_CART", "yes");
        })
    }

    async function generateOTPFunction() {
        setResetLoader(true);
        getMethod(`/user/generateotp/${mobile}`).then(res => {
            updateAFEvent(RESET_PASSWORD, "");
            global.isForgotPass = true;
            console.log(res)
            props.navigation.navigate("OTPScreen", { data: mobile, id: res.message._id });
            setResetLoader(false);
        }).catch(error => {
            setResetLoader(false);
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <View
                    style={styles.profileImageBtn}>
                    <Image
                        source={require("../../../assets/images/logo.png")}
                        style={styles.profileImage}
                        resizeMode="contain" />
                </View>
                <Button
                    title="Register"
                    onPress={() => props.navigation.navigate("SignupScreen")}
                    style={styles.register} />
            </View>
            <View style={styles.titleContainer}>
                <Text title={"Sign In"} type="ROBOTO_BOLD" lines={2} style={[{ color: COLOUR.BLACK, fontSize: 24 }]} />
                <Text title={"Welcome back!"} type="LOUIS_LIGHT" lines={2} style={[{ color: COLOUR.BLACK, fontSize: 18 }]} />
                <Text title={"Please login to continue"} type="LOUIS_LIGHT" lines={2} style={[{ color: COLOUR.BLACK, fontSize: 18 }]} />
            </View>
            <View style={styles.inputContainer}>
                <Input
                    placeholder="Mobile Number"
                    value={mobile}
                    keyboardType="number-pad"
                    country={true}
                    onBlur={data => setCCode(data)}
                    onChangeText={data => setMobile(data)}
                    style={[styles.inputStyle, { width: "100%" }]} />
                <Input
                    placeholder="Password"
                    value={password}
                    onChangeText={data => setPassword(data)}
                    eye={true}
                    secureTextEntry={true}
                    style={[styles.inputStyle, { width: "100%", marginTop: 15 }]} />
            </View>
            <Button
                title="Log In"
                loading={btnLoader}
                onPress={() => loginFunction()}
                style={styles.login} />
            <View style={styles.forgot}>
                <Text title={"Forgot password ?"} type="ROBO_REGULAR" style={[{ color: COLOUR.BLACK }]} />
                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                    if (mobile.length > 9) {
                        generateOTPFunction();
                    } else {
                        ToastAndroid.showWithGravity("Enter mobile number to continue.", ToastAndroid.SHORT, ToastAndroid.CENTER);
                    }
                }}>
                    {!resetLoader ?
                        <Text title={"Reset now"} type="ROBO_REGULAR" style={[{ color: COLOUR.RED }]} /> :
                        <ActivityIndicator size={"small"} color={COLOUR.PRIMARY} />}
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
        height: "25%",
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
    profileImageBtn: {
        width: 70,
        height: 70,
        borderRadius: 25,
        overflow: "hidden"
    },
    profileImage: {
        width: "100%",
        height: "100%"
    },
    register: {
        width: width / 3,
        height: 35
    },
    inputContainer: {
        width: width,
        height: "30%",
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