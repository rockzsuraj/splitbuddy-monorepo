import { NavigationContainer } from '@react-navigation/native';
import React, { useContext } from 'react';
import SplashScreen from '../Components/SplashScreen';
import { AppContext } from '../Context/AppProvider';
import { AuthUserStack } from './AuthStack';
import { MainStack } from './MainStack';
import SuccessSnackBar from '../Components/SnackBar/SuccessSnackBar';
import ErrorSnackBar from '../Components/SnackBar/ErrorSnackBar';
import { useTheme } from '../Hooks/theme';

function AppNavigation() {

    const { state: { successMessage, errorMessage, user, isAppInit, theme: colorScheme } } = useContext(AppContext);
    const theme = useTheme();
    if (isAppInit) {
        return (
            <SplashScreen />
        )
    }

    return (
        <NavigationContainer >
            {user ? (
                <MainStack />
            ) : (
                <AuthUserStack />
            )}
            <SuccessSnackBar message={successMessage} />
            <ErrorSnackBar message={errorMessage} />
        </NavigationContainer>

    );
}


export default AppNavigation;