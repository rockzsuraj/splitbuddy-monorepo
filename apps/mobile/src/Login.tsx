import { Image } from '@rneui/themed';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import ScreenContainer from './Components/ScreenContainer';
import LoginForm from './Form/LoginForm';
import globalStyles from './global/globalStyles';
import useAppImage from './Hooks/useAppImage';
import { useTheme } from './Hooks/theme';


const Login = () => {
    const theme = useTheme();
    const { image } = useAppImage();

    return (
        <ScreenContainer>
            <KeyboardAvoidingView
                enabled
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={StatusBar.currentHeight}
            >
                <ScrollView
                    contentContainerStyle={[styles.headerContainerView, , { backgroundColor: theme.colors.background }]}
                    style={[styles.headerContainer]}
                >
                    <View style={globalStyles.imageContainer}>
                        {image && <Image source={image} style={globalStyles.icon} resizeMode="contain" />}
                    </View>
                    <View style={{ paddingBottom: 20 }}>
                        <Text style={
                            [
                                globalStyles.headerText,
                                { color: theme.colors.text }
                            ]
                        }>Welcome to SplitBuddy!</Text>
                    </View>
                    <View>
                        <LoginForm />
                    </View>
                    <View style={{ paddingBottom: 80 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    headerContainer: {
        // flex: 1,
    },
    headerText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    headerContainerView: {
        // justifyContent: 'center',
        // alignItems: 'center'
        // flex: 1
    }
});

export default Login;
