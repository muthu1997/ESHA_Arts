/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import {
  StatusBar
} from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/AntDesign";
import FIcon from "react-native-vector-icons/Feather";
import * as COLOUR from "./constants/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import Settings from "./src/screens/corousal/settings"
import Trainer from "./src/screens/corousal/trainer"
import Developer from "./src/screens/corousal/developer"
import FoodPlan from "./src/screens/corousal/foodplan"
import Gender from "./src/screens/corousal/gender"
import Dashboard from "./src/screens/dashboard/dashboard";
import WorkoutDetail from "./src/screens/dashboard/workoutDetail";
import mainReducer from './src/redux/reducer';;
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
export default function App() {
  const rootReducer = combineReducers(
    { reducer: mainReducer }
  );
  const configureStore = () => {
    return createStore(rootReducer);
  }
  useEffect(() => {
    // setThemeColor();
  }, [])
  const setThemeColor = async () => {
    if (global.theme === undefined) {
      try {
        await AsyncStorage.setItem('theme', "Light");
        global.theme = "Light";
      } catch (e) {
        global.theme = "Light";
        console.log(e)
      }
    } else {
      let theme = await AsyncStorage.getItem('theme');
      global.theme = "Dark";
    }
  }
  function HomeFunction() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
        <Stack.Screen name="WorkoutDetail" component={WorkoutDetail} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }
  function SettingsFunction() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
        <Stack.Screen name="Trainer" component={Trainer} options={{ headerShown: false }} />
        <Stack.Screen name="Developer" component={Developer} options={{ headerShown: false }} />
        <Stack.Screen name="FoodPlan" component={FoodPlan} options={{ headerShown: false }} />
        <Stack.Screen name="Gender" component={Gender} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  return (
    <Provider store = { configureStore() }>
    <NavigationContainer>
      <StatusBar backgroundColor={COLOUR.PRIMARY} />
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeFunction} options={{ headerShown: false, tabBarActiveTintColor: COLOUR.PRIMARY, tabBarInactiveTintColor: COLOUR.GRAY, tabBarIcon: ({ focused }) => { return <Icon name="home" color={focused ? COLOUR.PRIMARY : COLOUR.GRAY} size={30} /> } }} />
        <Tab.Screen name="Setup" component={SettingsFunction} options={{ headerShown: false, tabBarActiveTintColor: COLOUR.PRIMARY, tabBarInactiveTintColor: COLOUR.GRAY, tabBarIcon: ({ focused }) => { return <FIcon name="settings" color={focused ? COLOUR.PRIMARY : COLOUR.GRAY} size={30} /> } }} />
      </Tab.Navigator>
    </NavigationContainer>
    </Provider>
  );
}