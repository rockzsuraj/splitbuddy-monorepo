import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateGroupModal from "../Components/Group/createGroupModel/CreateGroupModal";
import MyGroup from "../Components/Group/Mygroup";
import EditTransaction from "../EditTransaction";
import EditGroupModal from "../Modal/EditGroupModal";
import Transactions from "../Transactions";
import { GroupStackParamList } from "./NavigationTypes";
import { useTheme } from "../Hooks/theme";

const GroupStack = createNativeStackNavigator<GroupStackParamList>();

export const GroupStackNav = () => {
    const theme = useTheme();

    return (
        <GroupStack.Navigator screenOptions={{
            animation: 'slide_from_bottom'
        }}>
            <GroupStack.Group screenOptions={{ headerShown: false }}>
                <GroupStack.Screen name="Groups" component={MyGroup} />
                <GroupStack.Screen name="Transactions" component={Transactions} />
            </GroupStack.Group>
            {/* Common modal screens */}
            <GroupStack.Group screenOptions={
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
                <GroupStack.Screen
                    name="CreateGroup"
                    component={CreateGroupModal}
                    options={
                        {
                            title: 'Create your group',
                            headerTitleAlign: 'center',
                        }
                    }

                />
                <GroupStack.Screen
                    name="EditGroup"
                    component={EditGroupModal}
                    options={
                        {
                            title: 'Edit your Group',
                            headerTitleAlign: 'center'
                        }
                    }

                />
                <GroupStack.Screen
                    name="EditTransaction"
                    component={EditTransaction}
                    options={
                        {
                            title: 'Edit your Group',
                            headerTitleAlign: 'center'
                        }
                    }
                />
            </GroupStack.Group>
        </GroupStack.Navigator>
    )
}