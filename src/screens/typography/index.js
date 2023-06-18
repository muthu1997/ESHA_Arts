import React, { useEffect } from "react";
import { SafeAreaView, View, Text } from "react-native";
import SplashScreen from 'react-native-splash-screen'

export default function Typography(props) {
    useEffect(() => {
        SplashScreen.hide();
    }, [])

    return (
        <SafeAreaView>
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-2xl red dark:text-white">
                    Title
                </Text>
                <Text className="mt-12 text-lg text-black dark:text-white">
                    Loream ipsum is a content
                </Text>
            </View>
        </SafeAreaView>
    )
}