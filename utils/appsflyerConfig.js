import appsFlyer from 'react-native-appsflyer';
import { AF_OPTIONS, IS_DEBUG } from './config';

export function appsflyerSDKInitialise() {
    return new Promise((resolve, reject) => {
        appsFlyer.initSdk(AF_OPTIONS,
            (result) => {
                return resolve(result);
            },
            (error) => {
                return reject(error);
            });
    })
}

export function updateAFEvent(title, description) {
    let data = description === "" ? { "DATA": "" } : description;
    if (!IS_DEBUG) {
        appsFlyer.logEvent(title, data,
            (res) => {
                console.log("APPSFLYER: ", res);
            },
            (err) => {
                console.log("APPSFLYER ERROR: ", err);
            });
    }
}

export function updateUID(UID) {
    appsFlyer.setCustomerUserId(UID, (res) => {
        console.log(`Customer id set status: ${res}`)
    });
}