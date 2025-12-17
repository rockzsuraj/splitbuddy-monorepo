import { NavigationProp, RouteProp } from '@react-navigation/native'
import React, { FC } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Groups, TransactionType, TransactionsType } from '../types'
import MonthlyUserTransactions from './Components/MonthlyUserTransactions'
import { GroupStackParamList } from './Navigation/NavigationTypes'
import { useTheme } from './Hooks/theme'

type TransactionsProp = RouteProp<GroupStackParamList, 'Transactions'>;

type Props = {
    route: TransactionsProp;
    navigation: NavigationProp<GroupStackParamList, 'Transactions'>;
    transactions: TransactionsType;
    group?: Groups;
};


const TransactionList: FC<Props> = ({ navigation, route, transactions, group }) => {
    const theme = useTheme();

    const handleEdit = (item: TransactionType) => {

        if (item) {
            navigation.navigate('EditTransaction', { transaction: item, group: group });
        }
    }
    const monthUserTransaction = (groupTransaction: TransactionsType) => {
        const userAmounts = Object.entries(groupTransaction?.reduce((acc, transaction) => {
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
        }, {})).map(([userName, amounts]) => (
            { userName, ...amounts }
        ));
        return userAmounts;
    };

    return (
        <View style={[styles.transactions, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.subtitle, { color: theme.colors.text }]}>Transactions</Text>
            <View style={[styles.transactionLabelHeader]}>
                <View style={[styles.labelContainer]}>
                    <Text style={[styles.transactionLabel]}>User</Text>
                </View>
                <View style={[styles.labelContainer]}>
                    <Text style={[styles.transactionLabel]}>Transaction</Text>
                </View>
                <View style={[styles.labelContainer]}>
                    <Text style={[styles.transactionLabel]}>Amount</Text>
                </View>
                <View style={[styles.labelContainer]}>
                    <Text style={[styles.transactionLabel]}>Date</Text>
                </View>
            </View>
            <View style={[{ flexGrow: 1 }, { backgroundColor: theme.colors.background, paddingBottom: 10 }]}>

                {!!transactions && Object?.entries(transactions)?.map(([month, monthTransactions]: any, i) => (
                    <View key={month}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: theme.colors.text,
                            paddingVertical: 10
                        }}>
                            {month}
                        </Text>
                        <MonthlyUserTransactions
                            users={
                                monthUserTransaction(monthTransactions)
                            }
                        />
                        {
                            !!monthTransactions?.length && monthTransactions?.map(
                                (item: any) => {
                                    const milliseconds = item?.timestamp?.seconds * 1000;   // convert seconds to milliseconds
                                    const date = new Date(milliseconds);
                                    const formattedDate = date.toLocaleDateString('en-GB');
                                    return (
                                        <View key={item.id}>
                                            <TouchableOpacity key={item.id} style={[styles.transaction, { backgroundColor: theme.colors.card }]} onPress={() => handleEdit(item)}>
                                                <View style={[styles.labelContainer]}>
                                                    <Text style={[styles.transactionDescription, { fontWeight: '500' }, { color: theme.colors.text }]}>{item.userName}</Text>
                                                </View>
                                                <View style={[styles.labelContainer]}>
                                                    <Text style={[styles.transactionDescription, { fontWeight: '500' }, { color: theme.colors.text }]}>{item.transactionName}</Text>
                                                </View>
                                                <View style={[styles.labelContainer]}>
                                                    <Text
                                                        style={
                                                            [
                                                                styles.transactionAmount,
                                                                item.transactionsType === 'credit' ?
                                                                    { color: 'green' } : { color: 'red' }
                                                            ]
                                                        }>
                                                        {item.transactionsType === 'debit' && '-'}
                                                        {parseFloat(String(item?.amount)).toFixed(2)}
                                                    </Text>
                                                </View>
                                                <View style={[styles.labelContainer]}>
                                                    <Text style={[styles.transactionDescription, { color: theme.colors.text }]}>{formattedDate}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }
                            )
                        }
                    </View>
                ))}
            </View>
        </View>
    )
}

export default TransactionList;

const styles = StyleSheet.create({
    transactions: {
        flex: 1
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    transaction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#eee',
        padding: 10,
        marginBottom: 5,
        borderRadius: 5,
        flex: 1
    },
    transactionAmount: {
        fontSize: 12,
        fontWeight: 'bold',
        flex: 1
    },
    transactionLabelHeader: {
        backgroundColor: '#454545',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginBottom: 5,
        borderRadius: 5
    }
    ,
    transactionLabel: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold'
    },
    transactionDescription: {
        fontSize: 12,
        flex: 1
    },
    labelContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
}
)