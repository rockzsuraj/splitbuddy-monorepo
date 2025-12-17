// import Auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Icon, Input } from '@rneui/themed';
import { Formik, FormikHelpers } from 'formik';
import React, { useContext, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import * as Yup from 'yup';
import MaterialButton from '../Components/MaterialButton';
import { AppContext } from '../Context/AppProvider';
import { useTheme } from '../Hooks/theme';
import { changePassword } from '../api/services/authservice';
import globalStyles from '../global/globalStyles';
import { SafeAreaView } from 'react-native-safe-area-context';


const ChangePasswordScreen = () => {
    const { state: { loading }, setErrorMessage, setSuccessMessage, setLoading } = useContext(AppContext);
    const [showCurrentPassword, setShowCurrentPassword] = useState(true);
    const [showNewPassword, setShowNewPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);
    const theme = useTheme();
    const placeHolderColor = { color: theme.colors.text }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
        },
        label: {
            alignSelf: 'flex-start',
            marginVertical: 10,
            fontWeight: 'bold',
        },
        input: {
            width: '100%',
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around'
        },
        error: {
            color: 'red',
            marginBottom: 10,
        },
        imageContainer: {
            width: 150,
            height: 150,
            marginVertical: 20,
        },
        image: {
            width: '100%',
            height: '100%',
            borderRadius: 30
        },
        expenseButton: {
            backgroundColor: 'blue',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            width: '80%',
            alignItems: 'center',
            marginTop: 5
        },
        buttonText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.colors.text
        },
        inputPassword: {
        },
        inputPasswordContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
        },
        innerInput: {
            paddingHorizontal: 15,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around'
        }
    });
    const toggleCurrentPasswordVisibility = () => setShowCurrentPassword(!showCurrentPassword);
    const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);
    const navigation = useNavigation();
    const { state: { user }, setUser } = useContext(AppContext)

    const schema = Yup.object().shape({
        currentPassword: Yup.string().required('Current Password is required'),
        newPassword: Yup
            .string()
            .required('New Password is required')
            .min(8, 'Password must be at least 8 characters long.')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
                'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character from (@$!%*?&#).'
            ),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword') ?? null, ''], 'Passwords must match')
            .required('Confirm Password is required'),
    });

    const handleChangePassword = async (values: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }, formikHelpers: FormikHelpers<{
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }>) => {
        try {
            setLoading(true)
            const { confirmPassword, currentPassword, newPassword } = values;
            console.log('values', values);

            if (!(confirmPassword && confirmPassword && newPassword)) {
                setErrorMessage('Fill all field is required!')
            } else if (currentPassword === newPassword) {
                setErrorMessage('Your new password must be different from current password')
            } else {
                const res = await changePassword(currentPassword, newPassword, confirmPassword);
                setUser(null)
                setSuccessMessage(res.message);
                formikHelpers.resetForm();
                navigation.goBack();
            }
        } catch (err: any) {
            setErrorMessage(err.response.data.error.message);
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };
return (
    <SafeAreaView style={{ flex: 1}}>
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10 }} showsVerticalScrollIndicator={false}>
                <Formik
                    initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
                    validationSchema={schema}
                    onSubmit={handleChangePassword}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <View style={{ flex: 1 }}>
                            
                            {/* Scrollable Section */}
                            <ScrollView
                                contentContainerStyle={{ paddingBottom: 40 }}
                                showsVerticalScrollIndicator={false}
                            >

                                <Input
                                    containerStyle={{ paddingHorizontal: 0 }}
                                    style={{ color: theme.colors.text, fontSize: 14 }}
                                    placeholder="Current Password"
                                    leftIcon={
                                        <Icon
                                            name="key"
                                            type="ionicon"
                                            color={theme.colors.text}
                                            size={30}
                                        />
                                    }
                                    secureTextEntry={showCurrentPassword}
                                    onChangeText={handleChange('currentPassword')}
                                    onBlur={handleBlur('currentPassword')}
                                    value={values.currentPassword}
                                    inputContainerStyle={[globalStyles.textInputSignIn]}
                                    placeholderTextColor={placeHolderColor.color}
                                    errorMessage={touched.currentPassword && errors.currentPassword || ''}
                                    rightIcon={
                                        <Icon
                                            name={showCurrentPassword ? 'eye-off' : 'eye'}
                                            type="feather"
                                            onPress={toggleCurrentPasswordVisibility}
                                            color={placeHolderColor.color}
                                        />
                                    }
                                />

                                <Input
                                    containerStyle={{ paddingHorizontal: 0 }}
                                    style={{ color: theme.colors.text, fontSize: 14 }}
                                    placeholder="New Password"
                                    leftIcon={
                                        <Icon
                                            name="lock-open-outline"
                                            type="ionicon"
                                            color={theme.colors.text}
                                            size={30}
                                        />
                                    }
                                    secureTextEntry={showNewPassword}
                                    onChangeText={handleChange('newPassword')}
                                    onBlur={handleBlur('newPassword')}
                                    value={values.newPassword}
                                    inputContainerStyle={[globalStyles.textInputSignIn]}
                                    placeholderTextColor={placeHolderColor.color}
                                    errorMessage={touched.newPassword && errors.newPassword || ''}
                                    rightIcon={
                                        <Icon
                                            name={showNewPassword ? 'eye-off' : 'eye'}
                                            type="feather"
                                            onPress={toggleNewPasswordVisibility}
                                            color={placeHolderColor.color}
                                        />
                                    }
                                />

                                <Input
                                    containerStyle={{ paddingHorizontal: 0 }}
                                    style={{ color: theme.colors.text, fontSize: 14 }}
                                    placeholder="Confirm Password"
                                    leftIcon={
                                        <Icon
                                            name="checkmark-done-outline"
                                            type="ionicon"
                                            color={theme.colors.text}
                                            size={30}
                                        />
                                    }
                                    secureTextEntry={showConfirmPassword}
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    value={values.confirmPassword}
                                    inputContainerStyle={[globalStyles.textInputSignIn]}
                                    placeholderTextColor={placeHolderColor.color}
                                    errorMessage={touched.confirmPassword && errors.confirmPassword || ''}
                                    rightIcon={
                                        <Icon
                                            name={showConfirmPassword ? 'eye-off' : 'eye'}
                                            type="feather"
                                            onPress={toggleConfirmPasswordVisibility}
                                            color={placeHolderColor.color}
                                        />
                                    }
                                />

                            </ScrollView>

                            {/* FIXED Bottom Buttons */}
                            <View style={{ paddingBottom: 20 }}>
                                <MaterialButton
                                    title="Change Password"
                                    type="primary"
                                    iconName="lock"
                                    onPress={handleSubmit}
                                    loading={loading}
                                />
                                <MaterialButton
                                    type="secondary"
                                    title="Cancel"
                                    onPress={() => navigation.goBack()}
                                />
                            </View>

                        </View>
                    )}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
);
};

export default ChangePasswordScreen;
