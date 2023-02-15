import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Image, BackHandler } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Text from "./text";
import * as COLOUR from "../constants/colors";
import { icon, filter } from "../constants/icons";
const Header = props => {

  return (
    <View style={[styles.headerContainer, props.style]}>
      <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, width: "100%" }}>
        {props.home ? <View style={styles.homeContainer}>
          <View style={styles.welcomeContainer}>
                <Text title={`Hi ${props.username}`} type="LOUIS_LIGHT" style={styles.name} />
                <Text title={props.greetingsMessage} type="LOUIS_LIGHT" style={styles.welcome} />
            </View>
          <TouchableOpacity 
          activeOpacity={0.9}
          style={styles.profileImageBtn}>
            <Image 
            source={require("../assets/images/logo.png")}
            style={styles.profileImage}
            resizeMode="contain" />
          </TouchableOpacity>
        </View> : null}
        {/* header with back button and title */}
        {props.back ?
          <TouchableOpacity style={styles.backTitleContainer} onPress={() => props.onGoBack()}>
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "flex-start" }}>
              <MIcon name="arrow-left" color={COLOUR.BLACK} size={25} />
              {props.title ?
                <Text title={props.title} type="title" style={{ fontSize: 18, color:COLOUR.BLACK, marginLeft: 20, textAlign: "center" }} /> : null}
            </View>
            {props.rightButton ? <TouchableOpacity style={styles.rightButton} activeOpacity={0.8} onPress={() => props.onPress()}>
            <Icon name={props.rightButtonIcon} color={COLOUR.PRIMARY} size={25} />
            </TouchableOpacity> : null }
          </TouchableOpacity> : null}
          {props.singleTitle ?
          <TouchableOpacity style={[styles.backTitleContainer]}>
            <View style={{ alignItems: "center", width: "100%", justifyContent: "center" }}>
                <Text title={props.singleTitle} type="title" style={{ fontSize: 18, color:COLOUR.BLACK, marginLeft: 20, textAlign: "center" }} />
            </View>
          </TouchableOpacity> : null}

        {props.name ? <View style={{ width: "100%", flexDirection: "row", height: 60, alignItems: 'center', justifyContent: "center" }}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
              <Image source={icon} style={{width: 35, height: 35}} resizeMode="contain" />
            <Text title={"PHOENIX GYM"} type="title" style={{ fontSize: 20, color: COLOUR.BLACK }} />
          </View> 
        </View> : null}
        {props.signin ?
          <Text title="Sign In" type="title" style={{ fontSize: 25, marginVertical: 15 }} /> : null}
      </View>
      {props.bell ?
        <Icon name="bell" color={COLOUR.PRIMARY} size={25} /> : null}

        {/* search bar with filter button */}
      {props.search ?
      <View style={{width: "100%", paddingHorizontal: 20, alignItems:"center", justifyContent: "center"}}>
        <TouchableOpacity onPress={() => props.onSearch()} activeOpacity={0.8} style={[styles.searchButton, { width: props.filter ? "80%" : "100%", backgroundColor: COLOUR.LIGHTGRAY, alignSelf: "center"}]}>
          <Icon name="search" color={COLOUR.DARK_GRAY} size={18} style={{ marginRight: 10 }} />
          <Text title="Search photos here." type="LOUIS_LIGHT" style={{ color: COLOUR.DARK_GRAY, fontWeight: '500', fontSize: 14 }} />
        </TouchableOpacity>
        </View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOUR.WHITE
  },
  name: {
      color: COLOUR.DARK_GRAY,
  },
  welcome: {
      color: COLOUR.BLACK,
      fontWeight: "700",
      fontSize: 25
  },
  welcomeContainer: {
    justifyContent:"center"
  },
  homeContainer: {
    width: "100%",
    height: 75,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: "row"
  },
  profileImageBtn: {
    width: 40,
    height: 40,
    borderRadius: 25,
    overflow: "hidden"
  },
  profileImage: {
    width: "100%",
    height: "100%"
  },
  searchButton: {
    height: 50,
    backgroundColor: COLOUR.WHITE,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "flex-start",
    paddingLeft: 10,
    marginVertical: 10,
    borderRadius: 10
  },
  filterButton: {
    width: "15%",
    height: 50,
    backgroundColor: COLOUR.WHITE,
    alignItems: 'center',
    justifyContent: "center",
    marginVertical: 10,
    borderRadius: 10
  },
  profIconContainer: {
    width: 40,
    height: 40,
    borderWidth: 4,
    borderRadius: 10,
    overflow: "hidden",
    borderColor: COLOUR.WHITE
  },
  profileimg: {
    width: "100%",
    height: "100%"
  },
  filterImage: {
    width: "60%",
    height: "60%"
  },
  backTitleContainer: {
    width: "85%",
    height: 65,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  searchContainer: {
    width: "100%",
    height: 75,
    backgroundColor: "red"
  },
  rightButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  }
});

export default Header;