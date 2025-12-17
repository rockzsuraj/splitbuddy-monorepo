import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../Hooks/theme';

const ContactInfo = () => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            // flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 20,
        },
        welcomeText: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
        },
        featuresText: {
            fontSize: 18,
            textAlign: 'center',
            marginBottom: 30,
        },
        developerInfoContainer: {
            // position: 'absolute',
            // bottom: 20,
        },
        developerInfoText: {
            fontSize: 14,
            color: theme.colors.highlightedText,
            textAlign: 'center',
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.developerInfoContainer}>
                <Text style={styles.developerInfoText}>Developed by Suraj Kumar</Text>
                <Text style={styles.developerInfoText}>Contact: surajkmr012@gmail.com</Text>
            </View>
        </View>
    );
};


export default ContactInfo;
