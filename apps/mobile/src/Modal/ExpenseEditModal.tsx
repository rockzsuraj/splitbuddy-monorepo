import React, { FC, useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { useTheme } from '../Hooks/theme';
import { Expense } from '../../types/group';

type Props = {
    visible: boolean;
    expense: Expense | null;
    onClose: () => void;
    onSave: (updated: Expense) => Promise<void> | void;
    onDelete: (expenseId: number) => Promise<void> | void;
};

const ExpenseEditModal: FC<Props> = ({ visible, expense, onClose, onSave, onDelete }) => {
    const theme = useTheme();
    const styles = makeStyles(theme);

    const [name, setName] = useState<string>(expense?.description || '');
    const [amount, setAmount] = useState<string>(expense ? String(expense.amount) : '');
    const [description, setDescription] = useState<string>(expense?.description || expense?.description || '');

    useEffect(() => {
        setName(expense?.description || '');
        setAmount(expense ? String(expense.amount) : '');
        setDescription(expense?.description || expense?.description || '');
    }, [expense, visible]);

    const handleSave = async () => {
        if (!expense) return;
        const amt = Number(amount);
        if (isNaN(amt) || amt <= 0) {
            Alert.alert('Invalid amount', 'Please enter a valid amount greater than 0.');
            return;
        }

        const updated: Expense = {
            ...expense,
            description: name || description || expense.description,
            amount: amt,
        } as Expense;

        try {
            await onSave(updated);
        } catch (e) {
            // caller handles errors if needed
        } finally {
            onClose();
        }
    };

    const handleDelete = () => {
        if (!expense) return;
        Alert.alert('Delete expense', 'Are you sure you want to delete this expense?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await onDelete(expense.expense_id);
                    } catch (e) {
                        // swallow
                    } finally {
                        onClose();
                    }
                },
            },
        ]);
    };

    return (
        <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
            <View style={styles.backdrop}>
                <View style={styles.sheetHandle} />
                <View style={styles.container}>
                    <Text style={styles.title}>Edit expense</Text>

                    <Text style={styles.label}>Name</Text>
                    <TextInput value={name} onChangeText={setName} placeholder="Short name" placeholderTextColor={theme.colors.textMuted} style={styles.input} />

                    <Text style={styles.label}>Amount</Text>
                    <TextInput value={amount} onChangeText={setAmount} placeholder="Amount" placeholderTextColor={theme.colors.textMuted} keyboardType="numeric" style={styles.input} />

                    <Text style={styles.label}>Description / Notes</Text>
                    <TextInput value={description} onChangeText={setDescription} placeholder="More details (optional)" placeholderTextColor={theme.colors.textMuted} style={[styles.input, { height: 80 }]} multiline />

                    <View style={styles.rowRight}>
                        <Pressable onPress={onClose} style={styles.buttonPlain}>
                            <Text style={styles.buttonPlainText}>Cancel</Text>
                        </Pressable>

                        <Pressable onPress={handleSave} style={styles.buttonPrimary}>
                            <Text style={styles.buttonPrimaryText}>Save</Text>
                        </Pressable>
                    </View>

                    <View style={{ height: 8 }} />

                    <Pressable onPress={handleDelete} style={styles.deleteButton}>
                        <Text style={styles.deleteText}>Delete expense</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        sheetHandle: {
            width: 40,
            height: 4,
            borderRadius: 999,
            backgroundColor: theme.colors.border,
            alignSelf: 'center',
            marginBottom: 12,
        },
        backdrop: {
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
        container: {
            backgroundColor: theme.colors.secondaryBackGround,
            borderRadius: 12,
            padding: 14,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        title: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginBottom: 8 },
        label: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 8 },
        input: {
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 8,
            color: theme.colors.text,
            marginTop: 6,
        },
        rowRight: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 12 },
        buttonPlain: { paddingHorizontal: 12, paddingVertical: 8 },
        buttonPlainText: { color: theme.colors.textSecondary },
        buttonPrimary: { paddingHorizontal: 12, paddingVertical: 8 },
        buttonPrimaryText: { color: theme.colors.primary, fontWeight: '700' },
        deleteButton: { paddingVertical: 8, alignItems: 'center' },
        deleteText: { color: theme.colors.danger, fontWeight: '600' },
    });

export default ExpenseEditModal;