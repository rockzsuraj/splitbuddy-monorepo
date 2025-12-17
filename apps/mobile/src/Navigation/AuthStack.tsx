import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { View } from 'react-native';
import ErrorSnackBar from '../Components/SnackBar/ErrorSnackBar';
import SuccessSnackBar from '../Components/SnackBar/SuccessSnackBar';
import { AppContext } from '../Context/AppProvider';
import ForgotPasswordForm from '../Form/ForgotPasswordForm';
import RegisterUserForm from '../Form/RegisterUserForm';
import Login from '../Login';
import WelcomeScreen from '../WelcomeScreen';
import { AuthStackParamList } from './NavigationTypes';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();


export const AuthUserStack = () => {
    const { state: { successMessage, errorMessage } } = useContext(AppContext);
    return (
        <View style={{ flex: 1 }}>
            <SuccessSnackBar message={successMessage} />
            <ErrorSnackBar message={errorMessage} />
            <AuthStack.Navigator initialRouteName='WelcomeScreen'>
                <AuthStack.Group screenOptions={{ headerShown: false }}>
                    <AuthStack.Screen name="WelcomeScreen" component={WelcomeScreen} />
                    <AuthStack.Screen name="SignIn" component={Login} />
                    <AuthStack.Screen name="SignUp" component={RegisterUserForm} />
                    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordForm} />
                </AuthStack.Group>
            </AuthStack.Navigator>
        </View>

    );
};
