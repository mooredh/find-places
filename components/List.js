import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList } from 'react-native'
import ListItem from './ListItem';

export default class List extends Component {
  render() {
    return (
        <FlatList style={{width: "100%"}} 
        data={this.props.places}
        renderItem={(info)=> (
            <ListItem 
            onItemPressed={() => this.props.onItemSelected(info.item.key)} 
            placeName={info.item.value}
            placeImage={info.item.image}
            />
        )}
        />
    )
  }
}