import { API } from "../utils/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as STRINGS from "../constants/strings";

const header = {
    "ACCEPT": "application/json",
    "Content-Type": "application/json"
}
export const getFunction = async (url, callback) => {
    if(global.isloggedin) {
        header.Authorization = `Bearer ${await AsyncStorage.getItem(STRINGS.TOKEN)}`
    }
    console.log('request: ', url)
    fetch(`${API}${url}`, {
        method: "GET",
        headers: header
    }).then(res => res.json())
        .then(res => {
            callback(res)
        })
        .catch(e => {
            console.log("error: ", e)
            callback("error")
        })
}

export const postFunction = async (url, data, callback) => {
    console.log(data)
    fetch(`${API}${url}`, {
        method: "POST",
        headers: {
            "ACCEPT": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
        .then(res => {
            callback(res)
        })
        .catch(e => {
            console.log(e+" "+url)
            callback("error")
        })
}

export const putFunction = async (url, data, callback) => {
    fetch(`${API}${url}`, {
        method: "PUT",
        headers: {
            "ACCEPT": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
        .then(res => {
            return callback(res)
        })
        .catch(e => {
            console.log(e)
            return callback("error")
        })
}

export const deleteFunction = async (url, callback) => {
    fetch(`${API}${url}`, {
        method: "DELETE",
        headers: {
            "ACCEPT": "application/json",
            "Content-Type": "application/json"
        }
    }).then(res => res.json())
        .then(res => {
            callback(res)
        })
        .catch(e => {
            console.log(e)
            callback("error")
        })
}

export const sendFirebaseNotification = async (message, token) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "key=AAAAIKn5mgg:APA91bFLt3pE2GaHcMNPzBKPddQtcfPaZcuiUHLsIgK63f4jXFKJpQmj5RBUC_ho7jLGg00EkcHyrdjCBd6DG0D-oYgyBn3WcyPAyxkb13Qai8HST2DrUr-Of4vKwXbWd7XhOIVDI3i4");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "notification": {
            "title": "Easha Arts",
            "body": message,
        },
        "data": {

        },
        "to": token
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://fcm.googleapis.com/fcm/send", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

export const sendSMS = async () => {
    const apiKey = "hCa6zbphruA-FdRUzw7U2CURWrsOPmx4Dzgq8oLwzD"
    const sender = "EASHA"
    const number = "+917867926344"
    let applicationName = "application name"
    let otp = "123123"
    const message = `Hi there, thank you for sending your first test message from Textlocal. See how you can send effective SMS campaigns here: https://tx.gl/r/2nGVj/`;

    var url = "http://api.textlocal.in/send/?" + 'apiKey=' + apiKey + '&sender=' + sender + '&numbers=' + number + '&message=' + message;
    fetch(`${url}`, {
        method: "POST",
        headers: {
            "ACCEPT": "application/json",
            "Content-Type": "application/json"
        },
    }).then(res => res.json())
        .then(res => {
            console.log(res)
        })
        .catch(e => {
            console.log(e)
            callback("error")
        })
}