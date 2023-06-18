import React, { useEffect } from "react";
import { SafeAreaView, View, Text } from "react-native";
import SplashScreen from 'react-native-splash-screen'
import { styled } from 'nativewind';
import {useTailwind} from 'tailwind-rn';

const StyledView = styled(View)
const StyledText = styled(Text)
export default function Typography(props) {
    const tailwind = useTailwind();
    useEffect(() => {
        SplashScreen.hide();
    }, [])

    return (
            <StyledView className="flex-1 items-center justify-center bg-white">
                <StyledText style={tailwind('text-blue-800 font-semibold')}>
                    Title
                </StyledText>
                <Text className="mt-12 text-lg text-black dark:text-white">
                    Loream ipsum is a contents
                </Text>
            </StyledView>
    )
}