import { Icon, Input } from '@rneui/themed';
import { Field, Formik, FormikHelpers } from 'formik';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as yup from 'yup';
import { AppContext } from '../../Context/AppProvider';
import { GroupScreenProps } from '../../Modal/EditGroupModal';
import globalStyles from '../../global/globalStyles';
import { useTheme } from '../../Hooks/theme';
import { addMemberToGroup } from '../../utils/firebaseUtils';
import MaterialButton from '../MaterialButton';

const validationSchema = yup.object().shape({
    emailId: yup.string().email('Invalid email').required('Email is required'),
});

const EditGroupForm = ({ navigation, route }: GroupScreenProps) => {

    const { state: { user } } = useContext(AppContext);
    const { params } = route;
    const theme = useTheme();
    const { state, setErrorMessage, setSuccessMessage } = useContext(AppContext);


    const styles = StyleSheet.create({
        modal: {
            backgroundColor: theme.colors.background,
            borderRadius: 10,
            padding: 20,
            // shadowColor: '#000',
            // shadowOffset: {
            //     width: 0,
            //     height: 2,
            // },
            // shadowOpacity: 0.25,
            // shadowRadius: 4,
            // elevation: 5,
            marginTop: 15
        },
    })

    const handleAddMember = async (values: {
        emailId: string;
    }, formikHelpers: FormikHelpers<{
        emailId: string;
    }>) => {
        try {
            if (values.emailId && params?.id) {
                const res = await addMemberToGroup(params?.id, values.emailId);
                if (!!res) {
                    setSuccessMessage(res);
                    formikHelpers.resetForm();
                }
            }
        } catch (error) {
            setErrorMessage(error.response.data.error.message);
        }
    };

    return (
        <Formik
            initialValues={{ emailId: '' }}
            validationSchema={validationSchema}
            onSubmit={(values, formikHelpers: FormikHelpers<{
                emailId: string;
            }>) => {
                handleAddMember(values, formikHelpers)
            }}
        >
            {({ handleSubmit }) => (
                <View style={styles.modal}>
                    <Text style={[globalStyles.infoText, {
                        color: theme.colors.text
                    }]}>Add member</Text>
                    <Field
                        name="emailId"
                        component={CustomTextInput}
                        placeholder="email id"
                        errorComponent={({ children }) => (
                            <Text style={{ color: 'red', marginTop: 5 }}>{children}</Text>
                        )}
                    />
                    <MaterialButton onPress={handleSubmit} title={'Add member'} type='primary' iconName='group-add' />
                    {/* <Button
                        variant='outlined'
                        title="Delete"
                        leading={props => <Icon name="delete" {...props} color={theme.colors.highlightedText} />}
                        style={{ marginTop: 10, borderWidth: 1, borderColor: theme.colors.highlightedText }}
                        titleStyle={[globalStyles.buttonText, { color: theme.colors.highlightedText }]}
                        onPress={handleDeleteGroup}
                    /> */}
                </View>
            )}
        </Formik>
    );
};

const CustomTextInput = ({ field, form, placeholder, ...props }) => {

    const theme = useTheme();
    const placeHolderColor = { color: theme.colors.text }
    return (
        <View>
            <Input
                containerStyle={{ paddingHorizontal: 0 }}
                inputContainerStyle={{ borderWidth: 1, borderColor: theme.colors.text, borderRadius: 5 }}
                leftIcon={
                    <Icon
                        name='email'
                        type='material'
                        color={theme.colors.text}
                        size={30}
                        style={{ marginLeft: 5 }}
                    />
                }
                onChangeText={form.handleChange(field.name)}
                onBlur={form.handleBlur(field.name)}
                value={field.value}
                placeholder={placeholder}
                errorMessage={form.touched[field.name] && form.errors[field.name] ? form.errors[field.name] : ''}
                {...props}
                // labelStyle={{ paddingBottom: 5, color: lightTheme.colors.text }}
                autoCapitalize={'none'}
                autoCorrect={false}
                inputStyle={{ color: placeHolderColor.color }}
            />
        </View>
    );
};
export default EditGroupForm;