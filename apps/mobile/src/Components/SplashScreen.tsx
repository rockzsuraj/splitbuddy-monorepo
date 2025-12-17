import React from 'react';
import { Image, StyleSheet, useColorScheme, Text } from 'react-native';
import globalStyles from '../global/globalStyles';
import useAppImage from '../Hooks/useAppImage';
import { useTheme } from '../Hooks/theme';
import ScreenContainer from './ScreenContainer';


const SplashScreen = () => {
    const theme = useTheme();
    const { image } = useAppImage();

    return (
        <ScreenContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
            {image && <Image source={image} style={styles.image} />}
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
});

export default SplashScreen;
