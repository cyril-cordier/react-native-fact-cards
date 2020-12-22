import React, { Component } from 'react'
import {View, Image, Button, Text, Linking, ScrollView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

export default class FactCard extends Component {
    goToTopScrollview = () => {
        this.scrollView.scrollTo({x:0, y:0, animated:true})
    }
    render() {
        return (
            <View style={{
                elevation : 1,
                shadowColor:"black",
                shadowOffset: { width : 1, height : 1},
                shadowOpacity : 0.7,
                width : wp("90%"),
                backgroundColor : "white"
            }}>
                <Image 
                style={{width:wp("90%"), height: hp("30%")}} 
                source={{
                    uri: this.props.fact.image
                }}/>
                <ScrollView 
                    ref={scrollViewRef => {this.scrollView = scrollViewRef}}
                    onScrollEndDrag={this.goToTopScrollview}
                    style={{height:50 }}>
                    <Text>{this.props.fact.text}{this.props.fact.text}{this.props.fact.text}{this.props.fact.text}{this.props.fact.text}</Text>
                </ScrollView>
                <Button 
                title= "See the source" 
                disabled={this.props.disabled} 
                onPress={() => Linking.openURL(this.props.fact.source_url)} />
            </View>
        )
    }
}
