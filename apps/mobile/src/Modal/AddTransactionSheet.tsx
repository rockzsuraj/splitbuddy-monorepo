import React, {
  useState,
  useMemo,
  useContext,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../Hooks/theme';
import { Group, Member } from '../../types/group';
import { AppContext } from '../Context/AppProvider';

export type AddTransactionSheetRef = {
  open: () => void;
  close: () => void;
};

export type AddTransactionPayload = {
  groupId: number;
  description: string;
  amount: number;
  paidByUserId: number;
  note?: string;
};

type Props = {
  group?: Group;
  currentUserId?: number;         // to mark “You”
  onAddTransaction?: (payload: AddTransactionPayload) => void;
};

const AddTransactionSheet = forwardRef<AddTransactionSheetRef, Props>(
  ({ group, currentUserId, onAddTransaction }, ref) => {
    const theme = useTheme();
    const styles = makeStyles(theme);

    const members: Member[] = useMemo(
      () => (group?.members ? group.members : []),
      [group?.members]
    );

    const [visible, setVisible] = useState(false);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
    const { setErrorMessage } = useContext(AppContext);

    const defaultMemberId = useMemo(() => {
      if (!members?.length) return null;
      if (currentUserId) {
        const me = members?.find((m) => m.id === currentUserId);
        if (me) return me.id;
      }
      return members?.[0].id;
    }, [members, currentUserId]);

    React.useEffect(() => {
      if (selectedMemberId == null && defaultMemberId != null) {
        setSelectedMemberId(defaultMemberId);
      }
    }, [defaultMemberId, selectedMemberId]);

    const resetForm = () => {
      setDescription('');
      setAmount('');
      setNote('');
      setSelectedMemberId(defaultMemberId);
    };

    const handleOpen = () => {
      setVisible(true);
    };

    const handleClose = () => {
      setVisible(false);
      resetForm();
    };

    useImperativeHandle(ref, () => ({
      open: handleOpen,
      close: handleClose,
    }));

    const handleSubmit = () => {
      if (!group?.group_id || !selectedMemberId) return;

      const numericAmount = parseFloat(amount);

      if (!description.trim() || isNaN(numericAmount) || numericAmount <= 0) {
        setErrorMessage('Please add all required field!');
        return;
      }

      const payload: AddTransactionPayload = {
        groupId: Number(group.group_id),
        description: description.trim(),
        amount: numericAmount,
        paidByUserId: selectedMemberId,
        note: note.trim() || undefined,
      };

      onAddTransaction?.(payload);
      handleClose();
    };

    const canSubmit =
      description.trim().length > 0 &&
      !!parseFloat(amount) &&
      !isNaN(+amount) &&
      !!selectedMemberId;

    const getMemberLabel = (member: Member) => {
      if (member.id === currentUserId) {
        return `${member.first_name} (You)`;
      }
      return member.first_name;
    };

    return (
      <>
        {/* Bottom sheet modal */}
        <Modal
          visible={visible}
          transparent
          animationType="slide"
          onRequestClose={handleClose}
        >
          <View style={styles.backdrop}>
            <Pressable style={{ flex: 1 }} onPress={handleClose} />

            <View style={styles.sheet}>
              <View style={styles.sheetHandle} />

              <View style={styles.sheetHeaderRow}>
                <Text style={[styles.sheetTitle, { color: theme.colors.text }]}>
                  Add expense
                </Text>
                {group?.group_name && (
                  <Text
                    style={[
                      styles.sheetSubtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    {group.group_name}
                  </Text>
                )}
              </View>

              {/* Description */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                  Description
                </Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Dinner, Uber, Movie tickets..."
                  placeholderTextColor={theme.colors.textMuted}
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.card,
                      color: theme.colors.text,
                    },
                  ]}
                />
              </View>

              {/* Amount */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                  Amount
                </Text>
                <View style={styles.amountRow}>
                  <Text style={[styles.currency, { color: theme.colors.text }]}>
                    ₹
                  </Text>
                  <TextInput
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor={theme.colors.textMuted}
                    style={[
                      styles.input,
                      styles.amountInput,
                      {
                        borderColor: theme.colors.border,
                        backgroundColor: theme.colors.card,
                        color: theme.colors.text,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Paid by – member selector */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                  Paid by
                </Text>

                {members.length === 0 ? (
                  <Text style={{ fontSize: 12, color: theme.colors.textMuted }}>
                    No members in this group yet.
                  </Text>
                ) : (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.membersScroll}
                  >
                    {members.map((member) => {
                      const isSelected = member.id === selectedMemberId;
                      return (
                        <Pressable
                          key={member.id}
                          onPress={() => setSelectedMemberId(member.id)}
                          style={[
                            styles.memberPill,
                            {
                              backgroundColor: isSelected
                                ? theme.colors.primarySoft
                                : theme.colors.card,
                              borderColor: isSelected
                                ? theme.colors.primary
                                : theme.colors.border,
                            },
                          ]}
                        >
                          {isSelected && (
                            <Icon
                              name="check"
                              size={16}
                              color={theme.colors.primary}
                              style={{ marginRight: 4 }}
                            />
                          )}
                          <Text
                            style={{
                              color: isSelected
                                ? theme.colors.primary
                                : theme.colors.text,
                              fontSize: 13,
                              fontWeight: isSelected ? '600' : '400',
                            }}
                            numberOfLines={1}
                          >
                            {getMemberLabel(member)}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                )}
              </View>

              {/* Note */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                  Note (optional)
                </Text>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Add a note for this expense"
                  placeholderTextColor={theme.colors.textMuted}
                  multiline
                  style={[
                    styles.input,
                    styles.noteInput,
                    {
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.card,
                      color: theme.colors.text,
                    },
                  ]}
                />
              </View>

              {/* Info line */}
              {members.length > 0 && selectedMemberId && (
                <Text
                  style={{
                    fontSize: 11,
                    marginBottom: 6,
                    color: theme.colors.textMuted,
                  }}
                >
                  {`This expense will be paid by ${
                    members.find((m) => m.id === selectedMemberId)?.first_name ||
                    'member'
                  }.`}
                </Text>
              )}

              {/* Actions */}
              <View style={styles.actionsRow}>
                <Pressable
                  style={[styles.actionButton, styles.secondaryButton]}
                  onPress={handleClose}
                >
                  <Text style={{ color: theme.colors.text }}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: theme.colors.button,
                      opacity: canSubmit ? 1 : 0.7,
                    },
                  ]}
                  onPress={handleSubmit}
                  disabled={!canSubmit}
                >
                  <Text style={{ color: '#fff', fontWeight: '600' }}>
                    Add expense
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }
);

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.35)',
      justifyContent: 'flex-end',
    },
    sheet: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 18,
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    sheetHandle: {
      alignSelf: 'center',
      width: 40,
      height: 4,
      borderRadius: 999,
      backgroundColor: theme.colors.border,
      marginBottom: 8,
    },
    sheetHeaderRow: {
      marginBottom: 10,
    },
    sheetTitle: {
      fontSize: 17,
      fontWeight: '700',
    },
    sheetSubtitle: {
      fontSize: 12,
      marginTop: 2,
    },
    field: {
      marginBottom: 10,
    },
    label: {
      fontSize: 12,
      marginBottom: 4,
    },
    input: {
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
      fontSize: 14,
    },
    noteInput: {
      minHeight: 60,
      textAlignVertical: 'top',
    },
    amountRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    currency: {
      fontSize: 18,
      fontWeight: '600',
      marginRight: 6,
    },
    amountInput: {
      flex: 1,
    },
    membersScroll: {
      paddingVertical: 4,
    },
    memberPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      marginRight: 8,
      maxWidth: 180,
    },
    actionsRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      columnGap: 10,
      marginTop: 8,
    },
    actionButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 999,
      minWidth: 110,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondaryButton: {
      backgroundColor: theme.colors.secondaryBackGround,
    },
  });

export default AddTransactionSheet;
