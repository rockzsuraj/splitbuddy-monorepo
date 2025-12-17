import {
    Button, Dialog, DialogActions, DialogContent, DialogHeader
} from "@react-native-material/core";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import React, { FC, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GroupMember } from "../../../types";

interface Props {
    onRemove: (member: GroupMember) => void;
    member: GroupMember
}

const RemoveMemberDialog: FC<Props> = ({
    member,
    onRemove
}) => {
    const onCancel = () => {
        setVisible(false)
    }
    const [visible, setVisible] = useState(false);
    const handleRemove = (member: GroupMember) => {
        if (onRemove) {
            onRemove(member)
            onCancel();
        }
    }

    return (
        <View>
            <Button
                title="Remove Member"
                onPress={() => setVisible(true)}
                style={{ marginTop: 5, backgroundColor: 'red' }}
                contentContainerStyle={{ height: 80 }}
                titleStyle={{ color: 'white' }}
                leading={props => <Icon name="delete" {...props} size={30} color='white' />}
            />
            <Dialog visible={visible} onDismiss={() => setVisible(!visible)}>
                <DialogHeader title="Are you sure you want to remove below member!" />
                <DialogContent>
                    <Text>
                        {member.name}
                    </Text>
                    <Text>
                        {member.id}
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
                        title="Remove"
                        compact
                        variant="text"
                        onPress={() => handleRemove(member)}
                    />
                </DialogActions>
            </Dialog>
        </View>
    );
};

export default RemoveMemberDialog

const styles = StyleSheet.create({})