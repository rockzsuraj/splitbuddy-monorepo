import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';



const ScreenHeader = () => {
    return (
        <View style={styles.headerContainer}>
            <View style={styles.leftContainer}>
                <Ionicons name="ios-menu" size={28} color="#FFFFFF" />
                <Text style={styles.headerText}>My App</Text>
            </View>
            <View style={styles.rightContainer}>
                <Ionicons name="ios-notifications-outline" size={28} color="#FFFFFF" />
                <Ionicons name="ios-person-outline" size={28} color="#FFFFFF" />
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: '#2196F3',
        height: 80,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});
