/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  View
} from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FIcon from "react-native-vector-icons/Fontisto";
import * as COLOUR from "./constants/colors";
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from "redux-thunk";
import { Provider } from 'react-redux';
import createSocketIoMiddleware from 'redux-socket.io';
import messaging, { firebase } from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";
import { appsflyerSDKInitialise } from './utils/appsflyerConfig';
import io from 'socket.io-client';

import Dashboard from "./src/screens/dashboard/dashboard";
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
import PChatScreen from "./src/screens/chat/chat";
import PChatDummyScreen from "./src/screens/chat/dummy";
//Typographyt screen for referance
import Typography from './src/screens/typographys';
//Tailwind CSS
import { TailwindProvider } from 'tailwind-rn';
import utilities from './tailwind.json';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
export default function App() {
  const [renderNothing, setRenderNothing] = useState(true);
  const rootReducer = combineReducers(
    { reducer: mainReducer }
  );
  const configureStore = () => {
    const socket = io.connect("http://ec2-54-238-131-132.ap-northeast-1.compute.amazonaws.com:3001");
    const socketIoMiddleware = createSocketIoMiddleware(socket, "server/")
    return createStore(rootReducer, applyMiddleware(thunk, socketIoMiddleware));
  }
  useEffect(() => {
    appsflyerSDKInitialise().then(res => {
      if (requestUserPermission()) {
        getFcmToken();
      } else {
        console.log('Not Authorization status:', authStatus);
      }
      setRenderNothing(false);
    }).catch(error => {
      setRenderNothing(false);
      if (requestUserPermission()) {
        getFcmToken();
      } else {
        console.log('Not Authorization status:', authStatus);
      }
    })
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("new notification")
      PushNotification.localNotification({
        title: "remoteMessage.notification.title",
        message: "remoteMessage.notification.body",
        channelId: "fcm_fallback_notification_channel",
      });
    });
    global.messageSentUsers = [];
    return unsubscribe;
  }, [])

  PushNotification.popInitialNotification((notification) => {
    if (notification) {
      console.log("popInitialNotification ", notification);
      global.notification = notification;
    }
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
  const getFcmToken = async () => {
    messaging().getToken().then((fcmToken) => {
      console.log(fcmToken)
      global.fcmtoken = fcmToken;
    });
  }

  function HomeFunction() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Typography" component={Typography} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
        <Stack.Screen name="ProductList" component={ProductList} options={{ headerShown: false }} />
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
        <Stack.Screen name="Camera" component={Camera} options={{ headerShown: false }} />
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
        <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
        <Stack.Screen name="PChatScreen" component={PChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PChatDummyScreen" component={PChatDummyScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }
  function FavoruitFunction() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="FavoruitScreen" component={Favoruit} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
        <Stack.Screen name="Camera" component={Camera} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  if (renderNothing) {
    return <View />
  }

  return (
    <Provider store={configureStore()}>
      <TailwindProvider utilities={utilities}>
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
      </TailwindProvider>
    </Provider>
  );
}