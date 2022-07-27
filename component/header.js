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
        {/* header with back button and title */}
        {props.back ?
          <TouchableOpacity style={styles.backTitleContainer} onPress={() => props.navigation.goBack()}>
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "flex-start" }}>
              <MIcon name="arrow-left" color={COLOUR.BLACK} size={25} />
              {props.title ?
                <Text title={props.title} type="title" style={{ fontSize: 22, color:COLOUR.BLACK, marginLeft: 20, textAlign: "center" }} /> : null}
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
      <View style={{width: "100%", flexDirection: "row", paddingHorizontal: 20, alignItems:"center", justifyContent: "space-around"}}>
        <TouchableOpacity activeOpacity={0.8} style={[styles.searchButton, { width: props.filter ? "80%" : "90%"}]}>
          <Icon name="search" color={COLOUR.GRAY} size={15} style={{ marginRight: 10 }} />
          <Text title="Search" type="paragraph" style={{ color: COLOUR.GRAY, fontWeight: '500' }} />
        </TouchableOpacity>
        {props.filter ?<TouchableOpacity activeOpacity={0.8} style={[styles.filterButton]}>
            <Image source={filter} style={styles.filterImage} resizeMode="contain" />
        </TouchableOpacity> : null }
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
    width: "100%",
    height: 65,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  searchContainer: {
    width: "100%",
    height: 75,
    backgroundColor: "red"
  }
});

export default Header;