import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { io } from "socket.io-client";
import { GiftedChat } from 'react-native-gifted-chat';
import moment from "moment";
import { useSelector } from 'react-redux';

export default function ChatScreen(props) {
    const [messages, setMessages] = useState([]);
    const customer = props.route.params.customer;
    const socket = useRef(null);
    const user = useSelector(state => state.reducer.profile);
    const userId = "62ebe9823c05919f44021c4c";
    useEffect(() => {
        socket.current = io.connect("http://192.168.0.100:3001");
        socket.current.on(userId, message => {
            return setMessages(previousMessages => GiftedChat.append(previousMessages, message));
        })
    }, [])
    const onSend = useCallback((messages = []) => {
        let msg = messages[0];
        let quotedMessage =  {
                    _id: msg.user._id,
                    text: msg.text,
                    createdAt: msg.createdAt,
                    user: {
                      _id: customer._id,
                      name: customer.name
                    },
                    sent: true,
                    received: true,
                    pending: true,
                  }
        setMessages(previousMessages => GiftedChat.append(previousMessages, quotedMessage))
        socket.current.emit("message", quotedMessage);
    }, [])

    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userId,
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})