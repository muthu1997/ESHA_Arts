import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {API} from "./config";
import * as STRINGS from "../constants/strings";

const header1 = {
    'Content-Type': 'application/json',
    "Accept": "application/json"
} 
export async function postMethod(url, body) {
    if(global.headers === true) {
        header1.Authorization = "Bearer "+ await AsyncStorage.getItem(STRINGS.TOKEN);
    }
    return new Promise(async (resolve, reject) => {
        return await axios
            .post(`${API}${url}`, body, {headers: header1})
            .then((res) => {
                return resolve(res.data);
            })
            .catch((error) => {console.log("error: "+url+" : "+JSON.stringify(error));return reject(error.response.data.error)});
    })
}

export async function getMethod(url) {
    console.log(`${API}${url}`)
    // console.log(global.headers)
    if(global.headers === true) {
        header1.Authorization = "Bearer "+ await AsyncStorage.getItem(STRINGS.TOKEN);
    }
    return new Promise(async (resolve, reject) => {
        const URL_LINK = `${API}${url}`;
        return await axios
            .get(`${URL_LINK}`, {headers:  header1})
            .then((res) => {
                return resolve(res.data);
            })
            .catch((error) => {console.log("error: "+url+" : "+error);return reject(error)});
    })
}

export async function deleteMethod(url, callback) {
    if(global.headers === true) {
        header1.Authorization = "Bearer "+ await AsyncStorage.getItem(STRINGS.TOKEN);
    }
    return new Promise(async (resolve, reject) => {
        return await axios
            .delete(`${API}${url}`, {headers:  header1})
            .then((res) => {
                return resolve(res);
            })
            .catch((error) => {console.log(error);return reject(error)});
    })
}

export async function putMethod(url, body) {
    if(global.headers === true) {
        header1.Authorization = "Bearer "+ await AsyncStorage.getItem(STRINGS.TOKEN);
    }
    return new Promise(async (resolve, reject) => {
        return await axios
            .put(`${API}${url}`, body, {headers:  header1})
            .then((res) => {
                return resolve(res.data);
            })
            .catch((error) => {console.log("error: "+url+" : "+error);return reject(error)});
    })
}

export async function uploadImage(localImage, name, callback) {
    return new Promise(async(resolve, reject) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "multipart/form-data");
        var formdata = new FormData();
        formdata.append("file", { uri: localImage, name: `${name}.jpg`, type: 'image/jpg' });
        formdata.append("upload_preset", "nukwtgp8");
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        // await fetch("https://api.cloudinary.com/v1_1/easha-arts/image/upload", requestOptions)
        //     .then(response => response.json())
        //     .then(result => {
        //         return resolve(result.url);
        //     })
        //     .catch(error => {
        //         console.log(error)
        //         return reject(-1)
        //     });
    })
}

export const sendFirebaseNotification = async (message, token) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "key=AAAAH-hJYbQ:APA91bG5_uiQnItNDWxWRlSGeH9JF6_RpH9WjqX7Ig--YgEdXnqxIIiifdxUN0O93UuzRQx5tt49iySu8KykBr7vpcIiHL2O2CZ-WZZzcG9914MoEHFrh225QWtl4I3C8hao1FBAK2-i");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "notification": {
            "title": "New Order!",
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