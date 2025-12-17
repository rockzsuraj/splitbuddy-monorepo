import {
    Button, Dialog, DialogActions, DialogContent, DialogHeader
} from "@react-native-material/core";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useNavigation } from "@react-navigation/native";
import React, { FC, useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Groups } from "../../../types";
import { AppContext } from "../../Context/AppProvider";
import { useTheme } from "../../Hooks/theme";

interface Props {
    group?: Groups
}

const RemoveGroupDialog: FC<Props> = ({
    group
}) => {
    const { state: { user }, setErrorMessage, setSuccessMessage } = useContext(AppContext);
    const navigation = useNavigation();
    const onCancel = () => {
        setVisible(false)
    }
    const [visible, setVisible] = useState(false);
    const theme = useTheme();
    const handleDeleteGroup = async (group?: Groups) => {
        try {
            if (user?.email !== group?.admin) {
                setErrorMessage('Only admin can delete the group!')
            }
            const res = await deleteGroup(group?.id);
            if (!!res) {
                setSuccessMessage('Group is successfully deleted!')
                navigation.navigate('Groups');
            }
        } catch (error) {
            setErrorMessage(error.response.data.error.message);
        }
    }

    return (
        <View >
            {/* <Button
                title="Delete Group"
                onPress={() => setVisible(true)}
                style={{ marginTop: 5, backgroundColor: 'red' }}
                contentContainerStyle={{ height: 80 }}
                titleStyle={{ color: 'white' }}
                leading={props => <Icon name="delete" {...props} size={30} color='white' />}
            /> */}
            <TouchableOpacity style={{
                // marginLeft: 25,
                paddingVertical: 15,
                paddingHorizontal: 10
            }} onPress={() => setVisible(true)}>
                <Icon name="delete" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Dialog
                visible={visible}
                onDismiss={() => setVisible(!visible)}
            >
                <DialogHeader title="Are you sure you want to delete below Group?" />
                <DialogContent >
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                        Group: {group?.name}
                    </Text>
                    <Text style={{ fontSize: 15 }}>
                        Description: {group?.description}
                    </Text>
                </DialogContent>
                <DialogActions>
                    <Button
                        title="Cancel"
                        compact
                        variant="text"
                        onPress={onCancel}
                    />
                    <Button
                        title="Delete"
                        compact
                        variant="text"
                        onPress={() => handleDeleteGroup(group)}
                    />
                </DialogActions>
            </Dialog>
        </View>
    );
};

export default RemoveGroupDialog

const styles = StyleSheet.create({})