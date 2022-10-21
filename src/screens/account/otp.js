import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, ToastAndroid, DeviceEventEmitter } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Text from "../../../component/text";
import Button from "../../../component/button";
import Input from "../../../component/inputBox";
import { postFunction, putFunction } from "../../../constants/apirequest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateProfileData } from "../../redux/action";
import { useDispatch } from 'react-redux';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import Counter from "react-native-counters";
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';
const { width } = Dimensions.get("screen");

export default function OTP(props) {
    const [code, setCode] = useState("");
    const [btnLoader, setBtnLoader] = useState(false);
    const dispatch = useDispatch();
    const [showTimer, setShowTimer] = useState(true);
    const [isStopwatchStart, setIsStopwatchStart] = useState(true);
    const [timerDuration, setTimerDuration] = useState(60000);
    const [resetTimer, setResetTimer] = useState(false);
    const [resetStopwatch, setResetStopwatch] = useState(false);
    const mobile = props.route.params.data;

    function otpVerification() {
        if (code != "") {
            var uid = props.route.params.id;
            setBtnLoader(true)
            putFunction(`/user/otp/${uid}/${code}`, "", res => {
                console.log(res)
                if (res.success === true) {
                    setCode("");
                    setBtnLoader(false)
                    if(global.isFromSignup === true) {
                        global.isFromSignup = undefined;
                        props.navigation.navigate("LoginScreen");
                    } else if(global.isForgotPass === true) {
                        global.isForgotPass = undefined;
                        props.navigation.navigate("ResetScreen", {data: mobile, id: uid});
                    }
                } else {
                    ToastAndroid.showWithGravity("Something went wrong. Please try again.", ToastAndroid.SHORT, ToastAndroid.CENTER);
                    setBtnLoader(false)
                }
            })
        } else {
            ToastAndroid.showWithGravity("Please fill all fields.", ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text title={"Verify your number"} type="ROBOTO_BOLD" lines={2} style={[{ color: COLOUR.BLACK, fontSize: 24 }]} />
                <Text title={"We just sent the otp to"} type="LOUIS_LIGHT" lines={2} style={[{ color: COLOUR.BLACK, fontSize: 18, marginTop: 20 }]} />
                <Text title={"+91 7867926344"} type="LOUIS_LIGHT" lines={2} style={[{ color: COLOUR.BLACK, fontSize: 18 }]} />
            </View>
            <View style={styles.inputContainer}>
                <OTPInputView
                    style={{ width: '80%', height: 200 }}
                    pinCount={4}
                    // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                    onCodeChanged={code => { setCode(code) }}
                    secureTextEntry={true}
                    autoFocusOnLoad
                    codeInputFieldStyle={styles.unfocus}
                    codeInputHighlightStyle={styles.focus}
                    placeholderTextColor={COLOUR.BLACK}
                    onCodeFilled={(code) => {
                        console.log(`Code is ${code}, you are good to go!`)
                    }}
                />
            </View>
            <Button
                title="Submit OTP"
                loading={btnLoader}
                onPress={() => otpVerification()}
                style={styles.login} />
            {/* <View style={styles.forgot}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => console.log("reset password")}>
                    {!showTimer ?
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <Text title={"Not yet received ?"} type="ROBO_REGULAR" style={[{ color: COLOUR.BLACK }]} />
                            <Text title={"Resend OTP"} type="ROBO_REGULAR" style={[{ color: COLOUR.RED }]} />
                        </View> :
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <Text title={"Resend otp in "} type="ROBO_REGULAR" style={[{ color: COLOUR.BLACK }]} />
                            <Timer
                                totalDuration={timerDuration}
                                start={isStopwatchStart}
                                reset={resetStopwatch}
                                options={{}}
                                handleFinish={() => setShowTimer(false)} />
                        </View>}
                </TouchableOpacity>
            </View> */}
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
        width: "100%",
        alignItems: "center"
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