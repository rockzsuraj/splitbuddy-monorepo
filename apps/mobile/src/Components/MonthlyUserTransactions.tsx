import React, { FC } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../Hooks/theme'

interface Props {
    users: {
        userName: string,
        credit: string,
        debit: string
    }[]
}

const MonthlyUserTransactions: FC<Props> = ({
    users
}) => {

    const theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            justifyContent: 'space-between',
            paddingBottom: 10,
            // backgroundColor: theme.colors.secondaryBackGround,
            marginBottom: 5,
            borderRadius: 5
        },
        user: {
            fontWeight: 'bold',
            fontSize: 12,
            color: theme.colors.text,
            paddingBottom: 2
        },
        credit: {
            color: '#4caf50',
            fontSize: 12
        },
        debit: {
            color: '#f44336',
            fontSize: 12,
        },
    });
    return (
        <View>
            {
                users?.map((user) => (
                    <View style={styles.container} key={user.userName}>
                        <Text style={styles.user}>{user.userName}</Text>
                        <Text style={styles.credit}>This month Income: {'\u20B9'}{user.credit}</Text>
                        <Text style={styles.debit}>This month Expense: {'\u20B9'}{user.debit}</Text>
                    </View>
                ))
            }
        </View>
    )
}


export default MonthlyUserTransactions;