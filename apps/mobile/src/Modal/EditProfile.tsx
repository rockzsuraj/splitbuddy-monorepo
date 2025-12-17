import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ScreenContainer from '../Components/ScreenContainer';
import globalStyles from '../global/globalStyles';
import { useTheme } from '../Hooks/theme';
import CTAButton from '../Components/CTAButton';
import { AppContext } from '../Context/AppProvider';
import { useNavigation } from '@react-navigation/native';
import { updateProfile } from '../api/services/userService';
import { logError } from '../utils/utils';

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  username: Yup.string().required('Username is required'),
});

const EditProfileModel = () => {
  const theme = useTheme();
  const { state: { user }, setErrorMessage, setSuccessMessage, setUser } = useContext(AppContext);
  const navigation = useNavigation();
  const currentUser = {
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    username: user?.username || '',
  };

  return (
    <ScreenContainer
      contentContainerStyle={{ }}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[globalStyles.title, { color: theme.colors.text }]}>
        Edit your profile
      </Text>
      <Formik
        initialValues={currentUser}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            const user = await updateProfile(values);
            setUser(user);
            setSuccessMessage('Profile updated successfully');
            navigation.goBack();
          } catch (error) {
            logError(error, 'Profile update failed');
            setErrorMessage('Failed to update profile. Please try again.');
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, dirty }) => (
          <View style={{ flex: 1, padding: 15 }}>
            <ScrollView
              keyboardShouldPersistTaps="handled" // to allow tapping button while keyboard open
            >
              {/* All form input views here unchanged */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>First Name</Text>
                <TextInput
                  style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.text }]}
                  onChangeText={handleChange('first_name')}
                  onBlur={handleBlur('first_name')}
                  value={values.first_name}
                  placeholder="Enter first name"
                  placeholderTextColor={theme.colors.text + '88'}
                />
                {touched.first_name && errors.first_name && (
                  <Text style={styles.errorText}>{errors.first_name}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Last Name</Text>
                <TextInput
                  style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.text }]}
                  onChangeText={handleChange('last_name')}
                  onBlur={handleBlur('last_name')}
                  value={values.last_name}
                  placeholder="Enter last name"
                  placeholderTextColor={theme.colors.text + '88'}
                />
                {touched.last_name && errors.last_name && (
                  <Text style={styles.errorText}>{errors.last_name}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Email</Text>
                <TextInput
                  style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.text }]}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  placeholder="Enter email"
                  placeholderTextColor={theme.colors.text + '88'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Username</Text>
                <TextInput
                  style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.text }]}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  value={values.username}
                  placeholder="Enter username"
                  placeholderTextColor={theme.colors.text + '88'}
                  autoCapitalize="none"
                />
                {touched.username && errors.username && (
                  <Text style={styles.errorText}>{errors.username}</Text>
                )}
              </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
              <CTAButton
                type='primary'
                onPress={handleSubmit}
                title="Save"
                disabled={!dirty}
              />
              <CTAButton
                type='secondary'
                onPress={() => navigation.goBack()}
                title="cancel"
              />
            </View>
          </View>
        )}
      </Formik>
    </ScreenContainer>
  );
};

export default EditProfileModel;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});
