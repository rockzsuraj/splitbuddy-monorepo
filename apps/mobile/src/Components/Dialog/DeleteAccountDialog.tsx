import {
    Button, Dialog, DialogActions, DialogContent, DialogHeader,
    useBoolean
} from "@react-native-material/core";

import React, { FC, useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppContext } from "../../Context/AppProvider";
import MaterialButton from "../MaterialButton";
import { CheckBox, useTheme } from "@rneui/themed";

interface Props {
    handleDelete: (deleteData: boolean) => Promise<void>;
    setIsDeleteAccount: React.Dispatch<React.SetStateAction<boolean>>;
    isDeleteAccount: boolean;
}

const DeleteAccountDialog: FC<Props> = ({
    handleDelete,
    isDeleteAccount
}) => {
    const { state: { user }, setErrorMessage, setSuccessMessage } = useContext(AppContext);
    const [visible, setVisible] = useState(false);
    const [check, setCheck] = useBoolean();
    const { theme } = useTheme();
    const onCancel = () => {
        setVisible(false)
    }

    const styles = StyleSheet.create({
        container: {
            padding: 20,
        },
        heading: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
        },
        subHeading: {
            fontSize: 16,
            marginBottom: 20,
        },
        sectionHeading: {
            fontSize: 18,
            fontWeight: 'bold',
            marginTop: 20,
            marginBottom: 10,
        },
        text: {
            fontSize: 16,
            marginBottom: 10,
        },
    });

    const displayName = user?.first_name + ' ' + user?.last_name;

    return (
        <View >
            <MaterialButton
                loading={isDeleteAccount}
                title='Delete account'
                onPress={() => setVisible(true)}
                type='secondary'
                iconName='delete'
            />
            <Dialog
                visible={visible}
                onDismiss={() => setVisible(!visible)}
            >
                <ScrollView>
                    <DialogHeader
                        title={`Dear ${displayName}`}
                    />
                    <DialogContent>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>We're sorry to see you go. </Text>
                        <Text style={{ fontSize: 14 }}>
                            You can come back and access your data.
                        </Text>
                    </DialogContent>
                    <CheckBox
                        checked={check}
                        title={"Do u want to delete your data also?"}
                        onPress={setCheck.toggle}
                        checkedColor={theme?.colors?.background}
                        uncheckedColor={theme?.colors?.secondary}
                        containerStyle={{
                            backgroundColor: theme?.colors?.background,
                        }}
                        textStyle={{ color: theme?.colors?.primary }}
                    />
                    {check && <View style={styles.container}>
                        <Text style={styles.text}>
                            Once the deletion process is complete, your account will be permanently
                            removed from our system.
                        </Text>
                        <Text style={styles.text}>
                            Please note that this action cannot be undone, and you will no longer
                            have access to your account or any associated data.
                        </Text>

                        <Text style={styles.sectionHeading}>Data that will be Deleted:</Text>
                        <Text style={styles.text}>
                            Profile Image: Your profile image will be permanently deleted from our
                            servers.
                        </Text>
                        <Text style={styles.text}>
                            Group Data: Any data associated with groups in which you are the sole
                            member will be removed.
                        </Text>
                        <Text style={styles.text}>
                            Email ID and Password: Your email ID and password will be deleted from
                            our system and will no longer be accessible.
                        </Text>
                    </View>}

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
                            onPress={() => handleDelete(check)}
                        />
                    </DialogActions>
                </ScrollView>
            </Dialog>
        </View>
    );
};

export default DeleteAccountDialog

const styles = StyleSheet.create({})