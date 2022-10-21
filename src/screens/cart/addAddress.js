import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, StatusBar, Dimensions, TouchableOpacity, ToastAndroid, KeyboardAvoidingView } from "react-native";
import * as COLOUR from "../../../constants/colors";
import { RadioButton } from "react-native-paper";
import Header from "../../../component/header";
import Text from "../../../component/text";
import Button from "../../../component/button";
import Input from "../../../component/inputBox";
import { useSelector, useDispatch } from 'react-redux';
import {updateAddressList} from "../../redux/action";
import { getFunction, postFunction } from "../../../constants/apirequest";

export default function AddressScreen(props) {
    const user = useSelector(state => state.reducer.profile);
    const [addressType, setAddressType] = useState("");
    const [houseNo, setHouseNo] = useState("");
    const [street, setStreet] = useState("");
    const [area, setArea] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch();


    function submitAddress() {
        setLoader(true);
        if(addressType != "" && houseNo != "" && street != "" && area != "" && zip != "" && state != "" && country != "") {
        let data = {
            type: addressType === "h" ? "HOME" : addressType === "o" ? "OFFICE" : "SECONDARY ADDRESS",
            houseNo: Number(houseNo),
            street: street,
            area: area,
            city: city,
            zip: Number(zip),
            state: state,
            country: country,
            userId: user._id
        }
        postFunction('/address/new', data, res => {
            console.log(res)
            if (res.success === true) {
                setAddressType("");
                setHouseNo("");
                setStreet("");
                setArea("");
                setCity("");
                setZip("");
                setState("");
                setCountry("");
                setLoader(false);
                ToastAndroid.showWithGravity("Address added successfully.",ToastAndroid.SHORT,ToastAndroid.CENTER);
                getAddressList();
            } else {
                ToastAndroid.showWithGravity("Something went wrong. Please try again later.",ToastAndroid.SHORT,ToastAndroid.CENTER);
                setLoader(false);
            }
        })
    }else {
        ToastAndroid.showWithGravity("Please fill all fields!", ToastAndroid.SHORT, ToastAndroid.CENTER);
        setLoader(false);
    }
    }

    function getAddressList() {
        getFunction(`/address/${user._id}`, res => {
            if (res.success === true) {
                dispatch(updateAddressList(res.data))
            }
        })
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle={"dark-content"} />
            <Header
                back
                onGoBack={() => props.navigation.goBack()}
                title="New Address" />
                <KeyboardAvoidingView style={{ flex: 1, alignItems:"center" }} behavior="padding">
            <Image source={{ uri: "https://img.freepik.com/free-vector/location-based-advertisement-geolocation-software-online-gps-app-navigation-system-geographic-restriction-man-searching-address-with-magnifier_335657-393.jpg?w=1380&t=st=1660968959~exp=1660969559~hmac=bae7202f97674b1fe35d1ad9cee69698b93b1b23947757312e5f8d1e1ce136bb" }}
                resizeMode="contain"
                style={{ width: "100%", height: "30%" }} />
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
                        placeholder="House no."
                        value={houseNo}
                        onChangeText={data => setHouseNo(data)}
                        style={[styles.inputStyle, { width: "30%" }]} />
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
                        onChangeText={data => setCity(data)}
                        style={[styles.inputStyle, { width: "50%" }]} />
                    <Input
                        placeholder="PIN / ZIP Code"
                        value={zip}
                        onChangeText={data => setZip(data)}
                        style={[styles.inputStyle, { width: "40%" }]} />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="State"
                        value={state}
                        onChangeText={data => setState(data)}
                        style={[styles.inputStyle, { width: "45%" }]} />
                    <Input
                        placeholder="Country"
                        value={country}
                        onChangeText={data => setCountry(data)}
                        style={[styles.inputStyle, { width: "45%" }]} />
                </View>
            <Button
            onPress={() => submitAddress()} 
            title="Add Address" 
            loading={loader}
            style={{marginTop: 30}} />
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