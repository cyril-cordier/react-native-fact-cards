import React from 'react';
import { Animated, StyleSheet, Text, View, PanResponder } from 'react-native';
import FactCard from './components/fact-card';
import {widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import axios from 'axios';

const CARD_X_ORIGIN = wp("5%");
const MAX_LEFT_ROTATION_DISTANCE = wp("-150%")
const MAX_RIGHT_ROTATION_DISTANCE = wp("150%")
const LEFT_TRESHOLD_BEFORE_SWIPE = wp("-50%")
const RIGHT_TRESHOLD_BEFORE_SWIPE = wp("50%")
const FACT_URL = "https://uselessfacts.jsph.pl/random.json?language=en"
const RANDOM_IMAGE_URL = `http://picsum.photos/${hp("30%")}/${wp("90%")}?image=`

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = { panResponder: undefined, topFact : undefined, bottomFact : undefined }
    this.position = new Animated.ValueXY();
  }

  componentDidMount() {
    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, gesture) => {
        return Math.abs(gesture.dx) > Math.abs(gesture.dy*3)
      },
      onPanResponderMove : (event, gesture) => {
        this.position.setValue({
          x: gesture.dx
        })
      },
      onPanResponderRelease: (event, gesture) => {
        if(gesture.dx < LEFT_TRESHOLD_BEFORE_SWIPE){
          this.forceLeftExit();
        }else if (gesture.dx > RIGHT_TRESHOLD_BEFORE_SWIPE){
          this.forceRightExit();
        }else {
          this.resetPositionSoft();
        }
      }
    });
    this.setState({panResponder} , () => {
      axios.get(FACT_URL).then(response => {
        this.setState({
          topFact : {
          ...response.data,
          image : this.getRandomImageURL()
        }})
      })
      this.loadBottomFact();
    });
  }
  loadBottomFact() {
    axios.get(FACT_URL).then(response => {
      this.setState({
        bottomFact : {
        ...response.data,
        image : this.getRandomImageURL()
      }})
    })
  }
  getRandomImageURL(){
    return `${RANDOM_IMAGE_URL}&${Math.floor(Math.random() * 500 + 1)}`
  }
  oncardExitDone =() =>{
    this.setState({topFact: this.state.bottomFact})
    this.loadBottomFact();
    this.position.setValue({
      x:0,
      y:0
    })
  }
  forceLeftExit(){
    Animated.timing(this.position, {
      toValue: {x : wp("-100%"), y : 0}
    }).start(this.oncardExitDone);
  }
  forceRightExit(){
    Animated.timing(this.position, {
      toValue: {x : wp("100%"), y : 0}
    }).start(this.oncardExitDone);
  }
  resetPositionSoft(){
    Animated.spring(this.position, {
      toValue: {x : 0, y : 0}
    }).start();
  }


  getCardStyle(){
    const rotation = this.position.x.interpolate({
      inputRange : [MAX_LEFT_ROTATION_DISTANCE,0,MAX_RIGHT_ROTATION_DISTANCE],
      outputRange : ["-120deg","0deg","120deg"]
    })
    return {
      transform : [{rotate: rotation}],
      ...this.position.getLayout()
    }
  }



  renderTopCard(){
    return(
      <Animated.View {...this.state.panResponder.panHandlers}style={this.getCardStyle()}>
          <FactCard disabled={false} fact={this.state.topFact}/>
        </Animated.View>
    )
  }
  renderBottomCard(){
    return(
      <View style={{zIndex:-1, position:"absolute"}}>
        <FactCard disabled={true} fact={this.state.bottomFact}/>
      </View>
    )
  }
  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Fact Swipe</Text>
        <View>
          {this.state.topFact && this.renderTopCard()}
          {this.state.bottomFact && this.renderBottomCard()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 50,
  },
  title: {
    fontSize: 30,
  }
});
