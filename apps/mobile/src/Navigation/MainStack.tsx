import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../Hooks/theme';
import { GroupStackNav } from './GroupStack';
import { UserTabParamList } from './NavigationTypes';
import { UserStackNav } from './UserStack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const MainTab = createBottomTabNavigator<UserTabParamList>();

export const MainStack = () => {
    const theme = useTheme();
    
    const tabBarStyle = {
        backgroundColor: theme.colors.secondaryBackGround,
        // overflow: 'hidden',
        elevation: 0,
        height: 72,
        borderTopColor: theme.colors.border,
        borderTopWidth: 1,
        borderBlockColor: 'transparent',
        paddingBottom: 10,
        paddingTop: 10,
    };

    return (
        <MainTab.Navigator 
            screenOptions={{
                headerShown: false,
                tabBarStyle: tabBarStyle,
                tabBarActiveTintColor: theme.colors.primaryCard,
                tabBarInactiveTintColor: theme.colors.text || '#8E8E93',
                animation: 'shift', // 👈 Smoother than 'shift'
                lazy: true, // 👈 Prevents pre-loading heavy stacks
            }}
        >
            <MainTab.Screen
                name="GroupStack"
                component={GroupStackNav}
                options={{
                    tabBarLabel: 'Group',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons 
                            name="account-group" 
                            color={color} 
                            size={focused ? 24 : 20} 
                        />
                    ),
                }}
            />
            <MainTab.Screen
                name="UserStack"
                component={UserStackNav}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons 
                            name="account" 
                            color={color} 
                            size={focused ? 26 : 20} 
                        />
                    ),
                }}
            />
        </MainTab.Navigator>
    );
};
