import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import CTAButton from './Components/CTAButton';
import ContactInfo from './Components/ContactInfo';
import ScreenContainer from './Components/ScreenContainer';
import WelcomeMessage from './Components/welcomeMessage';
import useAppImage from './Hooks/useAppImage';
import globalStyles from './global/globalStyles';
import { useTheme } from './Hooks/theme';
// import {
//     GoogleSignin,
//     GoogleSigninButton,
//     statusCodes,
// } from '@react-native-google-signin/google-signin';
// import auth from '@react-native-firebase/auth';
// import { createUserDocument } from './utils/firebaseUtils';


const WelcomeScreen = () => {
    const navigation = useNavigation();

    const handleSignInPress = () => {
        navigation.navigate('SignIn');
    };

    const handleSignUpPress = () => {
        navigation.navigate('SignUp');
    };

    const handleGoogleSignInPress = async () => {
        // try {
        //     await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        //     const { idToken } = await GoogleSignin.signIn();

        //     // Create a Google credential with the ID token
        //     const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        //     await auth().signInWithCredential(googleCredential);
        //     const user = auth().currentUser;
        //     if (user !== null) {
        //         createUserDocument(user);
        //     }
        // } catch (error) {
        //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        //         // user cancelled the login flow
        //     } else if (error.code === statusCodes.IN_PROGRESS) {
        //         // operation (e.g. sign in) is in progress already
        //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        //         // play services not available or outdated
        //     } else {
        //         // some other error happened
        //     }
        // }

    };

    const { image } = useAppImage();
    const theme = useTheme();

    const styles = StyleSheet.create({
    container: {
    },
    icon: {
        width: '60%',
        height: undefined,
        aspectRatio: 1,
    },
    buttonContainer: {
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signInButton: {
        backgroundColor: '#2196F3',
        borderRadius: 5,
        // paddingVertical: 10,
        // paddingHorizontal: 30,
        marginVertical: 10
    },
    signUpButton: {
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginVertical: 10,
    },
    googleSignInButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginVertical: 10,
        borderColor: '#E0E0E0',
    },
    buttonText: {
        color: theme?.colors?.text,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    googleSignInIcon: {
        width: '100%',
        height: undefined,
        aspectRatio: 5,
    },
    GoogleButtonContainer: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});


    return (
        <ScreenContainer
            isScroll={true}
            contentContainerStyle={styles.container}
        >
            <View style={[globalStyles.imageContainer, { flex: 1 }]}>
                {image && <Image source={image} style={styles.icon} resizeMode="contain" />}
                <WelcomeMessage
                    title='Welcome to SplitBuddy!'
                    subtitle='Start managing your expenses with ease by creating groups and sharing transactions with your friends and family.' />
            </View>
            <View style={{ height: 230 }}>
                <CTAButton type='primary' title='Sign in' onPress={handleSignInPress} />
                <CTAButton type='secondary' title='Sign up' onPress={handleSignUpPress} />
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    {/* <GoogleSigninButton
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Dark}
                        onPress={handleGoogleSignInPress}
                    /> */}
                </View>

                <View style={{ paddingVertical: 20 }}>
                    <ContactInfo />
                </View>
            </View>
        </ScreenContainer>
    );
};

export default WelcomeScreen;
