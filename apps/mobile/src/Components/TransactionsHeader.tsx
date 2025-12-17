import { NavigationProp, RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    TextInput,
    Pressable,
    FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GroupStackParamList } from '../Navigation/NavigationTypes';
import globalStyles from '../global/globalStyles';
import { useTheme } from '../Hooks/theme';
import { Group } from '../../types/group';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';


type RouteProps = RouteProp<GroupStackParamList, 'Transactions'>;

type Props = {
    route: RouteProps;
    navigation: NavigationProp<GroupStackParamList, 'Transactions'>;
    group?: Group;
    onPressBack?: () => void;
    onDeleteGroup?: (group: Group) => void;
    onAddMember?: (group: Group, member: { email: string }) => Promise<void>;
    onRemoveMember?: (group: Group, memberId: string) => Promise<void>;
    onPressAddTransaction?: () => void;
    onUpdateGroup?: (group: Group, updates: Partial<Group>) => Promise<void>;
};

const TransactionsHeader: React.FC<Props> = ({
    navigation,
    group,
    onPressBack,
    onDeleteGroup,
    onAddMember,
    onRemoveMember,
    onPressAddTransaction,
    onUpdateGroup,
}) => {
    const theme = useTheme();
    const styles = makeStyles(theme);

    const [deleteVisible, setDeleteVisible] = useState(false);
    const [addMemberVisible, setAddMemberVisible] = useState(false);
    const [memberEmail, setMemberEmail] = useState('');
    const [removeMemberVisible, setRemoveMemberVisible] = useState(false);
    const [selectedMemberToRemove, setSelectedMemberToRemove] = useState<number | null>(null);
    const [optionsVisible, setOptionsVisible] = useState(false);
    const [updateGroupVisible, setUpdateGroupVisible] = useState(false);
    const [updatedGroupName, setUpdatedGroupName] = useState(group?.group_name || '');
    const [updatedGroupDescription, setUpdatedGroupDescription] = useState(group?.description || '');
    const [showMembers, setShowMembers] = useState(false);

    const handlePressBack = () => {
        if (onPressBack) {
            onPressBack();
        } else {
            navigation.goBack();
        }
    };

    const handleConfirmDelete = () => {
        if (group && onDeleteGroup) {
            onDeleteGroup(group);
        }
        setDeleteVisible(false);
        navigation.goBack();
    };

    const handleSubmitAddMember = async () => {
        if (onAddMember && group) {
            await onAddMember(group, { email: memberEmail })
        }
        setMemberEmail('');
        setAddMemberVisible(false);
    };

    const handleSubmitUpdateGroup = async () => {
        if (onUpdateGroup && group && updatedGroupName.trim()) {
            await onUpdateGroup(group, {
                group_name: updatedGroupName,
                description: updatedGroupDescription,
            });
            setUpdateGroupVisible(false);
        }
    };

    const handleConfirmRemoveMember = async () => {
        if (onRemoveMember && group && selectedMemberToRemove) {
            await onRemoveMember(group, String(selectedMemberToRemove));
            setRemoveMemberVisible(false);
            setSelectedMemberToRemove(null);
        }
    };

    const handleSelectOption = (option: 'addTransaction' | 'addMember' | 'removeMember' | 'delete' | 'updateGroup' | 'showMembers' | 'cancel') => {
        setOptionsVisible(false);
        switch (option) {
            case 'addTransaction':
                onPressAddTransaction && onPressAddTransaction();
                break;
            case 'addMember':
                setAddMemberVisible(true);
                break;
            case 'removeMember':
                setSelectedMemberToRemove(null);
                setRemoveMemberVisible(true);
                break;
            case 'updateGroup':
                setUpdatedGroupName(group?.group_name || '');
                setUpdatedGroupDescription(group?.description || '');
                setUpdateGroupVisible(true);
                break;
            case 'showMembers':
                setShowMembers(true);
                break;
            case 'delete':
                setDeleteVisible(true);
                break;
            case 'cancel':
            default:
                break;
        }
    };

    console.log('group **', group);
    

    const members = group?.members || [];
    console.log('members **', members);
    

    return (
        <>
            {/* HEADER */}
            <View style={styles.headerContainer}>
                {/* Left: Back */}
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handlePressBack}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Icon name="arrow-back-ios" size={20} color={theme.colors.text} />
                </TouchableOpacity>

                {/* Center: Group info */}
                <View style={styles.centerContent}>
                    <View style={styles.groupRow}>
                        <View style={styles.groupIconWrapper}>
                            <Icon
                                name={group?.group_icon || 'groups'}
                                size={20}
                                color={theme.colors.text}
                            />
                        </View>
                        <View style={styles.groupTextWrapper}>
                            <Text
                                numberOfLines={1}
                                style={[
                                    globalStyles.modalTitle,
                                    styles.groupTitle,
                                    { color: theme.colors.text },
                                ]}
                            >
                                {group?.group_name || 'Group'}
                            </Text>
                            <Text
                                numberOfLines={1}
                                style={[styles.groupSubtitle, { color: theme.colors.textSecondary }]}
                            >
                                {members.length} member{members.length !== 1 ? 's' : ''}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Overflow menu: single 3-dots button */}
                <View style={styles.rightActions}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => setOptionsVisible(true)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Icon name="more-vert" size={22} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* OPTIONS MENU */}
            <Modal
                transparent
                visible={optionsVisible}
                animationType="fade"
                onRequestClose={() => setOptionsVisible(false)}
            >
                <Pressable style={styles.modalBackdrop} onPress={() => setOptionsVisible(false)}>
                    <View style={styles.optionsMenuContainer}>
                        {onPressAddTransaction && (
                            <TouchableOpacity
                                style={styles.optionsMenuItem}
                                onPress={() => handleSelectOption('addTransaction')}
                            >
                                <View style={styles.optionsMenuItemContent}>
                                    <MCIcon name='currency-inr' size={18} color={theme.colors.text} style={styles.optionsMenuIcon} />
                                    <Text style={styles.optionsMenuText}>Add transaction</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={styles.optionsMenuItem}
                            onPress={() => handleSelectOption('showMembers')}
                        >
                            <View style={styles.optionsMenuItemContent}>
                                <Icon name="group" size={18} color={theme.colors.text} style={styles.optionsMenuIcon} />
                                <Text style={styles.optionsMenuText}>View members</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.optionsMenuItem}
                            onPress={() => handleSelectOption('addMember')}
                        >
                            <View style={styles.optionsMenuItemContent}>
                                <Icon name="group-add" size={18} color={theme.colors.text} style={styles.optionsMenuIcon} />
                                <Text style={styles.optionsMenuText}>Add member</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.optionsMenuItem}
                            onPress={() => handleSelectOption('removeMember')}
                        >
                            <View style={styles.optionsMenuItemContent}>
                                <Icon name="remove-circle-outline" size={18} color={theme.colors.text} style={styles.optionsMenuIcon} />
                                <Text style={styles.optionsMenuText}>Remove member</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.optionsMenuItem}
                            onPress={() => handleSelectOption('updateGroup')}
                        >
                            <View style={styles.optionsMenuItemContent}>
                                <Icon name="edit" size={18} color={theme.colors.text} style={styles.optionsMenuIcon} />
                                <Text style={styles.optionsMenuText}>Edit group</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.optionsMenuItemDanger}
                            onPress={() => handleSelectOption('delete')}
                        >
                            <View style={styles.optionsMenuItemContent}>
                                <Icon name="delete-outline" size={18} color={theme.colors.notification} style={styles.optionsMenuIconDanger} />
                                <Text style={styles.optionsMenuTextDanger}>Delete group</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.optionsMenuItem}
                            onPress={() => handleSelectOption('cancel')}
                        >
                            <View style={styles.optionsMenuItemContent}>
                                <Icon name="close" size={18} color={theme.colors.textSecondary} style={styles.optionsMenuIcon} />
                                <Text style={[styles.optionsMenuText, { color: theme.colors.textSecondary }]}>Cancel</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            {/* DELETE CONFIRM DIALOG */}
            <Modal
                transparent
                visible={deleteVisible}
                animationType="fade"
                onRequestClose={() => setDeleteVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.dialogCard}>
                        <Text style={[styles.dialogTitle, { color: theme.colors.text }]}>
                            Delete group?
                        </Text>
                        <Text style={[styles.dialogText, { color: theme.colors.textSecondary }]}>
                            This will remove the group and all its transactions. This action cannot be undone.
                        </Text>

                        <View style={styles.dialogActions}>
                            <Pressable
                                style={[styles.dialogButton, styles.dialogButtonSecondary]}
                                onPress={() => setDeleteVisible(false)}
                            >
                                <Text style={{ color: theme.colors.text }}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.dialogButton, styles.dialogButtonDanger]}
                                onPress={handleConfirmDelete}
                            >
                                <Text style={{ color: '#fff' }}>Delete</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* ADD MEMBER MODAL */}
            <Modal
                transparent
                visible={addMemberVisible}
                animationType="slide"
                onRequestClose={() => setAddMemberVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.bottomSheet}>
                        <View style={styles.sheetHandle} />
                        <Text style={[styles.dialogTitle, { color: theme.colors.text }]}>
                            Add member
                        </Text>
                        <Text style={[styles.dialogText, { color: theme.colors.textSecondary }]}>
                            Invite a friend to this group.
                        </Text>
                        <TextInput
                            value={memberEmail}
                            onChangeText={setMemberEmail}
                            placeholder="Email"
                            keyboardType="email-address"
                            placeholderTextColor={theme.colors.textSecondary}
                            style={[
                                styles.input,
                                {
                                    color: theme.colors.text,
                                    borderColor: theme.colors.border,
                                    backgroundColor: theme.colors.card,
                                },
                            ]}
                        />

                        <View style={styles.dialogActions}>
                            <Pressable
                                style={[styles.dialogButton, styles.dialogButtonSecondary]}
                                onPress={() => {
                                    setAddMemberVisible(false);
                                    setMemberEmail('');
                                }}
                            >
                                <Text style={{ color: theme.colors.text }}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.dialogButton,
                                    {
                                        backgroundColor: theme.colors.button,
                                        opacity: memberEmail.trim() ? 1 : 0.7,
                                    },
                                ]}
                                onPress={handleSubmitAddMember}
                                disabled={!memberEmail.trim()}
                            >
                                <Text style={{ color: '#fff' }}>Add</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* REMOVE MEMBER MODAL */}
            <Modal
                transparent
                visible={removeMemberVisible}
                animationType="slide"
                onRequestClose={() => setRemoveMemberVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.bottomSheet}>
                        <View style={styles.sheetHandle} />
                        <Text style={[styles.dialogTitle, { color: theme.colors.text }]}>
                            Remove member
                        </Text>
                        <Text style={[styles.dialogText, { color: theme.colors.textSecondary }]}>
                            Select a member to remove from the group.
                        </Text>

                        <FlatList
                            data={members}
                            scrollEnabled={false}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.memberItem,
                                        {
                                            backgroundColor: selectedMemberToRemove === item.id ? theme.colors.button : theme.colors.card,
                                            borderColor: selectedMemberToRemove === item.id ? theme.colors.button : theme.colors.border,
                                        },
                                    ]}
                                    onPress={() => setSelectedMemberToRemove(item.id)}
                                >
                                    <View style={styles.memberAvatar}>
                                        <Text style={[styles.memberAvatarText, { color: theme.colors.background }]}>
                                            {item.first_name?.charAt(0).toUpperCase() || 'U'}
                                        </Text>
                                    </View>
                                    <View style={styles.memberInfo}>
                                        <Text style={[styles.memberName, { color: theme.colors.text }]}>
                                            {item.first_name}
                                        </Text>
                                        <Text style={[styles.memberEmail, { color: theme.colors.textSecondary }]}>
                                            {item.email}
                                        </Text>
                                    </View>
                                    {selectedMemberToRemove === item.id && (
                                        <Icon name="check-circle" size={24} color={theme.colors.button} />
                                    )}
                                </TouchableOpacity>
                            )}
                        />

                        <View style={styles.dialogActions}>
                            <Pressable
                                style={[styles.dialogButton, styles.dialogButtonSecondary]}
                                onPress={() => {
                                    setRemoveMemberVisible(false);
                                    setSelectedMemberToRemove(null);
                                }}
                            >
                                <Text style={{ color: theme.colors.text }}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.dialogButton,
                                    styles.dialogButtonDanger,
                                    { opacity: selectedMemberToRemove ? 1 : 0.5 },
                                ]}
                                onPress={handleConfirmRemoveMember}
                                disabled={!selectedMemberToRemove}
                            >
                                <Text style={{ color: '#fff' }}>Remove</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* VIEW MEMBERS MODAL */}
            <Modal
                transparent
                visible={showMembers}
                animationType="slide"
                onRequestClose={() => setShowMembers(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.bottomSheet}>
                        <View style={styles.sheetHandle} />
                        <Text style={[styles.dialogTitle, { color: theme.colors.text }]}>
                            Group Members
                        </Text>
                        <Text style={[styles.dialogText, { color: theme.colors.textSecondary }]}>
                            {members.length} member{members.length !== 1 ? 's' : ''} in this group
                        </Text>

                        <FlatList
                            data={members}
                            scrollEnabled={false}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={[styles.memberListItem, { borderBottomColor: theme.colors.border }]}>
                                    <View style={styles.memberAvatar}>
                                        <Text style={[styles.memberAvatarText, { color: theme.colors.background }]}>
                                            {item.first_name?.charAt(0).toUpperCase() || 'U'}
                                        </Text>
                                    </View>
                                    <View style={styles.memberInfo}>
                                        <Text style={[styles.memberName, { color: theme.colors.text }]}>
                                            {item.first_name}
                                        </Text>
                                        <Text style={[styles.memberEmail, { color: theme.colors.textSecondary }]}>
                                            {item.email}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        />

                        <View style={styles.dialogActions}>
                            <Pressable
                                style={[styles.dialogButton, styles.dialogButtonSecondary]}
                                onPress={() => setShowMembers(false)}
                            >
                                <Text style={{ color: theme.colors.text }}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* UPDATE GROUP MODAL */}
            <Modal
                transparent
                visible={updateGroupVisible}
                animationType="slide"
                onRequestClose={() => setUpdateGroupVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.bottomSheet}>
                        <View style={styles.sheetHandle} />
                        <Text style={[styles.dialogTitle, { color: theme.colors.text }]}>
                            Edit group
                        </Text>
                        <Text style={[styles.dialogText, { color: theme.colors.textSecondary }]}>
                            Update group name and description.
                        </Text>

                        {/* Group Name */}
                        <TextInput
                            value={updatedGroupName}
                            onChangeText={setUpdatedGroupName}
                            placeholder="Group name"
                            placeholderTextColor={theme.colors.textSecondary}
                            style={[
                                styles.input,
                                {
                                    color: theme.colors.text,
                                    borderColor: theme.colors.border,
                                    backgroundColor: theme.colors.card,
                                },
                            ]}
                        />

                        {/* Description */}
                        <TextInput
                            value={updatedGroupDescription}
                            onChangeText={setUpdatedGroupDescription}
                            placeholder="Description (optional)"
                            placeholderTextColor={theme.colors.textSecondary}
                            multiline
                            numberOfLines={3}
                            style={[
                                styles.input,
                                styles.descriptionInput,
                                {
                                    color: theme.colors.text,
                                    borderColor: theme.colors.border,
                                    backgroundColor: theme.colors.card,
                                },
                            ]}
                        />

                        <View style={styles.dialogActions}>
                            <Pressable
                                style={[styles.dialogButton, styles.dialogButtonSecondary]}
                                onPress={() => setUpdateGroupVisible(false)}
                            >
                                <Text style={{ color: theme.colors.text }}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.dialogButton,
                                    {
                                        backgroundColor: theme.colors.button,
                                        opacity: updatedGroupName.trim() ? 1 : 0.7,
                                    },
                                ]}
                                onPress={handleSubmitUpdateGroup}
                                disabled={!updatedGroupName.trim()}
                            >
                                <Text style={{ color: '#fff' }}>Update</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        headerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 12,
            paddingTop: 10,
            paddingBottom: 8,
            backgroundColor: theme.colors.background,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: theme.colors.border,
            shadowColor: theme.colors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
        },
        iconButton: {
            paddingVertical: 6,
            paddingHorizontal: 6,
            borderRadius: 999,
            justifyContent: 'center',
            alignItems: 'center',
        },
        rightActions: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        centerContent: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 8,
        },
        groupRow: {
            flexDirection: 'row',
            alignItems: 'center',
            maxWidth: '100%',
        },
        groupIconWrapper: {
            width: 32,
            height: 32,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.secondaryCard,
            marginRight: 8,
        },
        groupTextWrapper: {
            flexShrink: 1,
        },
        groupTitle: {
            fontSize: 16,
            fontWeight: '700',
        },
        groupSubtitle: {
            fontSize: 12,
            marginTop: 1,
        },
        // Modals shared
        dialogCard: {
            width: '85%',
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 18,
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        dialogTitle: {
            fontSize: 17,
            fontWeight: '700',
            marginBottom: 6,
        },
        dialogText: {
            fontSize: 13,
            marginBottom: 16,
        },
        dialogActions: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            columnGap: 10,
            marginTop: 4,
        },
        dialogButton: {
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 999,
            minWidth: 80,
            alignItems: 'center',
            justifyContent: 'center',
        },
        dialogButtonSecondary: {
            backgroundColor: theme.colors.secondaryBackGround,
        },
        dialogButtonDanger: {
            backgroundColor: theme.colors.notification,
        },

        // Options menu
        optionsMenuContainer: {
            position: 'absolute',
            right: 12,
            top: 70,
            width: 220,
            borderRadius: 10,
            paddingVertical: 6,
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
            shadowColor: theme.colors.black,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 6,
        },
        optionsMenuItem: {
            paddingVertical: 12,
            paddingHorizontal: 14,
        },
        optionsMenuText: {
            fontSize: 15,
            color: theme.colors.text,
        },
        optionsMenuItemDanger: {
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: theme.colors.border,
        },
        optionsMenuTextDanger: {
            fontSize: 15,
            color: theme.colors.notification,
        },

        // small layout for menu rows (icon + label)
        optionsMenuItemContent: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        optionsMenuIcon: {
            marginRight: 12,
        },
        optionsMenuIconDanger: {
            marginRight: 12,
        },

        /* bottom sheet / inputs used by Add Member modal */
        bottomSheet: {
            width: '90%',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 18,
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
            alignSelf: 'center',
            marginTop: 'auto',
            maxHeight: '80%',
        },
        sheetHandle: {
            width: 40,
            height: 4,
            borderRadius: 999,
            backgroundColor: theme.colors.border,
            alignSelf: 'center',
            marginBottom: 12,
        },
        input: {
            width: '100%',
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 8,
            borderWidth: StyleSheet.hairlineWidth,
            fontSize: 15,
            marginBottom: 10,
        },
        descriptionInput: {
            minHeight: 80,
            textAlignVertical: 'top',
            paddingVertical: 12,
        },

        // Member list styles
        memberItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 12,
            borderRadius: 8,
            borderWidth: 1,
            marginBottom: 8,
        },
        memberListItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 12,
            borderBottomWidth: StyleSheet.hairlineWidth,
        },
        memberAvatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.button,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        memberAvatarText: {
            fontSize: 16,
            fontWeight: '600',
        },
        memberInfo: {
            flex: 1,
        },
        memberName: {
            fontSize: 15,
            fontWeight: '600',
        },
        memberEmail: {
            fontSize: 13,
            marginTop: 2,
        },

        // Re-use modal backdrop style for dismiss area
        modalBackdrop: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.35)',
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

export default TransactionsHeader;
