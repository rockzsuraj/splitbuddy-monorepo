import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colorTheme } from '../Hooks/theme';

const InfoMessage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Looks like you don't have any groups to add transactions yet.</Text>
            <Text style={styles.text}>"Don't worry, creating a group is easy and you can invite your friends and family to join. Simply click the 'Create Group' button to get started. Once you have a group, you can start adding transactions and sharing them with your group members. Happy sharing!"</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        color: colorTheme.colors.green
    },
});

export default InfoMessage;
