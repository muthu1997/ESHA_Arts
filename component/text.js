import * as React from 'react';
import { StyleSheet, Dimensions, Text } from 'react-native';

const DefaultText = props => {
  return (
      <Text 
      numberOfLines = {props.lines} 
      {...props} 
      style={[props.type=== 'LOUIS_LIGHT' ? styles.louislight :props.type=== 'ROBO_REGULAR' ? styles.roboregular :props.type=== 'ROBO_BOLD' ? styles.robobold :props.type=== 'DEVITTA' ? styles.devitta: props.type=== 'ROBOTO_MEDIUM' ? styles.robomedium : styles.title, props.style]}>
        {props.title}
      </Text>
  );
} 
 
const styles = StyleSheet.create({
  louislight: {
    fontSize: 16,
    padding:2,
    fontFamily: "Louis George Cafe"
  },
  roboregular: {
    fontSize: 14,
    padding:2,
    fontFamily: "Roboto-Regular"
  },
  robomedium: {
    fontSize: 14,
    padding:2,
    fontFamily: "Roboto-Regular"
  },
  robobold: {
    fontSize: 18,
    padding:2,
    fontFamily: "Roboto-Bold"
  },
  devitta: {
    fontFamily: 'Devitta',
    fontSize: 18,
    padding:2,
  },
  title: {
    fontWeight: '700',
    fontSize: 22,
    padding:2
  }
});

export default DefaultText;