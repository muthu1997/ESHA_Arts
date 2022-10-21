/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import {
  StatusBar,
  Alert
} from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FIcon from "react-native-vector-icons/Fontisto";
import * as COLOUR from "./constants/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import messaging, { firebase } from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";

import Dashboard from "./src/screens/dashboard/dashboard";
import WorkoutDetail from "./src/screens/dashboard/workoutDetail";
import mainReducer from './src/redux/reducer';;
import ProductDetails from './src/screens/product/productDetails';
import ProductList from "./src/screens/product/productList";
import SearchScreen from "./src/screens/dashboard/search";
import Cart from "./src/screens/cart/cartScreen";
import Payment from "./src/screens/cart/payment";
import Camera from "./src/screens/product/camera";
import Category from "./src/screens/category/categoryScreen";
import Favoruit from "./src/screens/favoruit/favoruit";
import Account from "./src/screens/account/account";
import NewAddress from "./src/screens/cart/addAddress";
import MyOrders from "./src/screens/account/myorderList";
import MyOrdersDetails from './src/screens/account/myOrderDetails';
import EditProfile from './src/screens/account/editProfile';
import Query from './src/screens/account/query';
import MyAddressList from './src/screens/account/myAddressList';
import EditAddress from "./src/screens/cart/editAddress";
import TermsandConditions from "./src/screens/account/tandc";
import Login from "./src/screens/account/login";
import OTP from "./src/screens/account/otp";
import Signup from "./src/screens/account/signup";
import Chat from "./src/screens/account/chat";
import Reset from "./src/screens/account/reset";

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
    if (requestUserPermission()) {
      getFcmToken();
    } else {
      console.log('Not Authorization status:', authStatus);
    }
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      PushNotification.localNotification({
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
        channelId: "fcm_fallback_notification_channel",
    });
    });

    return unsubscribe;
  }, [])

  PushNotification.popInitialNotification((notification) => {
    console.log("popInitialNotification ", notification);
    global.notification = notification;
  })

  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    if (remoteMessage) {
      console.log("onNotificationOpenedApp ", remoteMessage);
    }
  })

  messaging().setBackgroundMessageHandler(
    async (remoteMessage) => {
      if (remoteMessage) {
        console.log("setBackgroundMessageHandler ", remoteMessage);
      }
    })

  const requestUserPermission = async () => {
    //On ios,checking permission before sending and receiving messages
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  };
  const getFcmToken = () => {
    // Returns an FCM token for this device
    messaging().getToken().then((fcmToken) => {
      console.log('FCM Token -> ', fcmToken);
      global.fcmtoken = fcmToken;
    });
  }

  function HomeFunction() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
        <Stack.Screen name="ProductList" component={ProductList} options={{ headerShown: false }} />
        <Stack.Screen name="WorkoutDetail" component={WorkoutDetail} options={{ headerShown: false }} />
        <Stack.Screen name="Camera" component={Camera} options={{ headerShown: false }} />
        <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }
  function CartFunction() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="CartScreen" component={Cart} options={{ headerShown: false }} />
        <Stack.Screen name="Payment" component={Payment} options={{ headerShown: false }} />
        <Stack.Screen name="NewAddress" component={NewAddress} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }
  function CategoryFunction() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Category" component={Category} options={{ headerShown: false }} />
        <Stack.Screen name="ProductList" component={ProductList} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }
  function AccountFunction() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="AccountScreen" component={Account} options={{ headerShown: false }} />
        <Stack.Screen name="MyAddressList" component={MyAddressList} options={{ headerShown: false }} />
        <Stack.Screen name="MyOrders" component={MyOrders} options={{ headerShown: false }} />
        <Stack.Screen name="MyOrdersDetails" component={MyOrdersDetails} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
        <Stack.Screen name="Query" component={Query} options={{ headerShown: false }} />
        <Stack.Screen name="NewAddress" component={NewAddress} options={{ headerShown: false }} />
        <Stack.Screen name="EditAddress" component={EditAddress} options={{ headerShown: false }} />
        <Stack.Screen name="Terms" component={TermsandConditions} options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="SignupScreen" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="OTPScreen" component={OTP} options={{ headerShown: false }} />
        <Stack.Screen name="ChatScreen" component={Chat} options={{ headerShown: false }} />
        <Stack.Screen name="ResetScreen" component={Reset} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }
  function FavoruitFunction() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="FavoruitScreen" component={Favoruit} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  return (
    <Provider store={configureStore()}>
      <NavigationContainer>
        <StatusBar backgroundColor={COLOUR.PRIMARY} />
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeFunction} options={{ headerShown: false, tabBarActiveTintColor: COLOUR.PRIMARY, tabBarInactiveTintColor: COLOUR.GRAY, tabBarIcon: ({ focused }) => { return <Icon name="home" color={focused ? COLOUR.PRIMARY : COLOUR.GRAY} size={30} /> } }} />
          <Tab.Screen name="Categories" component={CategoryFunction} options={{ headerShown: false, tabBarActiveTintColor: COLOUR.PRIMARY, tabBarInactiveTintColor: COLOUR.GRAY, tabBarIcon: ({ focused }) => { return <Icon name="format-list-text" color={focused ? COLOUR.PRIMARY : COLOUR.GRAY} size={30} /> } }} />
          <Tab.Screen name="Favoruit" component={FavoruitFunction} options={{ headerShown: false, tabBarActiveTintColor: COLOUR.PRIMARY, tabBarInactiveTintColor: COLOUR.GRAY, tabBarIcon: ({ focused }) => { return <FIcon name="favorite" color={focused ? COLOUR.PRIMARY : COLOUR.GRAY} size={30} /> } }} />
          <Tab.Screen name="Cart" component={CartFunction} options={{ headerShown: false, tabBarActiveTintColor: COLOUR.PRIMARY, tabBarInactiveTintColor: COLOUR.GRAY, tabBarIcon: ({ focused }) => { return <Icon name="cart" color={focused ? COLOUR.PRIMARY : COLOUR.GRAY} size={30} /> } }} />
          <Tab.Screen name="Account" component={AccountFunction} options={{ headerShown: false, tabBarActiveTintColor: COLOUR.PRIMARY, tabBarInactiveTintColor: COLOUR.GRAY, tabBarIcon: ({ focused }) => { return <Icon name="account" color={focused ? COLOUR.PRIMARY : COLOUR.GRAY} size={30} /> } }} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}