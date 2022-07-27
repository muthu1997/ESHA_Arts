import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, Modal, DeviceEventEmitter } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Text from "../../../component/text";
import Button from "../../../component/button";
import Header from "../../../component/header";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/AntDesign";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector, useDispatch } from 'react-redux';
import {updateWorkoutPlan} from "../../redux/action";
export default function Settings(props) {
    const [getModal, setModal] = useState(false);
    const [getLevel, setLevel] = useState(null);
    const [getGoalModal, setGoalModal] = useState(false);
    const [getGoal, setGoal] = useState("");
    const dispatch = useDispatch();
    useEffect(() => {
        getWorkoutLevel();
        getGoalData();
    },[])
    const getWorkoutLevel = async() => {
        let value = await AsyncStorage.getItem("level");
        setLevel(value)
    }
    const getGoalData = async() => {
        let value = await AsyncStorage.getItem("goal");
        setGoal(value)
    }
    const setWorkoutLevel = async(value) => {
        try {
            await AsyncStorage.setItem("level", value);
            setLevel(value);
            dispatch(updateWorkoutPlan(value))
            DeviceEventEmitter.emit("levelUpdate", value)
        }catch(e) {
            console.log(e);
        }
    }
    const setGoalData = async(value) => {
        try {
            await AsyncStorage.setItem("goal", value);
            setGoal(value);
        }catch(e) {
            console.log(e);
        }
    }
    const options = (title, icon) => {
        return (
            <TouchableOpacity activeOpacity={0.8} style={styles.optionsContainer} onPress={() => {
                if(title === "Workout Level") {
                    setModal(true)
                }else if(title === "Trainer") {
                    props.navigation.navigate("Trainer")
                }else if(title === "Developer") {
                    props.navigation.navigate("Developer")
                }else if(title === "Food Diet Plan") {
                    props.navigation.navigate("FoodPlan")
                }else if(title === "Gender") {
                    props.navigation.navigate("Gender")
                }else if(title === "Goal") {
                    setGoalModal(true)
                }
                }}>
                    <View style={{width: 40}}>
                    <MIcon name={icon} size={25} />
                    </View>
                <Text title={title} type="title" style={{ fontSize: 18, fontWeight: "500", color: COLOUR.BLACK, marginLeft: 5 }} />
            </TouchableOpacity>
        )
    }
    const renderWorkoutLevelSelector = () => {
        return (
            <View style={styles.wlevelcontainer}>
                <TouchableOpacity activeOpacity={0.8} style={[styles.optionsContainer,{justifyContent: "space-between"}]} onPress={() => setWorkoutLevel("Beginner")}>
                    <Text title={"Beginner Level"} type="title" style={{ fontSize: 18, fontWeight: "500", color: COLOUR.BLACK }} />
                    {getLevel === "Beginner" ? <Icon name="checkcircle" size={25} color={COLOUR.PRIMARY} /> : null}
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={[styles.optionsContainer,{justifyContent: "space-between"}]} onPress={() => setWorkoutLevel("Intermediate")}>
                    <Text title={"Intermediate Level"} type="title" style={{ fontSize: 18, fontWeight: "500", color: COLOUR.BLACK }} />
                    {getLevel === "Intermediate" ? <Icon name="checkcircle" size={25} color={COLOUR.PRIMARY} /> : null}
                </TouchableOpacity>
                {/* <TouchableOpacity activeOpacity={0.8} style={[styles.optionsContainer,{justifyContent: "space-between"}]} onPress={() => setWorkoutLevel("Advance")}>
                    <Text title={"Advanced Level"} type="title" style={{ fontSize: 18, fontWeight: "500", color: COLOUR.BLACK }} />
                    {getLevel === "Advance" ? <Icon name="checkcircle" size={25} color={COLOUR.PRIMARY} /> : null}
                </TouchableOpacity> */}
                <View style={{flex: 1, alignItems:"center", justifyContent:"center"}}>
                <Button title="Close" onPress={() => setModal(false)} />
                </View>
            </View>
        )
    }
    const renderGoal = () => {
        return (
            <View style={styles.wlevelcontainer}>
                <TouchableOpacity activeOpacity={0.8} style={[styles.optionsContainer,{justifyContent: "space-between"}]} onPress={() => setGoalData("loss")}>
                    <Text title={"Weight Loss"} type="title" style={{ fontSize: 18, fontWeight: "500", color: COLOUR.BLACK }} />
                    {getGoal === "loss" ? <Icon name="checkcircle" size={25} color={COLOUR.PRIMARY} /> : null}
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={[styles.optionsContainer,{justifyContent: "space-between"}]} onPress={() => setGoalData("gain")}>
                    <Text title={"Weight Gain"} type="title" style={{ fontSize: 18, fontWeight: "500", color: COLOUR.BLACK }} />
                    {getGoal === "gain" ? <Icon name="checkcircle" size={25} color={COLOUR.PRIMARY} /> : null}
                </TouchableOpacity>
                <View style={{flex: 1, alignItems:"center", justifyContent:"center"}}>
                <Button title="Close" onPress={() => setGoalModal(false)} />
                </View>
                    <Text title={"Note: Food diet plan will be vary based on the goal.."} type="label" style={{ fontSize: 12, fontWeight: "500", color: COLOUR.PRIMARY, textAlign: "center" }} />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <Header
                name
            />
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle={"dark-content"} />
            {options("Food Diet Plan", "food")}
            {options("Gender", "gender-male-female")}
            {options("Goal", "target")}
            {options("Workout Level", "hydraulic-oil-level")}
            {options("Trainer", "human-male-board")}
            {options("Developer", "human-handsup")}
            <Modal visible={getModal}>
                {renderWorkoutLevelSelector()}
            </Modal>
            <Modal visible={getGoalModal}>
                {renderGoal()}
            </Modal>
                    <Text title={"Version 1.0.0"} type="paragraph" style={{ fontSize: 12, fontWeight: "500", color: COLOUR.PRIMARY, position: "absolute", bottom: 10 }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.BACKGROUND,
        alignItems: "center"
    },
    optionsContainer: {
        width: "80%",
        height: 60,
        borderBottomWidth: 2,
        borderBottomColor: COLOUR.GRAY,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
    },
    wlevelcontainer: {
        flex: 1,
        backgroundColor: COLOUR.WHITE,
        padding: 20
    }
})

