import React, { useState, useReducer, useEffect } from "react";
import { View, StyleSheet, StatusBar, ScrollView, Dimensions, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import TitleContainer from "../../../component/titleContainer";
import Services from "../../../component/Services";
import Text from "../../../component/text";
import Button from "../../../component/button";
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';
import Icon from "react-native-vector-icons/FontAwesome5";
import Swiper from 'react-native-swiper'
import FastImage from 'react-native-fast-image';
const { width, height } = Dimensions.get("screen");

export default function Dashboard(props) {
    const workout = props.route.params.data;
    const workoutdata = props.route.params.workoutdata;
    const [getSelected, setSelected] = useState(workoutdata[0])
    const [getIndex, setIndex] = useState(1)
    const [isCounter, setIsCounter] = useState(false)

    const [isTimerStart, setIsTimerStart] = useState(false);
    const [isStopwatchStart, setIsStopwatchStart] = useState(false);
    const [timerDuration, setTimerDuration] = useState(90000);
    const [resetTimer, setResetTimer] = useState(false);
    const [resetStopwatch, setResetStopwatch] = useState(false);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle="dark-content" />
            <ScrollView>
                <Header
                    back
                    navigation={props.navigation}
                    title={workout.workout}
                />
                <View style={styles.todayContainer}>
                    <View elevation={4} style={styles.workoutContainer}>
                        {isCounter ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                            <Stopwatch
                                laps
                                msecs
                                start={isStopwatchStart}
                                // To start
                                reset={resetStopwatch}
                                // To reset
                                options={options}
                                // Options for the styling
                                getTime={(time) => {
                                    console.log(time);
                                }}
                            />
                            <Button title={!isTimerStart ? 'Start' : 'Stop'} onPress={() => {
                                setIsStopwatchStart(!isStopwatchStart);
                                setResetStopwatch(false);
                            }} />
                            <Button
                                style={{ marginTop: 10 }}
                                title={"Reset"} onPress={() => {
                                    setIsStopwatchStart(false);
                                    setResetStopwatch(true);
                                }} />
                        </View> :
                            <View style={{ width: "100%", height: "100%" }}>
                                <View style={styles.indicatorStyle}>
                                {getSelected.image.length > 0 ? <ActivityIndicator color={COLOUR.PRIMARY} size="large" /> : null }
                                </View>
                                {getSelected.image.length > 0 ?
                                <Swiper style={styles.wrapper} loop={false} dotColor={COLOUR.WHITE} activeDotColor={COLOUR.PRIMARY} showsButtons={true}>
                                    {getSelected.image.map(item =>
                                        <View style={styles.slide}>
                                            <FastImage source={{ uri: `https://drive.google.com/uc?export=view&id=${item}`, priority: FastImage.priority.high }} style={styles.bannerImage} />
                                        </View>
                                    )}
                                </Swiper> : <View style={styles.emptyContainer}>
                            <Icon name={"image"} size={25} />
                            <Text title={`No image found.`} type="title" style={{ fontSize: 20 }} />
                                </View> }
                            </View>
                        }
                        <View style={styles.todayWorkout}>
                            <Text title={`${getIndex} / ${workoutdata.length}`} type="title" style={{ color: COLOUR.WHITE, fontSize: 20 }} />
                        </View>
                        <TouchableOpacity onPress={() => setIsCounter(!isCounter)} style={styles.icon}>
                            <Icon name={!isCounter ? "clock" : "image"} size={25} />
                        </TouchableOpacity>
                    </View>
                </View>
                <TitleContainer
                    title={getSelected.name}
                    secondaryTitle={`${getSelected.rep} Reps and ${getSelected.set} Sets`} />
                <Services
                    isDetail={true}
                    onPress={(data, index) => {
                        setSelected(data)
                        setIndex(index + 1)
                    }}
                    data={workoutdata} />
            </ScrollView>
        </View>
    )
}
const options = {
    container: {
        backgroundColor: '#FFFF',
        padding: 5,
        borderRadius: 5,
        width: 200,
        alignItems: 'center',
        marginBottom: 20
    },
    text: {
        fontSize: 25,
        color: COLOUR.PRIMARY,
        marginLeft: 7,
    },
};
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
    },
    icon: {
        position: "absolute",
        top: 10,
        right: 10,
        width: 30,
        height: 30
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOUR.CARD_BG
    },
    indicatorStyle: {
        position: "absolute",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    emptyContainer: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
})