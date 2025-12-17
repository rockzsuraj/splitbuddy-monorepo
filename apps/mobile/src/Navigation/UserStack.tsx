import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChangePasswordModal from "../Modal/ChangePasswordModal";
import ProfileScreen from "../ProfileScreen";
import { useTheme } from "../Hooks/theme";
import { UserParamList } from "./types";
import EditProfileModel from "../Modal/EditProfile";

const UserStack = createNativeStackNavigator<UserParamList>();

export const UserStackNav = () => {
    const theme = useTheme();

    return (
        <UserStack.Navigator screenOptions={{
            animation: 'slide_from_bottom'
        }}>
            <UserStack.Group screenOptions={{ headerShown: false }}>
                <UserStack.Screen name="Profile" component={ProfileScreen} />
            </UserStack.Group>
            {/* Common modal screens */}
            <UserStack.Group screenOptions={
                {
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                    headerTintColor: theme.colors.text,
                    headerStyle: {
                        backgroundColor: theme.colors.background,
                    },
                    headerShown: false
                }
            }>
                <UserStack.Screen
                    name="ChangePassword"
                    component={ChangePasswordModal}
                    options={
                        {
                            title: 'Change your password',
                            headerTitleAlign: 'center'
                        }
                    }

                />
                <UserStack.Screen
                    name="updateProfile"
                    component={EditProfileModel}
                    options={
                        {
                            title: 'update your profile',
                            headerTitleAlign: 'center'
                        }
                    }

                />
            </UserStack.Group>
        </UserStack.Navigator>
    )
}