import { Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useContext, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { ImagePickerResponse } from 'react-native-image-picker';
import * as yup from 'yup';
import { Input, Icon } from '@rneui/themed';

import DefaultProfile from '../Components/DefaultProfile';
import Link from '../Components/Link';
import MaterialButton from '../Components/MaterialButton';
import ScreenContainer from '../Components/ScreenContainer';
import { AppContext } from '../Context/AppProvider';
import { useTheme } from '../Hooks/theme';
import TermsAndConditionsScreen from '../Components/TermsAndConditionsScreen';
import { registerUser, uploadAvatar } from '../api/services/authservice';
import globalStyles from '../global/globalStyles';
import { handleChoosePhoto } from '../utils/utils';
import { saveTokens } from '../lib/storage';

export interface RegisterUser {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
}

interface RegisterFormValues extends RegisterUser {
    confirmPassword: string;
}

const validationSchema = yup.object().shape({
    first_name: yup.string().trim().required('Please enter your first name'),
    last_name: yup.string().trim().required('Please enter your last name'),
    username: yup.string().trim().required('Please enter your username'),
    email: yup.string().trim().email('Invalid email').required('Please enter your email'),
    password: yup
        .string()
        .required('Password is required.')
        .min(8, 'Password must be at least 8 characters long.')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
            'Password must contain uppercase, lowercase, digit & special character.'
        ),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
});

const RegisterUserForm = () => {
    const theme = useTheme();
    const placeHolderColor = { color: theme.colors.text };

    const { setUser, setLoading, state, setErrorMessage, setWelcomeMessage } = useContext(AppContext);

    const [image, setImage] = useState<ImagePickerResponse | null>(null);
    const [showPassword, setShowPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);
    const [uploading, setUploading] = useState(false);

    const handleOpenPhoto = async () => {
        try {
            setUploading(true);
            const result = await handleChoosePhoto();
            if (result) setImage(result);
        } catch (error) { } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (
        values: RegisterFormValues,
        actions: FormikHelpers<RegisterFormValues>
    ) => {
        try {
            setLoading(true);
            let user = null;
            const {user: newUser, refreshToken, token: accessToken} = await registerUser(values);
            user = newUser.user;

            console.log('{user: newUser, refreshToken, accessToken}', {user: newUser, refreshToken, accessToken});
            

            await saveTokens(accessToken, refreshToken);
                console.log('image *', image);

            if (image) {
                    console.log('image **', image);
                const res = await uploadAvatar({
                    uri: image.assets?.[0]?.uri,
                    fileName: image.assets?.[0]?.fileName,
                    type: image.assets?.[0]?.type
                });

                user = res.user;
            }

            if (user) setUser(user);

            setWelcomeMessage(
                user.displayName
                    ? `Hi ${user.displayName}, Welcome to our app! 🎉`
                    : `Welcome to our group expense sharing app! 🎉`
            );

            actions.resetForm();
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.error?.message);
        } finally {
            actions.setSubmitting(false);
            setLoading(false);
        }
    };

    console.log('image', image);
    

    return (
        <Formik<RegisterFormValues>
            initialValues={{
                first_name: '',
                last_name: '',
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {(formikProps: FormikProps<RegisterFormValues>) => (
                <ScreenContainer isScroll style={{ flex: 1 }}>
                    <KeyboardAvoidingView
                        enabled
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        keyboardVerticalOffset={StatusBar.currentHeight}
                        style={{ flex: 1 }}
                    >
                        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

                            {/* Profile Upload */}
                            <TouchableOpacity
                                style={styles.imageContainer}
                                onPress={handleOpenPhoto}
                            >
                                <DefaultProfile uri={image?.assets?.[0]?.uri} loading={uploading} />
                            </TouchableOpacity>

                            {/* FIRST NAME */}
                            <Input
                                inputStyle={{ fontSize: 14 }}   // <-- ADD THIS
                                placeholder="First Name"
                                leftIcon={
                                    <Icon
                                        name="person"
                                        type="material"
                                        color={theme.colors.text}
                                        size={28}
                                    />
                                }
                                labelStyle={{ color: theme.colors.text }}
                                style={{ color: theme.colors.text }}
                                inputContainerStyle={globalStyles.textInputSignIn}
                                placeholderTextColor={placeHolderColor.color}
                                onChangeText={formikProps.handleChange('first_name')}
                                onBlur={formikProps.handleBlur('first_name')}
                                errorMessage={
                                    formikProps.touched.first_name && formikProps.errors.first_name || ''
                                }
                            />

                            {/* LAST NAME */}
                            <Input
                                inputStyle={{ fontSize: 14 }}   // <-- ADD THIS
                                placeholder="Last Name"
                                leftIcon={
                                    <Icon
                                        name="person-outline"
                                        type="ionicon"
                                        color={theme.colors.text}
                                        size={28}
                                    />
                                }
                                labelStyle={{ color: theme.colors.text }}
                                style={{ color: theme.colors.text }}
                                inputContainerStyle={globalStyles.textInputSignIn}
                                placeholderTextColor={placeHolderColor.color}
                                onChangeText={formikProps.handleChange('last_name')}
                                onBlur={formikProps.handleBlur('last_name')}
                                errorMessage={
                                    formikProps.touched.last_name && formikProps.errors.last_name || ''
                                }
                            />

                            <Input
                                inputStyle={{ fontSize: 14 }}   // <-- ADD THIS
                                placeholder="username"
                                leftIcon={
                                    <Icon
                                        name="person-circle-outline"
                                        type="ionicon"
                                        color={theme.colors.text}
                                        size={28}
                                    />
                                }
                                labelStyle={{ color: theme.colors.text }}
                                style={{ color: theme.colors.text }}
                                inputContainerStyle={globalStyles.textInputSignIn}
                                placeholderTextColor={placeHolderColor.color}
                                onChangeText={formikProps.handleChange('username')}
                                onBlur={formikProps.handleBlur('username')}
                                errorMessage={
                                    formikProps.touched.username && formikProps.errors.username || ''
                                }
                            />

                            {/* EMAIL */}
                            <Input
                                placeholder="Email"
                                leftIcon={
                                    <Icon
                                        name="email"
                                        type="material"
                                        color={theme.colors.text}
                                        size={28}
                                    />
                                }
                                inputStyle={{ fontSize: 14 }}   // <-- ADD THIS
                                labelStyle={{ color: theme.colors.text }}
                                style={{ color: theme.colors.text }}
                                inputContainerStyle={globalStyles.textInputSignIn}
                                placeholderTextColor={placeHolderColor.color}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                onChangeText={formikProps.handleChange('email')}
                                onBlur={formikProps.handleBlur('email')}
                                errorMessage={
                                    formikProps.touched.email && formikProps.errors.email || ''
                                }
                            />

                            {/* PASSWORD */}
                            <Input
                                inputStyle={{ fontSize: 14 }}   // <-- ADD THIS
                                placeholder="Password"
                                leftIcon={
                                    <Icon
                                        name="key"
                                        type="ionicon"
                                        color={theme.colors.text}
                                        size={28}
                                    />
                                }
                                style={{ color: theme.colors.text }}
                                secureTextEntry={showPassword}
                                placeholderTextColor={placeHolderColor.color}
                                inputContainerStyle={globalStyles.textInputSignIn}
                                onChangeText={formikProps.handleChange('password')}
                                onBlur={formikProps.handleBlur('password')}
                                errorMessage={
                                    formikProps.touched.password && formikProps.errors.password || ''
                                }
                                rightIcon={
                                    <Icon
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        type="feather"
                                        color={placeHolderColor.color}
                                        onPress={() => setShowPassword(!showPassword)}
                                    />
                                }
                            />

                            {/* CONFIRM PASSWORD */}
                            <Input
                                inputStyle={{ fontSize: 14 }}   // <-- ADD THIS
                                placeholder="Confirm Password"
                                leftIcon={
                                    <Icon
                                        name="lock-closed-outline"
                                        type="ionicon"
                                        color={theme.colors.text}
                                        size={28}
                                    />
                                }
                                style={{ color: theme.colors.text }}
                                secureTextEntry={showConfirmPassword}
                                placeholderTextColor={placeHolderColor.color}
                                inputContainerStyle={globalStyles.textInputSignIn}
                                onChangeText={formikProps.handleChange('confirmPassword')}
                                onBlur={formikProps.handleBlur('confirmPassword')}
                                errorMessage={
                                    formikProps.touched.confirmPassword && formikProps.errors.confirmPassword || ''
                                }
                                rightIcon={
                                    <Icon
                                        name={showConfirmPassword ? 'eye-off' : 'eye'}
                                        type="feather"
                                        color={placeHolderColor.color}
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    />
                                }
                            />

                            {/* BOTTOM SECTION */}
                            <View style={{ marginBottom: 15 }}>
                                <TermsAndConditionsScreen />

                                <MaterialButton
                                    onPress={() => formikProps.handleSubmit()}
                                    title="Register"
                                    type="primary"
                                    disabled={state.loading}
                                    loading={state.loading}
                                />

                                <View style={{ marginTop: 40, alignItems: 'center' }}>
                                    <Link text="Back to login page!" navigate="SignIn" />
                                </View>

                                <View style={{ marginTop: 10, alignItems: 'center' }}>
                                    <Link text="Back to welcome page!" navigate="WelcomeScreen" />
                                </View>
                            </View>

                        </ScrollView>
                    </KeyboardAvoidingView>
                </ScreenContainer>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        width: 150,
        height: 150,
        marginVertical: 20,
        alignSelf: 'center',
    }
});

export default RegisterUserForm;