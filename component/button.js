
 import React from 'react';
 import {
   SafeAreaView,
   ScrollView,
   Animated,
   StyleSheet,
   Text,
   useColorScheme,
   TouchableOpacity,
   View,
 } from 'react-native';
 import * as COLOUR from "../constants/colors";
 import Lottie from 'lottie-react-native';
 
 class Button extends React.Component {
    constructor(props) {
        super(props);
      }
   render() {
     return (
         <TouchableOpacity onPress={() => {
          if(!this.props.loading) {
            this.props.onPress()
          }
          }} style={[styles.button,{backgroundColor: this.props.loading ? COLOUR.WHITE : COLOUR.PRIMARY}, this.props.style]}>
            {this.props.loading ? 
            <Lottie source={require('../constants/loader.json')} autoPlay loop style={{width: 50, height: 50}} />
             : <Text type="ROBOTO_MEDIUM" style={[styles.btntxt, this.props.textStyle]}>{this.props.title}</Text>}
         </TouchableOpacity>
     )
   }
 }

 const styles = StyleSheet.create({
    button: {
        width: '70%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 3
    },
    btntxt: {
      color: '#FFFF'
    }
 })
 export default Button;
 