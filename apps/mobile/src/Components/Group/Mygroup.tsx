import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { GroupStackParamList } from '../../Navigation/NavigationTypes';
import { useTheme } from '../../Hooks/theme';
import WelcomeBanner from '../Banner/WelcomeBanner';
import ScreenContainer from '../ScreenContainer';
import Group from './Group';

type MyGroupScreenRouteProp = RouteProp<GroupStackParamList, 'Groups'>;

type MyGroupScreenProps = {
    route: MyGroupScreenRouteProp;
    navigation: NavigationProp<GroupStackParamList, 'Groups'>;
};

const MyGroup = ({ navigation, route }: MyGroupScreenProps) => {
    const theme = useTheme();

    return (
        <ScreenContainer>
            <WelcomeBanner />
            <Text style={[styles.title, { color: theme.colors.highlightedText }]}>Group budget</Text>
            <Group navigation={navigation} route={route} />
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    groupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    groupInfoContainer: {
        flex: 1,
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    groupDescription: {
        fontSize: 16,
        color: '#888',
    },
    addButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        fontSize: 16,
    },
    error: {
        color: 'red',
        fontSize: 14,
        marginTop: 4,
    },
    suggestionContainer: {
        marginBottom: 16,
    },
    suggestionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    suggestionList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    suggestionButton: {
        backgroundColor: '#2196F3',
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 100,
        marginBottom: 8,
    },
    suggestionName: {
        color: '#fff',
        marginTop: 8,
        fontSize: 18,
        fontWeight: 'bold',
    },
    createButton: {
        backgroundColor: '#2196F3',
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default MyGroup;