import React, { Component } from 'react'
import { Text, View, Modal, Image, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { MapView, Marker } from 'expo'

export default class PlaceDetail extends Component {
    render() {
        return (
            <ScrollView style={styles.container}>
                <View>
                    <Image source={this.props.place.image} style={styles.placeImage} />
                    <Text style={styles.placeName}>{this.props.place.value}</Text>
                </View>
                <View>
                    <MapView
                    initialRegion={this.props.place.region}
                    style={{
                        width: '100%', 
                        height: 200,
                        marginVertical: 10,
                    }}
                    >
                        <MapView.Marker coordinate={this.props.place.region} pinColor="#f34e66" />
                    </MapView>
                </View>
                <View>
                    <TouchableOpacity  style={styles.deleteButton} onPress={() => this.props.onItemDeleted(this.props.place.key)}>
                        <Icon size={30} name="ios-trash" color="#f00" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
  }
}

const styles = StyleSheet.create({
    container: {
        margin: 22
    },
    placeImage: {
        width: "100%",
        height: 200,
        marginVertical: 10,
    },
    placeName: {
        fontWeight: 'bold',
        textAlign: "center",
        fontSize: 28,
    },
    deleteButton: {
        alignItems: 'center',
    }
});