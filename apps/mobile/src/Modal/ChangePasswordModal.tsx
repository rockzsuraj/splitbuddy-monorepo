import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import MaterialButton from '../Components/MaterialButton'
import ScreenContainer from '../Components/ScreenContainer'
import ChangePasswordScreen from '../Form/ChangePasswordScreen'
import globalStyles from '../global/globalStyles'
import { useTheme } from '../Hooks/theme'

const ChangePasswordModal = () => {
    const theme = useTheme();

    return (
        <ScreenContainer style={[styles.container, { backgroundColor: theme.colors.background }]}>
            
            <Text style={[globalStyles.title, { color: theme.colors.text }]}>
                Change your password
            </Text>

            <Text style={[globalStyles.infoText, { color: theme.colors.text }]}>
                Your new password must be different from previously used password
            </Text>

            {/* ❗ No ScrollView here */}
            <ChangePasswordScreen />

        </ScreenContainer>
    );
};

export default ChangePasswordModal

const styles = StyleSheet.create({
    container: {
        // justifyContent: 'center',
        padding: 20,
        flex: 1
    },
    formContainer: {
    },
    text: {
        color: 'blue',
        marginTop: 20,
    },
});