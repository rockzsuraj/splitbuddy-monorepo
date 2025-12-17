import { Button } from '@react-native-material/core';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import globalStyles from '../global/globalStyles';
import { useTheme } from '../Hooks/theme';

interface Props {
    title: string;
    onPress: () => void;
    type: 'primary' | 'secondary',
    disabled?: boolean,
    loading?: boolean,
    error?: boolean,
    iconName?: string
}

const MaterialButton: FC<Props> = ({ title, onPress, type, disabled, loading, iconName, error }) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            // flex: 1,
            // width: '100%'
        },
        secondaryButton: {
            width: '100%',
            marginTop: 10,
            borderWidth: 1,
            borderColor: theme.colors.text,
            paddingVertical: 2
        },
        primaryButton: {
            width: '100%',
            marginTop: 10,
            backgroundColor: theme.colors.text,
            borderWidth: 1,
            borderColor: theme.colors.text,
            paddingVertical: 2
        }
    });

    const handlePress = () => {
        if (onPress) {
            onPress();
        }
    }

    return (
        <>
            {type === 'primary' ? (
                <Button
                    disabled={disabled}
                    loading={loading}
                    onPress={handlePress}
                    title={title}
                    leading={props => iconName && <Icon name={iconName} {...props} color={theme.colors.background} />}
                    style={styles.primaryButton}
                    titleStyle={[globalStyles.buttonText, { color: theme.colors.background }]}
                    contentContainerStyle={styles.container}
                />
            ) : (
                <Button
                    disabled={disabled}
                    loading={loading}
                    variant={error ? 'contained' : 'outlined'}
                    title={title}
                    leading={props => iconName && <Icon name={iconName} {...props} color={theme.colors.text} />}
                    style={styles.secondaryButton}
                    titleStyle={[globalStyles.buttonText, { color: theme.colors.text }]}
                    onPress={handlePress}
                    contentContainerStyle={styles.container}
                />
            )
            }
        </>
    )
}

export default MaterialButton;


