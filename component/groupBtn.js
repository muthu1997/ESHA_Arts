
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
class MultiBtn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mainData: this.props.mainData,
      type: ''
    }
  }

  setItem=(data) => {
    this.setState({type: data});
    this.props.onChangeText(data)
  }

  render() {
    return (
      <View style={{width: '100%', height: 70, justifyContent: 'center'}}>
        <Text style={{paddingHorizontal:5, fontWeight: '700', fontSize: 20, color: "#FFFF"}}>Type: {this.state.type}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.container}>
          {this.state.mainData.map(item => {
            return <TouchableOpacity style={styles.btn} key={item.title} onPress={() => this.setItem(item.value)}>
              <Text style={{color: '#FFFF'}}>{item.title}</Text>
            </TouchableOpacity>
          })}
        </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
  },
  btn: {
    padding:5,
    margin: 5,
    borderRadius: 5,
    borderWidth: 0.6,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#FFFF'
  }
})
export default MultiBtn;
