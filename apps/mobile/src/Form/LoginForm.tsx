import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import * as Yup from 'yup';
import CTAButton from '../Components/CTAButton';
import Link from '../Components/Link';
import { AppContext } from '../Context/AppProvider';
import globalStyles from '../global/globalStyles';
import { useTheme, } from '../Hooks/theme';
import { Input, Icon } from '@rneui/themed';
import { login } from '../api/services/authservice';
import { logError } from '../utils/utils';

const LoginForm = () => {
    const theme = useTheme();
    const placeHolderColor = { color: theme.colors.text }
    const navigation = useNavigation();
    const { setErrorMessage, setSuccessMessage, setUser, setLoading, state: {loading} } = useContext(AppContext);
    const [showPassword, setShowPassword] = useState(true);

    console.log('loading', loading);
    

    const schema = Yup.object().shape({
        identifier: Yup.string().required('Email or Username is required')
            .test('identifier-test', 'Invalid email or username', function (value) {
                const isEmail = /\S+@\S+\.\S+/.test(value || '');
                const isUsername = /^[a-zA-Z0-9_]{3,30}$/.test(value || '');
                if (isEmail || isUsername) {
                    return true;
                }
                return false;
            }),
        password: Yup.string().required('Password is required'),
    });

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (values: {
        identifier: string;
        password: string;
    }) => {
        const { identifier, password } = values;
        try {
            setLoading(true);
            if (!identifier || !password) {
                setErrorMessage('Incorrect email/username or password')
                return;
            }
            const isEmail = /\S+@\S+\.\S+/.test(identifier);
            const { token, refreshToken, user } = await login(
                {
                    email: isEmail ? identifier : undefined,
                    username: !isEmail ? identifier : undefined,
                },
                password
            );
            if (token && refreshToken && user) {
                setSuccessMessage(`Welcome ${user.first_name}!`);
                setUser(user);
            }
        } catch (error: any) {
            console.log("AXIOS RAW ERROR ===>", JSON.stringify(error, null, 2)); // <– here
            logError(error, 'Login'); // Using the logError function here
            setErrorMessage(`Error signing in: ${error?.response?.data?.error?.message || 'Unknown error'}`);
        } finally {
            setLoading(false)
        }
    }

    return (
        <Formik
            initialValues={{ identifier: '', password: '' }}
            validationSchema={schema}
            onSubmit={handleLogin}
        >
            {(formikProps) => {
                return (
                    <View style={styles.formContainer}>
                        <Input
                            style={[{
                                color: theme.colors.text,
                                fontSize: 14
                            }]}
                            containerStyle={{ paddingHorizontal: 0 }}
                            labelStyle={{ paddingBottom: 5, color: theme.colors.text }}
                            leftIcon={
                                <Icon
                                    name='person'
                                    type='material'
                                    color={theme.colors.text}
                                    size={30}
                                />
                            }
                            label={'Email or username'} // <- changed
                            inputContainerStyle={[globalStyles.textInputSignIn]}
                            placeholder="Enter email or username"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            onChangeText={formikProps.handleChange('identifier')}
                            onBlur={formikProps.handleBlur('identifier')}
                            errorMessage={
                                formikProps.touched.identifier && formikProps.errors.identifier || ''
                            }
                            placeholderTextColor={placeHolderColor.color}
                        />
                        <Input
                            containerStyle={{ paddingHorizontal: 0 }}
                            labelStyle={{ paddingBottom: 5, color: theme.colors.text }}
                            label={'Password'}
                            style={[{
                                color: theme.colors.text,
                                fontSize: 14
                            }]}
                            leftIcon={
                                <Icon
                                    name='key'
                                    type='ionicon'
                                    color={theme.colors.text}
                                    size={30}
                                />
                            }
                            inputContainerStyle={[globalStyles.textInputSignIn]}
                            placeholder="Password"
                            autoCapitalize="none"
                            secureTextEntry={showPassword}
                            onChangeText={formikProps.handleChange('password')}
                            onBlur={formikProps.handleBlur('password')}
                            errorMessage={
                                formikProps.touched.password && formikProps.errors.password || ''
                            }
                            placeholderTextColor={placeHolderColor.color}
                            rightIcon={
                                <Icon
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    type="feather"
                                    onPress={toggleShowPassword}
                                    color={placeHolderColor.color}
                                />
                            }
                        />
                        <View>
                            <CTAButton
                                isLoading = {loading}
                                disabled={!(formikProps.dirty && formikProps.isValid)}
                                onPress={() => formikProps.handleSubmit()} title='Login' type='primary' />
                        </View>
                        <View>
                            <CTAButton onPress={() => navigation.navigate('SignUp')} title='Create a new account!' type='secondary' />
                        </View>

                        <View style={{ marginTop: 50, alignItems: 'center' }}>
                            <Link text='Forgot your Password?' navigate='ForgotPassword' />
                        </View>
                    </View>
                )
            }
            }
        </Formik>
    );
};
const styles = StyleSheet.create({
    formContainer: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
});


export default LoginForm;