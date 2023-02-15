import React, { useEffect,useState } from "react";
import { View, StyleSheet, StatusBar, TouchableOpacity, FlatList } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../../../component/header";
import Text from "../../../component/text";
import { useSelector, useDispatch } from 'react-redux';
import {updateAddressList} from "../../redux/action";
import Lottie from 'lottie-react-native';
import { updateAFEvent } from "../../../utils/appsflyerConfig";
import { MY_ADDRESS_INIT } from "../../../utils/events";

export default function MyAddress(props) {
    const user = useSelector(state => state.reducer.profile);
    const addressList = useSelector(state => state.reducer.address_list);
    const [loader, setLoader] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        getAddressList();
        updateAFEvent(MY_ADDRESS_INIT, "");
    }, [])

    function getAddressList() {
        dispatch(updateAddressList(user._id)).then(res => {
            console.log(res)
            setLoader(false);
        })
    }

    function renderAddressCard(item) {
        return (
            <View elevation={3} style={styles.cardContainer}>
                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ paddingHorizontal: 10, paddingVertical: 5, backgroundColor: COLOUR.GRAY, borderRadius: 5 }}>
                        <Text title={`${item.type}`} type="ROBOTO_MEDIUM" style={{ color: COLOUR.DARK_GRAY, fontSize: 12 }} />
                    </View>
                    <TouchableOpacity onPress={() => props.navigation.navigate("EditAddress", {data: item})} activeOpacity={0.8} style={styles.ediButton}>
                        <Icon name="pencil" size={15} color={COLOUR.WHITE} />
                    </TouchableOpacity>
                </View>
                <Text title={`${item.name},`} type="ROBOTO_MEDIUM" style={{ color: COLOUR.DARK_GRAY, fontSize: 14 }} />
                <Text title={`${item.mobile},`} type="ROBOTO_MEDIUM" style={{ color: COLOUR.DARK_GRAY, fontSize: 14 }} />
                <Text title={`${item.houseNo}, ${item.street}`} type="ROBOTO_MEDIUM" style={{ color: COLOUR.DARK_GRAY, fontSize: 14 }} />
                <Text title={`${item.area},`} type="ROBOTO_MEDIUM" style={{ color: COLOUR.DARK_GRAY, fontSize: 12, marginVertical: 5 }} />
                <Text title={`${item.city} - ${item.zip},`} type="ROBOTO_MEDIUM" style={{ color: COLOUR.DARK_GRAY, fontSize: 12, marginVertical: 5 }} />
                <Text title={`${item.state}`} type="ROBOTO_MEDIUM" style={{ color: COLOUR.DARK_GRAY, fontSize: 12 }} />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle={"dark-content"} />
            <Header
                back
                title="My Address"
                onGoBack={() => props.navigation.goBack()}
                style={{ backgroundColor: "transparent" }} />
                <TouchableOpacity onPress={() => props.navigation.navigate("NewAddress")} activeOpacity={0.8} style={styles.addButton}>
                        <Icon name="plus" size={25} color={COLOUR.PRIMARY} />
                <Text title={` Add a new address`} type="ROBOTO_MEDIUM" style={{ color: COLOUR.PRIMARY, fontSize: 14 }} />
                    </TouchableOpacity>
            <Text title={`${addressList.length} Saved Addresses`} type="ROBOTO_MEDIUM" lines={1} style={{ color: COLOUR.DARK_GRAY, fontSize: 10, margin: 5 }} />
            {loader ?
                <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
                <Lottie source={require('../../../assets/lottie/loader.json')} autoPlay loop style={{ width: 150, height: 150 }} />
                        <Text title={"Loading..."} type="ROBO_BOLD" lines={2} style={[styles.catText, { color: COLOUR.PRIMARY }]} />
            </View> :  
            <FlatList
                data={addressList}
                renderItem={({ item, index }) => {
                    return renderAddressCard(item)
                }}
                keyExtractor={item => item._id}
                showsVerticalScrollIndicator={false}
            /> }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cardContainer: {
        width: "100%",
        padding: 10,
        backgroundColor: COLOUR.WHITE,
        marginVertical: 5
    },
    ediButton: {
        width: 35,
        height: 35,
        borderRadius: 20,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor: COLOUR.PRIMARY
    },
    addButton: {
        width: "100%",
        height: 40,
        paddingLeft:20,
        alignItems: "center",
        backgroundColor: COLOUR.WHITE,
        elevation: 2,
        marginBottom: 20,
        flexDirection: "row"
    }
})