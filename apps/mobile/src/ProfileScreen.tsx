import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ImagePickerResponse } from 'react-native-image-picker';
import DefaultProfile from './Components/DefaultProfile';
import DeleteAccountDialog from './Components/Dialog/DeleteAccountDialog';
import MaterialButton from './Components/MaterialButton';
import ScreenContainer from './Components/ScreenContainer';
import { AppContext } from './Context/AppProvider';
import ProfileList from './ProfileList';
import { deleteUser, logoutUser, uploadAvatar } from './api/services/authservice';
import { handleChoosePhoto, logError } from './utils/utils';
import { useTheme } from './Hooks/theme';

const ProfileScreen = () => {
    const { state: { user, loading }, setErrorMessage, setSuccessMessage, setLoading, setUser } = useContext(AppContext);
    const theme = useTheme();
    const [isDeleteAccount, setIsDeleteAccount] = useState(false);
    const [uploading, setUploading] = useState(false);

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.colors.background,
            paddingTop: 20,
            paddingHorizontal: 18,
            flex: 1,
        },
        profileCard: {
            backgroundColor: theme.colors.card,
            paddingVertical: 30,
            paddingHorizontal: 20,
            borderRadius: 20,
            alignItems: 'center',
            marginVertical: 10,
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 10,
            elevation: 5,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 6,
        },
        labelText: {
            fontSize: 16,
            color: theme.colors.secondaryText,
            marginLeft: 8,
        },
        nameText: {
            fontSize: 22,
            fontWeight: '700',
            color: theme.colors.text,
            marginTop: 14,
        },
        section: {
            marginTop: 16,
            backgroundColor: theme.colors.card,
            padding: 15,
            borderRadius: 18,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 4,
        },
        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '700',
            marginLeft: 8,
            color: theme.colors.text,
        },
        bottomActions: {
            marginTop: 30,
            marginBottom: 40,
        },
    });

    const signOut = async () => {
        try {
            setLoading(true);
            await logoutUser();
            setUser(null);
            setSuccessMessage(`You are successfully signed out!`);
        } catch (error: any) {
            logError('Error during sign out:', error);
            setErrorMessage(error.response?.data?.error?.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleteAccount(true);
            await deleteUser();
            setUser(null);
            setSuccessMessage(`Your account has been deleted successfully!`);
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error?.message);
        } finally {
            setIsDeleteAccount(false);
        }
    };

    const handleUpload = async (image: ImagePickerResponse) => {
        try {
            setUploading(true);
            const asset = image?.assets ? image.assets[0] : null;
            if (!asset) {
                setErrorMessage('No image selected');
                return;
            }

            const result = await uploadAvatar({
                uri: asset.uri,
                fileName: asset.fileName,
                type: asset.type
            });

            console.log('result', result);


            setUser(result.user);
            setSuccessMessage('Profile image updated');
        } catch (err) {
            logError(err);
            setErrorMessage('Failed to upload image');
        } finally {
            setUploading(false);
        }
    }

    const setProfileImg = async () => {
        const img = await handleChoosePhoto()
        console.log('img', img);


        if (!img?.assets) {
            return
        }

        await handleUpload(img)
    }

    const displayName = `${user?.first_name} ${user?.last_name}`;

    return (
        <ScreenContainer isScroll={true}>
            <View style={styles.container}>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <TouchableOpacity onPress={() => setProfileImg()}>
                        <DefaultProfile uri={user?.image_url || ''} loading={uploading} />
                    </TouchableOpacity>

                    <Text style={styles.nameText}>{displayName}</Text>

                    {/* Username Row */}
                    <View style={styles.row}>
                        <Ionicons name="person-circle-outline" size={20} color={theme?.colors.text} />
                        <Text style={[styles.labelText]}>{user?.username}</Text>
                    </View>

                    {/* Email Row */}
                    <View style={styles.row}>
                        <Ionicons name="mail-outline" size={20} color={theme?.colors.text} />
                        <Text style={styles.labelText}>{user?.email}</Text>
                    </View>
                </View>

                {/* Settings Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="settings-outline" size={22} color={theme?.colors.text} />
                        <Text style={styles.sectionTitle}>Settings</Text>
                    </View>

                    <View key="profile-list">
                        <ProfileList key="profile-settings-list"/>
                    </View>
                </View>

                {/* Buttons */}
                <View style={styles.bottomActions}>
                    <MaterialButton
                        loading={loading}
                        title="Sign out"
                        onPress={signOut}
                        type="primary"
                        iconName="logout"
                    />
                </View>

                <DeleteAccountDialog
                    handleDelete={handleDelete}
                    isDeleteAccount={isDeleteAccount}
                    setIsDeleteAccount={setIsDeleteAccount}
                />
            </View>
        </ScreenContainer>
    );
};

export default ProfileScreen;