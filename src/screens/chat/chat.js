import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, StyleSheet, ActivityIndicator, ToastAndroid } from "react-native";
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useSelector, useDispatch } from 'react-redux';
import * as STRINGS from "../../../constants/strings";
import { getMethod, postMethod } from "../../../utils/function";
import Header from "../../../component/header";
import { getConversationsByUser, sendMessage, sendNotificationToSeller } from "../../redux/action";
import * as COLOUR from "../../../constants/colors";

export default function ChatScreen(props) {
  const customer = props.route.params.customer;
  const selfUser = useSelector(state => state.reducer.selfUser);
  const conversations = useSelector(state => state.reducer.conversations);
  const toUser = customer._id;
  const [loading, setLoading] = useState(true);
  const localUser = useSelector(state => state.reducer.profile);
  const [getConversationData, setConversationData] = useState([]);
  const messages = conversations[toUser] ? conversations[toUser].messages : [];
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch({ type: "server/join", data: { name: localUser.name, _id: localUser._id } })
    setTimeout(() => {
      getUserChatMessages();
    }, 1500)
  }, [])
  function getUserChatMessages() {
    return dispatch(getConversationsByUser(localUser._id, toUser))
      .then(response => {
        console.log(response)
        if (response.length > 0) {
          setLoading(false);
          return setConversationData(response);
        } else {
          return registerForChat();
        }
      }).catch(error => {
        return console.log(error);
      })
  }
  function registerForChat() {
    let body = {
      from_user: localUser._id,
      to_user: toUser,
      message: [],
      status: "ACTIVE"
    }
    return postMethod(`/chatlist/new`, body).then(response => {
      getUserChatMessages();
    }).catch(error => {
      console.log(url + " = " + JSON.stringify(error))
      ToastAndroid.show("Unable to create user chat environment. Please go back and try again.")
    })
  }
  if (loading) {
    return <View style={styles.loaderContainer}><ActivityIndicator size={"large"} color={COLOUR.PRIMARY} /></View>
  }
  function sendMessage(messages) {
    messages[0].user.name = customer.name
    dispatch({
      type: "private_message",
      data: { message: messages[0], conversationId: toUser, chatId: getConversationData[0]._id }
    });
    dispatch({
      type: "server/private_message",
      data: { message: messages[0], conversationId: toUser, chatId: getConversationData[0]._id }
    });
    let messageSentUsers = global.messageSentUsers;
    if(messageSentUsers.filter(x => x === toUser).length === 0){
      dispatch(sendNotificationToSeller(toUser, "You have new message from your customer. Go to the order list screen to find the message.")).then(res => {
        console.log(res)
      })
      messageSentUsers.push(toUser);
      global.messageSentUsers = messageSentUsers;
    }
  }
  return (
    <View style={styles.container}>
      <Header
        back
        onGoBack={() => props.navigation.goBack()}
        title={"Seller"} />
      <GiftedChat
        renderUsernameOnMessage
        messages={messages}
        onSend={messages => {
          sendMessage(messages)
        }}
        user={{
          _id: selfUser.userId
        }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                left: {
                  backgroundColor: COLOUR.WHITE,
                },
                right: {
                  backgroundColor: COLOUR.PRIMARY,
                },
              }}
            />
          );
        }}
        renderAvatar={null}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
})