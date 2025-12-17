// import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { FC, useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Yup from 'yup';
import { Groups, values } from '../../types';
import Star from '../Components/Star';
import { AppContext } from '../Context/AppProvider';
import globalStyles from '../global/globalStyles';
import { useTheme } from '../Hooks/theme';

interface Props {
    group?: Groups;
}

const AddTransactionForm: FC<Props> = ({
    group
}) => {

    const theme = useTheme();
    const { state: { user }, setErrorMessage, setSuccessMessage } = useContext(AppContext);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const navigation = useNavigation();

    const styles = StyleSheet.create({
        title: {
            fontSize: 16,
            marginBottom: 5,
            color: theme.colors.text,
            fontWeight: 'bold'
        },
        input: {
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            marginBottom: 5,
            borderRadius: 5
        },
        error: {
            color: 'red',
            fontSize: 14,
            marginVertical: 5
        },
        buttonContainer: {
            flexDirection: 'row',
            marginVertical: 20
        },
        incomeButton: {
            backgroundColor: 'green',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            marginRight: 10,
            flex: 1,
            alignItems: 'center'
        },
        expenseButton: {
            backgroundColor: 'red',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            flex: 1,
            alignItems: 'center'
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold'
        },
    })

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required').matches(/^[a-zA-Z_ ]+$/, 'Name can only contain letters, spaces'),
        amount: Yup.number().required('Required').positive('Must be positive'),
        description: Yup.string()
            .matches(/^[a-zA-Z0-9_ .,]*$/, 'Only alphanumeric characters, spaces, dot, comma and underscores are allowed.'),
    });

    const handleSubmit = () => {
        // Submit form data to API or do any other processing
        // console.log(args);

        // Reset form to initial values after submission
        // resetForm();

        // Do something with extraParam
        // console.log(extraParam);

        // Set submitting state to false
        // setSubmitting(false);
    };

    const handleGoBack = () => {
        navigation.goBack();
    }

    const placeHolderColor = { color: theme.colors.text }


    const handleAddTransaction = async (
        type: 'credit' | 'debit',
        values: values
    ) => {
        // try {
        //     const { amount, description, name } = values;
        //     const groupsRef = firestore().collection('groups');
        //     const groupRef = groupsRef.doc(group?.id);
        //     const transactionsRef = groupRef.collection('transactions');
        //     const newTransactionData = {
        //         userName: user?.displayName,
        //         transactionName: name,
        //         amount: parseFloat(amount.toString()),
        //         description: description,
        //         timestamp: firestore.FieldValue.serverTimestamp(),
        //         transactionsType: type,
        //         email: user?.email
        //     }
        //     await transactionsRef.add(newTransactionData);
        //     setSuccessMessage(`Success! Your new transaction has been added. 🎉
        //         Transaction details:
        //         - Description: ${description}
        //         - Amount: ${amount}
        //         - Paid by: ${user?.displayName}`)
        // } catch (error) {
        //     setErrorMessage(error.response.data.error.message);
        // }
    };


    const handleAddIncome = (values: values) => {
        const { amount } = values;
        const amt = parseFloat(amount);
        setTotalIncome(totalIncome + amt);
        handleAddTransaction('credit', values)
    };

    const handleAddExpense = (values: values) => {
        const { amount } = values;
        const amt = parseFloat(amount);
        setTotalExpense(totalExpense + amt);
        handleAddTransaction('debit', values)
    };


    return (
        <Formik
            initialValues={{ name: '', amount: '', description: '' }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            validateOnMount
            validateOnChange={true}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, setFieldValue, resetForm, dirty, validateOnChange }) => (
                <>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>
                            <Text style={styles.title}>Transaction</Text>
                            <Star />
                        </Text>
                    </View>
                    <TextInput
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        autoCorrect={false}
                        placeholderTextColor={placeHolderColor.color}
                        style={[styles.input, { color: theme.colors.text }]}
                        placeholder="Transaction name"
                        value={values.name}
                    // onChangeText={(text) => setUserName(text)}
                    />
                    {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>
                            <Text style={styles.title}>Amount</Text>
                            <Star />
                        </Text>

                    </View>
                    <TextInput
                        onChangeText={handleChange('amount')}
                        onBlur={handleBlur('amount')}
                        value={values.amount}
                        keyboardType='numeric'
                        placeholderTextColor={placeHolderColor.color}
                        style={[styles.input, { color: theme.colors.text }]}
                        placeholder="Amount"
                    // onChangeText={(text) => setAmount(text)}
                    />
                    {touched.amount && errors.amount && <Text style={styles.error}>{errors.amount}</Text>}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.title}>Description</Text>
                    </View>
                    <TextInput
                        onChangeText={handleChange('description')}
                        onBlur={handleBlur('description')}
                        placeholderTextColor={placeHolderColor.color}
                        style={[styles.input, { color: theme.colors.text }, globalStyles.textArea]}
                        placeholder="Description"
                        value={values.description}
                    // onChangeText={(text) => setDescription(text)}
                    />
                    {touched.description && errors.description && <Text style={styles.error}>{errors.description}</Text>}
                    <View style={[styles.buttonContainer, { backgroundColor: theme.colors.background }]}>
                        <TouchableOpacity
                            disabled={!(isValid && dirty)}
                            style={[styles.incomeButton, !(isValid && dirty) && { opacity: 0.5 }]}
                            onPress={() => {
                                handleAddIncome(values);
                                resetForm();
                                handleGoBack();
                            }}>
                            <Text style={[styles.buttonText]}>Add Income</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={!(isValid && dirty)}
                            style={[styles.expenseButton, !(isValid && dirty) && { opacity: 0.5 }]}
                            onPress={
                                () => {
                                    handleAddExpense(values);
                                    resetForm();
                                    handleGoBack();
                                }
                            }>
                            <Text style={[styles.buttonText]}>Add Expense</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </Formik>
    );
};

export default AddTransactionForm;
