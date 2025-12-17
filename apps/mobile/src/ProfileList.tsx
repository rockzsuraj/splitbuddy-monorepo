import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from './Hooks/theme';

const ProfileList = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    
    const list = [
        {
            icon: 'lock',
            title: 'Change password',
            navigate: 'ChangePassword',
            id: 'password',
            disabled: false
        },
        {
            icon: 'account-edit',
            title: 'Update profile',
            navigate: 'updateProfile',
            id: 'updateProfile',
            disabled: false
        }
    ];

    const handlePress = (route: string) => {
        navigation.navigate(route as never);
    };

    const listItemStyle = (theme: any) => ({
        marginTop: 10,
        backgroundColor: theme.colors.secondaryBackGround,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    });

    const titleStyle = (theme: any) => ({
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
        marginLeft: 16,
    });

    return (
        <>
            {list.map((item) => (
                <TouchableOpacity
                    key={item.id}
                    disabled={item.disabled}
                    style={listItemStyle(theme)}
                    onPress={() => handlePress(item.navigate)}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons 
                        name={item.icon as any} 
                        size={24}
                        color={theme.colors.text} 
                    />
                    <Text style={titleStyle(theme)}>
                        {item.title}
                    </Text>
                    <MaterialCommunityIcons 
                        name="chevron-right" 
                        size={24}
                        color={theme.colors.text} 
                    />
                </TouchableOpacity>
            ))}
        </>
    );
};

export default ProfileList;
const styles = StyleSheet.create({});