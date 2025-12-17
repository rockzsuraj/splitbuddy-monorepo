import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TransactionsType } from '../types';
import UserTransactionSummary from './Components/UserTransactionSummary';
import { useTheme } from './Hooks/theme';

interface Props {
    totalIncome: number;
    totalExpense: number;
    transactions: TransactionsType
}

export default function Expense({
    totalIncome,
    totalExpense,
    transactions
}: Props) {

    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.summaryContainer, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>Summary</Text>
                <View style={[styles.summaryRow, { backgroundColor: theme.colors.background }]}>
                    <Text>
                        <Text style={[styles.summaryLabel, { color: theme.colors.text }]}>Group total income:</Text>
                        <Text style={[styles.summaryAmount, { color: theme.colors.text }]}>  {'\u20B9'}{totalIncome?.toFixed(2)}</Text>
                    </Text>
                </View>
                <View style={[styles.summaryRow, { backgroundColor: theme.colors.background }]}>
                    <Text>
                        <Text style={[styles.summaryLabel, { color: theme.colors.text }]}>Group total expense:</Text>
                        <Text style={[styles.summaryAmount, { color: theme.colors.text }]}>  {'\u20B9'}{totalExpense?.toFixed(2)}</Text>
                    </Text>
                </View>
                <View style={[styles.summaryRow, { backgroundColor: theme.colors.background }]}>
                    <Text>
                        <Text style={[styles.summaryLabel, { color: theme.colors.text }]}>Balance:</Text>
                        <Text style={[styles.summaryAmount, { color: theme.colors.text }]}>  {'\u20B9'}{(totalIncome + totalExpense).toFixed(2)}</Text>
                    </Text>
                </View>
                <UserTransactionSummary transactions={transactions} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // backgroundColor: 'yellow',
        // alignItems: 'center',
        // justifyContent: 'center',
        paddingBottom: 15
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    summaryContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        width: '100%'
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5
    },
    summaryLabel: {
        fontSize: 16
    },
    summaryAmount: {
        fontSize: 16,
        fontWeight: 'bold'
    }
});
