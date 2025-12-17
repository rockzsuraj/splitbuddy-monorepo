import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../Hooks/theme';
import BackButton from './BackButton';

const ModalHeader = ({ title, onClose }: { title?: string, onClose?: () => void }) => {
    const navigation = useNavigation();
    const theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            backgroundColor: theme.colors.background,
            paddingVertical: 10,
            marginBottom: 10
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 50,
            paddingHorizontal: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
            backgroundColor: theme.colors.background,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text
        },
    });

    return (
        <View style={styles.header}>
            <BackButton />
            <Text style={styles.title}>{title || ''}</Text>
            <View style={{ width: 24 }} />
        </View>
    );
};

export default ModalHeader;