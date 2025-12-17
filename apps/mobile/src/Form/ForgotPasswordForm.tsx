// import Auth from '@react-native-firebase/auth';
import { Button, Input } from '@rneui/themed';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Yup from 'yup';
import Link from '../Components/Link';
import globalStyles from '../global/globalStyles';
import { colorTheme, useTheme } from '../Hooks/theme';
import { resetPassword } from '../api/services/authservice';

const ForgotPasswordForm = () => {
    const theme = useTheme();
    const placeHolderColor = { color: theme.colors.text }
    const [timer, setTimer] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useEffect(() => {
        let intervalId: any;
        if (timer > 0) {
            intervalId = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        } else {
            setIsButtonDisabled(false);
            clearInterval(intervalId);
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        };
    }, [timer]);

    const sendPasswordResetEmail = async(email: string) => {
        await resetPassword(email);
    };

    const startTimer = () => {
        setTimer(60); // set timer to 60 seconds
        setIsButtonDisabled(true); // disable the button
    };

    const handleForgotPassword = async (values: any) => {
        const { email } = values;
        try {
            sendPasswordResetEmail(email);
            startTimer();

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Formik
            initialValues={{ email: '' }}
            validationSchema={Yup.object().shape({
                email: Yup.string().email('Invalid email').required('Email is required'),
            })}
            onSubmit={handleForgotPassword}
        >
            {(formikProps) => (
                <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                    <View style={{ paddingBottom: 40 }}>
                        <Text style={[globalStyles.title, { color: theme.colors.text }]}>Reset your password</Text>
                        <Text style={[globalStyles.infoText, { color: theme.colors.text }]}>
                            Enter your email address we’ll send you a link to reset your password.
                        </Text>
                    </View>
                    <Input
                        inputContainerStyle={{ borderBottomWidth: 0 }}
                        style={[globalStyles.textInput, { color: theme.colors.text }]}
                        label='Your email address'
                        labelStyle={{ textAlign: 'center', paddingBottom: 5, color: theme.colors.text }}
                        placeholder="Email"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        onChangeText={formikProps.handleChange('email')}
                        onBlur={formikProps.handleBlur('email')}
                        placeholderTextColor={placeHolderColor.color}
                        errorMessage={
                            formikProps?.touched?.email && formikProps?.errors?.email || ''
                        }
                    />
                    <View >
                        <Button
                            disabled={!(formikProps.dirty && formikProps.isValid && !isButtonDisabled)}
                            disabledStyle={[globalStyles.button, { opacity: 0.5 }]}
                            buttonStyle={[globalStyles.button]}
                            titleStyle={globalStyles.buttonText}
                            title="Reset Password"
                            onPress={formikProps.handleSubmit}
                        />
                    </View>

                    <View style={{ marginTop: 50, alignItems: 'center', justifyContent: 'center' }}>
                        <Link text='Back to Login' navigate='SignIn' />
                    </View>
                    {timer > 0 && (
                        <View style={{ padding: 10, marginTop: 20 }}>
                            <Text style={[globalStyles.infoText, { color: colorTheme.colors.tomato }]}>You can try again after:</Text>
                            <Text style={[globalStyles.infoText, { color: colorTheme.colors.tomato }]}>{timer}</Text>
                        </View>
                    )}
                </View>
            )}
        </Formik>
    );
};

export default ForgotPasswordForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
        // width: '100%',
        // marginBottom: 20
    },
    text: {
        color: 'blue',
        marginTop: 20,
    },
});
