import { NavigationProp, RouteProp, useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { AppContext } from '../../Context/AppProvider';
import { GroupStackParamList } from '../../Navigation/NavigationTypes';
import FloatingButton from '../Button/FloatingButton';
import WelcomeMessage from '../welcomeMessage';
import GroupList from './GroupList';
import { useUserGroups } from '../../api/hooks/useGroups';
import { Group } from '../../../types/group';



type GroupScreenRouteProp = RouteProp<GroupStackParamList, 'Groups'>;

type GroupScreenProps = {
    route: GroupScreenRouteProp;
    navigation: NavigationProp<GroupStackParamList, 'Groups'>;
};


const Groups = ({ navigation }: GroupScreenProps) => {
    const { state: { user } } = useContext(AppContext)
    const [pullRefreshing, setPullRefreshing] = React.useState(false);

    const {
        data,
        refetch,
        isRefetching,
        isLoading,
    } = useUserGroups(String(user?.id));
    const groups = data?.data?.group || [];

    const handleCreateGroup = () => {
        navigation.navigate('CreateGroup')
    }

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    const handleGroupAndTransaction = (group: Group) => {
        navigation.navigate('Transactions', { group: group });
    }
    const handleManualRefresh = async () => {
        setPullRefreshing(true);
        await refetch();
        setPullRefreshing(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.groupList}
                refreshControl={
                    <RefreshControl
                        refreshing={pullRefreshing}
                        onRefresh={handleManualRefresh}
                    />
                }
            >
                {groups?.length === 0 ? (
                    <WelcomeMessage
                        title="Looks like you don't have any groups to add transactions yet."
                        subtitle="Don't worry, creating a group is easy and you can invite your friends and family to join. Simply click the 'Create Group' button to get started. Once you have a group, you can start adding transactions and sharing them with your group members. Happy sharing!"
                    />
                ) : (
                    <GroupList
                        group={groups}
                        handleGroupAndTransaction={handleGroupAndTransaction}
                    />
                )}
            </ScrollView>
            <FloatingButton
                title='Create Group'
                onPress={handleCreateGroup}
            />
        </View>
    );
};

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

export default Groups;
