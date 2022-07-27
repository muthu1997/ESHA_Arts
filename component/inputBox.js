
 import React from 'react';
 import {
   SafeAreaView,
   ScrollView,
   StatusBar,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
 } from 'react-native';
 import * as COLOUR from "../constants/colors";

 class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          color: COLOUR.LIGHTGRAY
        }
      }
   render() {
     return (
         <TextInput 
         placeholder={this.props.placeholder}
         placeholderTextColor={COLOUR.GRAY}
         value={this.props.value}
         onFocus={() => this.setState({color: COLOUR.PRIMARY})}
         onChangeText={(data) => this.props.onChangeText(data)}
         onBlur={() => {
          this.setState({color: COLOUR.LIGHTGRAY})
           this.props.onBlur ? this.props.onBlur() : console.log('onblur')
         }}
         secureTextEntry={this.props.secureTextEntry}
         returnKeyType={this.props.returnKeyType}
         keyboardType={this.props.keyboardType}
         multiline={this.props.multiline}
         style={[styles.button, {borderBottomColor: this.state.color},this.props.style]} 
        />
     )
   }
 }

 const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        borderBottomWidth: 2,
        paddingLeft: 10
    }
 })
 export default Input;
 