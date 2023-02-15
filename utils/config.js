//API handlers
export const API = "http://192.168.225.139:3000/v1";
// export const API = "https://project-easha-arts.onrender.com/v1";
// export const API = "http://ec2-54-238-131-132.ap-northeast-1.compute.amazonaws.com:3000/v1"

//Appsflyer SDK handlers
export const APPSFLYER_DEV = "pcn4x88ffPkPZwbs797ic6";
export const AF_OPTIONS = {
    devKey: APPSFLYER_DEV,
    isDebug: true,
    onInstallConversionDataListener: true, //Optional
    onDeepLinkListener: true, //Optional
    timeToWaitForATTUserAuthorization: 10 //for iOS 14.5
}
//Paytm
// export const PTM_MID = "PXizyI79545785270970";
// export const PTM_MSECRET = "d504a59b26794cdea1e5a93d1c1e5dcb1673258152464";
export const PTM_MID = "rwHgUV87823862913476";
export const PTM_MSECRET = "d504a59b26794cdea1e5a93d1c1e5dcb1673258152464";

// Debug
export const IS_DEBUG = true;