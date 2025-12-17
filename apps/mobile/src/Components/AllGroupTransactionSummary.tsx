import React, { FC } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Groups } from '../../types'
import { useTheme } from '../Hooks/theme'

interface Props {
    groups: Groups[]
}

const AllGroupTransactionSummary: FC<Props> = ({
    groups
}) => {

    const theme = useTheme();
    const styles = StyleSheet.create({
        container: {
            paddingVertical: 10,
            marginBottom: 10,
        },
        title: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 10,
            color: theme.colors.text
        },
        value: {
            fontSize: 13,
            fontWeight: 'bold'
        },
        label: {
            fontSize: 13,
        },
    });

    const userTotalIncome = groups.reduce((acc, curr) => {
        acc.income += curr.currentUserTotalIncome;
        acc.expense += curr.currentUserTotalExpense;
        return acc;
    }, { income: 0, expense: 0 })


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your summary</Text>
            <Text style={{ color: '#4caf50', }}>
                <Text style={styles.label}>Total Income:</Text>
                <Text style={styles.value}> {'\u20B9'}{userTotalIncome.income}</Text>
            </Text>
            <Text style={{ color: '#f44336' }}>
                <Text style={styles.label}>Total Expense:</Text>
                <Text style={styles.value}> {'\u20B9'}{userTotalIncome.expense}</Text>
            </Text>
        </View >
    )
}

export default AllGroupTransactionSummary;