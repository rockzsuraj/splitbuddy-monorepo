// import firestore from '@react-native-firebase/firestore';
import { Provider } from '@react-native-material/core';
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GroupMember } from '../../types';
import EditGroupForm from '../Components/Group/EditGroupForm';
import MemberList from '../Components/ListItems/MemberList';
import ModalHeader from '../Components/ModalHeader';
import ErrorSnackBar from '../Components/SnackBar/ErrorSnackBar';
import { AppContext } from '../Context/AppProvider';
import { GroupStackParamList } from '../Navigation/NavigationTypes';
import globalStyles from '../global/globalStyles';
import { useTheme } from '../Hooks/theme';
// import { removeMember } from '../utils/firebaseUtils';

type GroupScreenRouteProp = RouteProp<GroupStackParamList, 'EditGroup'>;

export type GroupScreenProps = {
    route: GroupScreenRouteProp;
    navigation: NavigationProp<GroupStackParamList, 'EditGroup'>;
};

const EditGroupModal = (props: GroupScreenProps) => {
    const [memberId, setMemberId] = useState<string>('');
    const navigation = useNavigation();
    const group = props?.route?.params;
    const theme = useTheme();
    const { state, setErrorMessage, setSuccessMessage } = useContext(AppContext);
    const [groupMember, setGroupMemberData] = useState<any[]>();
    const [error, setError] = useState('');

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.colors.background,
            paddingTop: 20
        },
        modal: {
            // backgroundColor: theme.colors.background,
            borderRadius: 10,
            padding: 20,
            // shadowColor: '#000',
            // shadowOffset: {
            //     width: 0,
            //     height: 2,
            // },
            // shadowOpacity: 0.25,
            // shadowRadius: 4,
            // elevation: 5,
        },
        input: {
            width: '100%',
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
            marginBottom: 20,
        },
        button: {
            width: '100%',
            height: 40,
            backgroundColor: '#2196F3',
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonText: {
            fontSize: 16,
        },
    });


    function handleClose() {
        navigation.goBack();
    }

    useEffect(() => {
        const groupRef = firestore().collection('groups').doc(group?.id);
        const unsubscribe = groupRef.onSnapshot((doc) => {
            const groupData = doc.data();
            if (groupData && groupData.groupMember)
                setGroupMemberData(groupData.groupMember);
        });
        return () => unsubscribe();
    }, []);
    const onRemove = async (member: GroupMember) => {
        try {
            if (member.id === group?.admin) {
                setErrorMessage('You are admin.If you want to leave delete the group!');
            } else if (group && group.id && member.id && member.name) {
                // await removeMember(group.id, member.id, member.name, member?.photoUrl);
                setSuccessMessage('You have removed one user!');
            }
        } catch (error) {
            setErrorMessage(error.response.data.error.message);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }} key={group?.id}>
            <Provider>
                <ModalHeader title={group?.name} />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View>
                        <EditGroupForm group={group} navigation={props.navigation} route={props.route} />
                    </View>
                    <View style={styles.modal}>
                        <View style={{ marginTop: 20 }}>
                            <Text
                                style={
                                    [
                                        globalStyles.infoText,
                                        { color: theme.colors.text }
                                    ]}>
                                Group members
                            </Text>
                            <MemberList groupMember={groupMember} onPress={onRemove} />
                        </View>
                    </View>
                </ScrollView>
                {Platform.OS === 'ios' && <ErrorSnackBar message={error} />}
            </Provider>
        </View>
    );
};

export default EditGroupModal;
