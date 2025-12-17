import React, { useState, useEffect } from 'react';
import { Image, useColorScheme, StyleSheet } from 'react-native';
const useAppImage = () => {
    const [image, setImage] = useState(null);
    const colorScheme = useColorScheme();

    useEffect(() => {
        setImage(colorScheme === 'dark' ? require('../../assets/images/appDark.png') : require('../../assets/images/app.png'));
    }, [colorScheme]);

    return { image };

};

export default useAppImage;
