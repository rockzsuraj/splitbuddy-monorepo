import React, { FC } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TransactionsType } from '../../types'
import { useTheme } from '../Hooks/theme'

interface Props {
    transactions: TransactionsType
}

const UserTransactionSummary: FC<Props> = ({
    transactions
}) => {

    const theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            justifyContent: 'space-between',
            // padding: 10,
            // backgroundColor: theme.colors.secondaryBackGround,
            marginBottom: 5,
            borderRadius: 5,
        },
        title: {
            fontWeight: 'bold',
            fontSize: 14,
            color: theme.colors.text,
            textAlign: 'center'
        },
        user: {
            fontWeight: 'bold',
            fontSize: 12,
            color: theme.colors.text,
        },
        credit: {
            color: '#4caf50',
            fontSize: 12,
        },
        debit: {
            color: '#f44336',
            fontSize: 12,
        },
    });

    const userAmounts = transactions.reduce((acc, transaction) => {
        const { userName, transactionsType, amount } = transaction;
        if (acc[userName] == null) {
            acc[userName] = {
                credit: 0,
                debit: 0
            };
        }
        if (transactionsType === 'credit') {
            acc[userName].credit += amount;
        } else if (transactionsType === 'debit') {
            acc[userName].debit += amount;
        }
        return acc;
    }, {});
    const userAmountsArr = Object.entries(userAmounts).map(([userName, amounts]) => (
        { userName, ...amounts }
    ));
    return (
        <View>
            {userAmountsArr?.map((user) => {
                return (
                    <View style={styles.container} key={user.userName}>
                        <Text style={styles.user}>{user.userName}</Text>
                        <Text style={styles.credit}>Total Income: {'\u20B9'}{user.credit}</Text>
                        <Text style={styles.debit}>Total Expense: {'\u20B9'}{user.debit}</Text>
                    </View>
                )
            })}
        </View>
    )
}


export default UserTransactionSummary;