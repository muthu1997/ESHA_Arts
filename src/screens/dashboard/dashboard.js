import React, { useState, useReducer, useEffect } from "react";
import { View, StyleSheet, StatusBar, ScrollView, Dimensions, Image, TouchableOpacity, DeviceEventEmitter } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import TitleContainer from "../../../component/titleContainer";
import Services from "../../../component/Services";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen'
import moment from "moment";
import Text from "../../../component/text";
import { Workouts, InterMediateWorkoutPlan } from "../../../constants/seedData";
import { useSelector, useDispatch } from 'react-redux';
import { updateWorkoutPlan, updateWorkoutData } from "../../redux/action";
import { getFunction } from "../../../constants/apirequest";
import analytics from "@react-native-firebase/analytics";
import firebase from '@react-native-firebase/app';
const { width, height } = Dimensions.get("screen");

export default function DashboardScreen(props) {
    const [getLevel, setLevel] = useState(1);
    const all_workout_data = useSelector((store) => store.reducer.workout_data);
    const [todayWorkout, setTodayWorkout] = useState("");
    const [todayWorkoutData, setTodayWorkoutData] = useState("");
    const [weeklyData, setWeeklyData] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        firebaseinitialization();
        getWorkoutLevel();
        getGender();
        setGoalData();
        DeviceEventEmitter.addListener('levelUpdate', () => {
            getWorkoutLevel();
            getGender();
            setGoalData();
        })
    }, [])

    const firebaseinitialization = async() => {
        const credentials = {
            apiKey: "AIzaSyCAiPats3MjPdRJrfwUBC0DzJL-KGxLXRw", 
            authDomain: "gym-coach-92e3d.firebaseapp.com", 
            projectId: "gym-coach-92e3d",
            storageBucket: "gym-coach-92e3d.appspot.com", 
            messagingSenderId: "210348173854",
            databaseURL: 'https://gym-coach-92e3d.firebase.com',
            appId: "1:210348173854:web:1564f1724c5c0bcace1c0f", 
            measurementId: "G-97VJ1XT80P"
          };
          const config = {
            name: 'PHOENIX',
          };
          await firebase.initializeApp(credentials, config).then(res => console.log(res))

        // await analytics().logEvent("getWorkoutData", "initialized")
    } 

    const setGoalData = async (value) => {
        const result = await AsyncStorage.getItem("goal");
        if (!result) {
            await AsyncStorage.setItem("goal", "loss");
        }
    }
    const getGender = async () => {
        const result = await AsyncStorage.getItem("gender");
        if (!result) {
            await AsyncStorage.setItem("gender", "Male");
        }
    }
    const getWorkoutData = async (level) => {
        getFunction(res => {
            if (res !== "error") {
                dispatch(updateWorkoutData(res))
                let workout_data;
                if (level === "Beginner") {
                    workout_data = res.data.bdata
                } else if (level === "Intermediate") {
                    workout_data = res.data.idata
                } else {
                    workout_data = res.data.adata
                }
                let todayWorkout = workout_data.filter(x => x.day === moment().format("dddd"))[0].category;
                let todayWorkoutData = workout_data.filter(x => x.day === moment().format("dddd"))[0];
                setTodayWorkout(todayWorkout)
                setTodayWorkoutData(todayWorkoutData)
                setWeeklyData(workout_data)
            }
            SplashScreen.hide();
        });
        setTimeout(async() => {
            console.log("triggeres")
            await analytics().logEvent("sign_up", "initialized")
        },10000)
    }

    const getWorkoutLevel = async () => {
        let value = await AsyncStorage.getItem("level");
        if (value) {
            dispatch(updateWorkoutPlan(value))
            getWorkoutData(value)
            let result = value === "Beginner" ? 1 : value === "Intermediate" ? 2 : 3;
            setLevel(result)
        } else {
            try {
                await AsyncStorage.setItem("level", "Beginner");
                dispatch(updateWorkoutPlan("Beginner"))
                getWorkoutData("Beginner")
                setLevel(1)
            } catch (e) {
                console.log(e);
            }
        }
    }

    const routerFunction = (data) => {
        if(data.day !== "Sunday") {
        let filteredData
        if(getLevel === 1) {
            filteredData = all_workout_data.workouts.filter(x => x.catid === getLevel)
        }else {
            filteredData = all_workout_data.iworkouts.filter(x => x.catid === getLevel)
        }
        let result = filteredData.filter(x => x.category === data.category)
        props.navigation.navigate("WorkoutDetail", { data: data, workoutdata: result })
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle={"dark-content"} />
            <ScrollView>
                <Header
                    name
                />
                <TouchableOpacity activeOpacity={0.9}
                    onPress={() => routerFunction(todayWorkoutData)} style={styles.todayContainer}>
                    <View elevation={4} style={styles.workoutContainer}>
                        <Image style={styles.bannerImage} source={{ uri: `https://drive.google.com/uc?export=view&id=${todayWorkoutData.image}` }} />
                        <View style={styles.todayWorkout}>
                            <Text title={moment().format("dddd")} type="title" style={{ color: COLOUR.WHITE, fontSize: 30 }} />
                            <Text title={todayWorkout} type="title" style={{ color: COLOUR.WHITE, fontSize: 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
                <TitleContainer
                    title="Weekly Schedule" />
                <Services
                dashboard={true}
                    onPress={(data) => routerFunction(data)}
                    data={weeklyData} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.BACKGROUND
    },
    todayContainer: {
        width: width,
        height: height / 2,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center"
    },
    workoutContainer: {
        width: "95%",
        height: "95%",
        backgroundColor: COLOUR.WHITE,
        borderRadius: 20,
        overflow: "hidden"
    },
    bannerImage: {
        width: "100%",
        height: "100%"
    },
    todayWorkout: {
        width: "100%",
        padding: 10,
        position: "absolute",
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)"
    }
})