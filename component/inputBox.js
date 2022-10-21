
import React from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as COLOUR from "../constants/colors";
import Text from "../component/text";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CountryPicker from 'react-native-country-picker-modal';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: COLOUR.LIGHTGRAY,
      secure: false,
      countryCode: "+91",
      popCountryPicker: false
    }
  }
  render() {
    return (
      <View style={[styles.inputContainer, this.props.style]}>
        {this.props.country === true ?
          <TouchableOpacity onPress={() => this.setState({ popCountryPicker: true })} style={styles.countryContainer}>
            <Text title={this.state.countryCode} type="ROBOTO_MEDIUM" />
          </TouchableOpacity> : null}
        <TextInput
          placeholder={this.props.placeholder}
          placeholderTextColor={COLOUR.DARK_GRAY}
          value={this.props.value}
          onFocus={() => this.setState({ color: COLOUR.PRIMARY })}
          onChangeText={(data) => this.props.onChangeText(data)}
          onBlur={() => {
            this.setState({ color: COLOUR.LIGHTGRAY })
            this.props.onBlur ? this.props.onBlur(this.state.countryCode) : console.log('onblur')
          }}
          onSubmitEditing={() => {
            this.setState({ color: COLOUR.LIGHTGRAY })
            this.props.onSubmitEditing ? this.props.onSubmitEditing() : console.log('onSubmitEditing')
          }}
          secureTextEntry={this.props.secureTextEntry && !this.state.secure ? true : false}
          returnKeyType={this.props.returnKeyType}
          keyboardType={this.props.keyboardType}
          multiline={this.props.multiline}
          style={[{ width: this.props.eye ? "80%" : "100%", height: 55, paddingLeft: 10, color: COLOUR.BLACK, justifyContent: "center" }]}
        />
        {this.props.eye ? <TouchableOpacity onPress={() => this.setState({ secure: !this.state.secure })} style={styles.eyeButton}>
          <Icon name="eye" size={25} color={this.state.secure ? COLOUR.PRIMARY : COLOUR.DARK_GRAY} />
        </TouchableOpacity> : null}
        <CountryPicker
        containerButtonStyle={{width: 0, height: 0}}
          withFilter={true}
          visible={this.state.popCountryPicker}
          onClose={() => this.setState({ popCountryPicker: false })}
          onSelect={(item) => {
            this.setState({
              countryCode: `+${item.callingCode[0]}`,
              popCountryPicker: false
            })
          }} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    height: 55,
    marginVertical: 5,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: COLOUR.LIGHTGRAY,
    flexDirection: "row"
  },
  eyeButton: {
    width: "20%",
    height: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  countryContainer: {
    width: 60,
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  }
})
export default Input;
