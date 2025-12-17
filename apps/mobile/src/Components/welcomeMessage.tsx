import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../Hooks/theme';

interface Props {
    title: string,
    subtitle: string
}

const WelcomeMessage: FC<Props> = ({ subtitle, title }) => {

    const theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            padding: 20,
            borderRadius: 10,
            backgroundColor: theme.colors.secondaryBackGround
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
            color: theme.colors.text,
            textAlign: 'center'
        },
        subtitle: {
            fontSize: 18,
            lineHeight: 24,
            color: theme.colors.text,
            textAlign: 'center'
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>
                {subtitle}
            </Text>
        </View>
    );
};


export default WelcomeMessage;
