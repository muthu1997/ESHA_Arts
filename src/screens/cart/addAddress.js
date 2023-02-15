import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, StatusBar, ToastAndroid, KeyboardAvoidingView, ScrollView } from "react-native";
import * as COLOUR from "../../../constants/colors";
import { RadioButton } from "react-native-paper";
import Header from "../../../component/header";
import Text from "../../../component/text";
import Button from "../../../component/button";
import Input from "../../../component/inputBox";
import { useSelector, useDispatch } from 'react-redux';
import { updateAddressList } from "../../redux/action";
import { postMethod, getMethod } from "../../../utils/function";
import { updateAFEvent } from "../../../utils/appsflyerConfig";
import { ADD_ADDRESS_FAILURE, ADD_ADDRESS_GETCITY_FAIURE, ADD_ADDRESS_GETCITY_SUCCESS, ADD_ADDRESS_INIT, ADD_ADDRESS_SUCCESS } from "../../../utils/events";

export default function AddressScreen(props) {
    const user = useSelector(state => state.reducer.profile);
    const [addressType, setAddressType] = useState("");
    const [houseNo, setHouseNo] = useState("");
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [street, setStreet] = useState("");
    const [area, setArea] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [loader, setLoader] = useState(false);
    const [pinValidated, setPinValidated] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        updateAFEvent(ADD_ADDRESS_INIT, "");
    }, [])

    function submitAddress() {
        setLoader(true);
        if (name != "" && mobile != "" && addressType != "" && houseNo != "" && street != "" && area != "" && zip != "" && state != "" && country != "") {
            let data = {
                type: addressType === "h" ? "HOME" : addressType === "o" ? "OFFICE" : "SECONDARY ADDRESS",
                houseNo: Number(houseNo),
                street: street,
                area: area,
                city: city,
                zip: Number(zip),
                state: state,
                country: country,
                userId: user._id,
                name: name,
                mobile: mobile
            }
            postMethod('/address/new', data).then(res => {
                console.log(res)
                setAddressType("");
                setHouseNo("");
                setStreet("");
                setArea("");
                setCity("");
                setZip("");
                setState("");
                setCountry("");
                setLoader(false);
                updateAFEvent(ADD_ADDRESS_SUCCESS, "");
                ToastAndroid.showWithGravity("Address added successfully.", ToastAndroid.SHORT, ToastAndroid.CENTER);
                getAddressList();
            }).catch(error => {
                updateAFEvent(ADD_ADDRESS_FAILURE, { "ERROR_DATA": error });
                ToastAndroid.showWithGravity("Something went wrong. Please try again later.", ToastAndroid.SHORT, ToastAndroid.CENTER);
                setLoader(false);
            })
        } else {
            ToastAndroid.showWithGravity("Please fill all fields!", ToastAndroid.SHORT, ToastAndroid.CENTER);
            setLoader(false);
        }
    }

    function getAddressList() {
        dispatch(updateAddressList(user._id))
    }

    function getCityByPin() {
        getMethod(`/getcitystate/${zip}`).then(response => {
            let result = response.data;
            setCity(result.City);
            setState(result.State);
            setCountry("India");
            setPinValidated(true);
            updateAFEvent(ADD_ADDRESS_GETCITY_SUCCESS, "");
            console.log(response)
        }).catch(error => {
            console.log(error);
            updateAFEvent(ADD_ADDRESS_GETCITY_FAIURE, { "ERROR_DATA": error });
            ToastAndroid.show("Something went wrong while fetching ZIP code data.")
        })
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle={"dark-content"} />
            <Header
                back
                onGoBack={() => props.navigation.goBack()}
                title="New Address" />
            <KeyboardAvoidingView style={{ flex: 1, alignItems: "center" }} behavior="padding">
                <View style={styles.typeContainer}>
                    <View style={[{ flexDirection: "row", overflow: "hidden", height: 60, alignItems: "center" }]}>
                        <RadioButton
                            onPress={() => { setAddressType("h") }}
                            status={addressType === "h" ? "checked" : "unchecked"} />
                        <Text title={"Home"} type="ROBOTO_MEDIUM" lines={1} />
                    </View>
                    <View style={[{ flexDirection: "row", overflow: "hidden", height: 60, alignItems: "center" }]}>
                        <RadioButton
                            onPress={() => { setAddressType("o") }}
                            status={addressType === "o" ? "checked" : "unchecked"} />
                        <Text title={"Office"} type="ROBOTO_MEDIUM" lines={1} />
                    </View>
                    <View style={[{ flexDirection: "row", overflow: "hidden", height: 60, alignItems: "center" }]}>
                        <RadioButton
                            onPress={() => { setAddressType("a") }}
                            status={addressType === "a" ? "checked" : "unchecked"} />
                        <Text title={"Address 2"} type="ROBOTO_MEDIUM" lines={1} />
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="Contact Name"
                        value={name}
                        onChangeText={data => setName(data)}
                        style={[styles.inputStyle, { width: "100%" }]} />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="Mobile Number"
                        value={mobile}
                        onChangeText={data => setMobile(data)}
                        style={[styles.inputStyle, { width: "100%" }]} />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="House no."
                        value={houseNo}
                        onChangeText={data => setHouseNo(data)}
                        style={[styles.inputStyle, { width: "38%" }]} />
                    <Input
                        placeholder="Street"
                        value={street}
                        onChangeText={data => setStreet(data)}
                        style={[styles.inputStyle, { width: "60%" }]} />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="Village / Area"
                        value={area}
                        onChangeText={data => setArea(data)}
                        style={[styles.inputStyle, { width: "100%" }]} />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="City"
                        value={city}
                        editable={false}
                        onChangeText={data => setCity(data)}
                        style={[styles.inputStyle, { width: "58%", backgroundColor: COLOUR.GRAY }]} />
                    <Input
                        placeholder="PIN / ZIP Code"
                        value={zip}
                        onChangeText={data => setZip(data)}
                        onSubmitEditing={() => getCityByPin()}
                        style={[styles.inputStyle, { width: "40%" }]} />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="State"
                        value={state}
                        editable={false}
                        onChangeText={data => setState(data)}
                        style={[styles.inputStyle, { width: "48%", backgroundColor: COLOUR.GRAY }]} />
                    <Input
                        placeholder="Country"
                        value={country}
                        editable={false}
                        onChangeText={data => setCountry(data)}
                        style={[styles.inputStyle, { width: "50%", backgroundColor: COLOUR.GRAY }]} />
                </View>
                <Button
                    onPress={() => pinValidated ? submitAddress() : null}
                    title="Add Address"
                    loading={loader}
                    style={{ marginTop: 30, backgroundColor: pinValidated ? COLOUR.PRIMARY : COLOUR.GRAY }} />
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