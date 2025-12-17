// import firestore from '@react-native-firebase/firestore';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useContext } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Yup from 'yup';
import { values } from '../../types';
import { AppContext } from '../Context/AppProvider';
import DebitCreditPicker from '../DebitCreditPicker';
import { GroupStackParamList } from '../Navigation/NavigationTypes';
import { useTheme } from '../Hooks/theme';


type TransactionsProp = RouteProp<GroupStackParamList, 'EditTransaction'>;
type Props = {
    route: TransactionsProp;
    navigation: NavigationProp<GroupStackParamList, 'EditTransaction'>;
};


const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required').matches(/^[a-zA-Z_ ]+$/, 'Name can only contain letters, spaces'),
    amount: Yup.number().required('Required').positive('Must be positive'),
    description: Yup.string().required('Required')
        .matches(/^[a-zA-Z0-9_ .,]*$/, 'Only alphanumeric characters, spaces, dot, comma and underscores are allowed.'),
});


export default function EditTransactionForm({ navigation, route }: Props) {

    const theme = useTheme();
    const placeHolderColor = { color: theme.colors.text };
    const { params } = route;
    const amount = params?.transaction?.amount || '';
    const description = params?.transaction.description || '';
    const id = params?.transaction.id || '';
    const timestamp = params?.transaction.timestamp || '';
    const transactionsType = params?.transaction.transactionsType || 'credit';
    const transactionName = params?.transaction.transactionName || '';
    const group = params?.group;
    const { state: { user }, setErrorMessage, setSuccessMessage } = useContext(AppContext);

    function onClose() {
        navigation.goBack();
    }

    // const groupRef = firestore().collection('groups').doc(group?.id)
    // const transactionRef = groupRef.collection('transactions').doc(id);

    const handleSave = async (values: values) => {
        const { amount, description, name, type } = values;

        // try {
        //     const transactionDoc = await transactionRef.get();
        //     // Get the email field from the transaction document
        //     const email = transactionDoc?.data()?.email;
        //     if (!!email && user && user.email && (email === user.email)) {
        //         const updatedTransaction = {
        //             transactionName: name,
        //             amount: parseFloat(amount.toString()),
        //             description: description,
        //             timestamp: firestore.FieldValue.serverTimestamp(),
        //             transactionsType: type,
        //         };
        //         await transactionRef.update(updatedTransaction);
        //         setSuccessMessage('Your transaction is successfully saved!');
        //         onClose();
        //     } else {
        //         setErrorMessage('Sorry, you do not have permission to edit this transaction.')
        //     }
        // } catch (error) {
        //     setErrorMessage(error.response.data.error.message);
        // }
    };

    // Delete a transaction with the given ID
    const deleteTransaction = async () => {
        // try {
        //     const transactionDoc = await transactionRef.get();
        //     // Get the email field from the transaction document
        //     const email = transactionDoc?.data()?.email;
        //     if (!!email && user && user.email && (email === user.email)) {
        //         await transactionRef.delete();
        //         setSuccessMessage('Transaction deleted successfully');
        //         onClose();
        //     } else {
        //         setErrorMessage('Sorry you do not have permission you delete this transaction!')
        //     }
        // } catch (error) {
        //     setErrorMessage('Error deleting transaction!');
        // }
    };

    const styles = StyleSheet.create({
        title: {
            fontSize: 16,
            marginBottom: 5,
            color: theme.colors.text,
            fontWeight: 'bold'
        },
        container: {
            flex: 1,
            // justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.background,
            paddingTop: 10
        },
        form: {
            width: '80%',
        },
        label: {
            marginTop: 10,
            marginBottom: 5,
            fontSize: 16,
            fontWeight: 'bold',
        },
        input: {
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            paddingHorizontal: 10,
        },
        textArea: {
            height: 80,
        },
        error: {
            color: 'red',
            marginBottom: 10,
        },
        button: {
            marginTop: 20,
            backgroundColor: 'blue',
            paddingVertical: 10,
            borderRadius: 5,
            alignItems: 'center',
        },
        buttonText: {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 15
        },
        inputContainer: {
            marginVertical: 10,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: "#ccc",
        },
        picker: {
            borderWidth: 1,
            height: 55,
            marginBottom: 10,
        },
        deleteButton: {
            backgroundColor: 'red',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            width: '50%',
            alignItems: 'center',
        },
        saveCancelButton: {
            backgroundColor: theme.colors.primary,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            width: '40%',
            alignItems: 'center',
        },
    });

    return (
        <View style={styles.container}>
            <Formik
                initialValues={{ name: transactionName, amount: String(amount), description: description, type: transactionsType }}
                onSubmit={handleSave}
                validationSchema={validationSchema}
            >
                {({ handleChange, handleBlur, handleSubmit, values, isValid, dirty, touched, errors }) => (
                    <View style={styles.form}>
                        <Text style={[styles.title, { color: theme.colors.text }]}>Transaction name :</Text>
                        <TextInput
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            autoCorrect={false}
                            placeholderTextColor={placeHolderColor.color}
                            style={[styles.input, { color: theme.colors.text }]}
                            placeholder="UserName"
                            value={values.name}
                        // onChangeText={(text) => setUserName(text)}
                        />
                        {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}
                        <Text style={[styles.label, { color: theme.colors.text }]}>Amount:</Text>
                        <TextInput
                            onChangeText={handleChange('amount')}
                            onBlur={handleBlur('amount')}
                            value={values.amount}
                            keyboardType="numeric"
                            placeholderTextColor={placeHolderColor.color}
                            style={[styles.input, { color: theme.colors.text }]}

                        />
                        {touched.amount && errors.amount && <Text style={styles.error}>{errors.amount}</Text>}
                        <Text style={[styles.label, { color: theme.colors.text }]}>Description:</Text>
                        <TextInput
                            style={[styles.input, styles.textArea, { color: theme.colors.text }]}
                            onChangeText={handleChange('description')}
                            onBlur={handleBlur('description')}
                            value={values.description}
                            multiline
                            placeholderTextColor={placeHolderColor.color}
                            autoCapitalize={"none"}
                        />
                        {touched.description && errors.description && <Text style={styles.error}>{errors.description}</Text>}
                        <DebitCreditPicker defaultType={values.type} onValueChange={handleChange('type')} />
                        <View style={[styles.buttonContainer, { backgroundColor: theme.colors.background }]}>
                            <TouchableOpacity disabled={!((isValid && dirty))} style={[styles.saveCancelButton, !(isValid && dirty) && { opacity: 0.5 }]} onPress={handleSubmit}>
                                <Text style={[styles.buttonText]}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveCancelButton} onPress={onClose}>
                                <Text style={[styles.buttonText]}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.buttonContainer, { backgroundColor: theme.colors.background }]}>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTransaction()}>
                                <Text style={[styles.buttonText]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Formik>
        </View>
    );
}
