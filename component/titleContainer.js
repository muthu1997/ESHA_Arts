import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Text from "./text";
import * as COLOUR from "../constants/colors";
const TitleContainer = props => {
  return (
      <View style={[styles.headerContainer, props.style]}>
          <View style={{ justifyContent:'space-between', width: "100%", flexDirection: "row"}}>
            <Text title={props.title} type="ROBO_BOLD" style={{color: COLOUR.BLACK, fontSize: props.small ? 16 : 20}} />
            {props.secondaryTitle ? <Text title={props.secondaryTitle} type="ROBO_REGULAR" style={[{color: COLOUR.BLACK, fontWeight: "500"}, props.secStyle]} /> : null }
            {props.addButton ? <TouchableOpacity activeOpacity={0.8} style={styles.addButton}>
              <Icon name="plus" size={20} color={COLOUR.WHITE} />
            </TouchableOpacity> : null }
          </View>
      </View>
  );
} 
 
const styles = StyleSheet.create({
    headerContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10
  },
  addButton: {
    width: 35,
    height: 35,
    borderRadius: 25,
    alignItems:'center',
    justifyContent:"center",
    backgroundColor: COLOUR.PRIMARY
  }
});

export default TitleContainer;