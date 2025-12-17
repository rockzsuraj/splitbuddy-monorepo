import React, { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../Hooks/theme';

interface Props {
    title: string,
    onPress: () => void;
}

const FloatingButton: FC<Props> = ({
    title,
    onPress
}) => {
    const theme = useTheme();
    const handlePress = () => {
        if (onPress) {
            onPress();
        }
    }

    return (
        <TouchableOpacity
            style={[styles.fab, { backgroundColor: theme.colors.highlightedText }]} onPress={handlePress}>
            <MaterialIcons name="add" size={24} color={theme.colors.background} />
            <Text style={[styles.groupDescription, { color: theme.colors.background }]}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

export default FloatingButton

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        // padding: 10,
    },
    groupList: {
        flex: 1,
    },
    groupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    groupIcon: {
        marginRight: 10,
    },
    groupContent: {
        flex: 1,
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    groupDescription: {
        fontSize: 14,
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007AFF',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 15
    },
});
