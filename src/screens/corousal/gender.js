import React, {useState, useEffect} from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, Dimensions } from "react-native";
import * as COLOUR from "../../../constants/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Text from "../../../component/text";
import Icon from "react-native-vector-icons/FontAwesome"

export default function Corousal(props) {
    const [gender, setGender] = useState("");
    useEffect(() => {
        getGender();
    },[])
    const getGender = async() => {
        const result = await AsyncStorage.getItem("gender");
        setGender(result);
    }
    const setGenderFunction = async(value) => {
        await AsyncStorage.setItem("gender", value);
        setGender(value);
    }

    renderGender = (title, icon) => {
        return (
            <TouchableOpacity onPress={() => setGenderFunction(title)} style={[styles.genterContainer,{backgroundColor: gender === title ? COLOUR.PRIMARY : COLOUR.WHITE}]}>
            <Icon name={icon} size={40} style={{color: gender === title ? COLOUR.WHITE : COLOUR.GRAY}} />
            <Text title={title} type="title" style={{color: gender === title ? COLOUR.WHITE : COLOUR.GRAY}} />
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.BACKGROUND} barStyle="dark-content" />
            <Text title="Select you gender" type="title" />
            <View style={{flexDirection: "row", marginVertical: 20}}>
            {renderGender("Male", "male")}
            {renderGender("Female", "female")}
            </View>
            {/* <View style={styles.profile}>
            <Image source={technecian} style={styles.mainIcon} resizeMode="contain" />
            </View>
            <Text title="Barani" type="title" />
            <Text title="Gym Coach" type="paragraph" /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: COLOUR.WHITE
    },
    genterContainer: {
        width: Dimensions.get("screen").width / 2.5,
        height: Dimensions.get("screen").width / 2.5,
        backgroundColor: COLOUR.WHITE,
        borderRadius: 10,
        margin: 10,
        alignItems: 'center',
        justifyContent: "center",
        elevation: 4
    }
})