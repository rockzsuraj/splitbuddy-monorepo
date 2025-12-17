import React, { FC } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import globalStyles from '../global/globalStyles';
import { useTheme } from '../Hooks/theme';

interface Props {
    title: string;
    onPress: () => void;
    type: 'primary' | 'secondary',
    disabled?: boolean,
    isLoading?: boolean
}

const CTAButton: FC<Props> = ({ title, onPress, type, disabled, isLoading }) => {
    const theme = useTheme();

    const handlePress = () => {
        if (onPress) {
            onPress();
        }
    }

    return (
        <>
            {type === 'primary' ? (
                <TouchableOpacity
                    disabled={disabled}
                    style={
                        [
                            globalStyles.button,
                            { backgroundColor: theme.colors.text }
                        ]
                    } onPress={handlePress}>
                    {isLoading ? <>
                        <ActivityIndicator size={25} color={theme.colors.background} />
                    </>
                        : <Text style={
                            [
                                globalStyles.secondaryButtonText,
                                {
                                    color: theme.colors.background,
                                    opacity: disabled ? 0.5 : 1
                                }
                            ]
                        }>
                            {title}
                        </Text>}
                </TouchableOpacity>) : (
                <TouchableOpacity
                    disabled={disabled || isLoading}
                    style={
                        [
                            globalStyles.button,
                            {
                                borderColor: theme.colors.text
                            }
                        ]
                    }
                    onPress={handlePress}>
                    {isLoading ? <>
                        <ActivityIndicator size={25} color={theme.colors.background} />
                    </> :
                        <Text style={[
                            globalStyles.buttonText,
                            { color: theme.colors.text }
                        ]}>{title}</Text>
                    }
                </TouchableOpacity>
            )
            }
        </>
    )
}

export default CTAButton

const styles = StyleSheet.create({})