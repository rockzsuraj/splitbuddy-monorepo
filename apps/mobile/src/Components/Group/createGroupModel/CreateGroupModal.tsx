import { Formik } from 'formik';
import React, { useContext, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Yup from 'yup';
import { AppContext } from '../../../Context/AppProvider';
import { useTheme, AppTheme } from '../../../Hooks/theme';
import CTAButton from '../../CTAButton';
import ModalHeader from '../../ModalHeader';
import ScreenContainer from '../../ScreenContainer';
import IconPicker from './IconPicker';
import { useCreateGroup } from '../../../api/hooks/useGroups';

export interface FormValues {
  name: string;
  description: string;
  others?: string;
  icon?: string;
}

const CreateGroupModal = (props: any) => {
  console.log('props', props);

  const theme: AppTheme = useTheme();
  const placeHolderColor = { color: theme.colors.text };
  const { mutateAsync: createGroup, isPending: isCreating } = useCreateGroup();


  const [isIconDropdownOpen, setIsIconDropdownOpen] = useState(false);
  const [iconSearchTerm, setIconSearchTerm] = useState('');
  const {
    state: { user },
    setSuccessMessage,
    setErrorMessage,
  } = useContext(AppContext);

  const [suggestions] = useState([
    { name: 'Home', icon: 'home' },
    { name: 'Travel', icon: 'flight-takeoff' },
    { name: 'Party', icon: 'local-bar' },
    { name: 'Friends', icon: 'group' },
    { name: 'Family', icon: 'family-restroom' },
    { name: 'Groups', icon: 'groups' },
  ]);

  const allIconNames = useMemo(
    () =>
      Object.keys(
        // @ts-ignore
        MaterialIcons.getRawGlyphMap
          ? // @ts-ignore
          MaterialIcons.getRawGlyphMap()
          : {},
      ),
    [],
  );

  const filteredIconNames = useMemo(() => {
    const term = iconSearchTerm.trim().toLowerCase();
    if (!term) {
      // default to curated suggestions when there is no search term
      return suggestions.map(s => s.icon);
    }

    return allIconNames
      .filter(name => name.toLowerCase().includes(term))
      .slice(0, 50); // limit to first 50 matches for performance / UX
  }, [allIconNames, iconSearchTerm, suggestions]);

  const initialValues: FormValues = {
    name: '',
    description: '',
    icon: '',
  };

  const handleClose = () => {
    props.navigation.goBack();
  };

  async function handleCreateGroup(values: FormValues) {
    try {
      if (!user) return;

      await createGroup({
        group_name: values.name,
        description: values.description,
        group_icon: values.icon || undefined,
      });

      const displayName = user?.first_name + ' ' + user?.last_name;
      setSuccessMessage(
        `Hi, ${displayName}. Congratulations! Your new group has been created. 🎉
  Add members to the group using their email IDs and start sharing expenses. We'll handle the calculations for you.`,
      );

      props.navigation.goBack();
    } catch (error: any) {
      console.log('errror', error);
      
      setErrorMessage(
        error?.response?.data?.error?.message ??
        'Something went wrong while creating the group.',
      );
    }
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        enabled
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={StatusBar.currentHeight ?? 0}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .max(25, 'Group name must be at most 25 characters')
              .required('Group name is required'),
            description: Yup.string().max(
              180,
              'Group description must be at most 180 characters',
            ),
            // icon is OPTIONAL
            icon: Yup.string().nullable(),
          })}
          onSubmit={handleCreateGroup}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <>
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                <ModalHeader title="Create a new group" />

                <View style={{ paddingHorizontal: 10, paddingBottom: 16 }}>
                  {/* Group Name */}
                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>
                      <Text>Group name</Text>
                      <Text style={{ color: 'red' }}>*</Text>
                    </Text>
                    <TextInput
                      style={[styles.input, { color: theme.colors.text }]}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      value={values.name}
                      placeholderTextColor={placeHolderColor.color}
                      placeholder={'group name...'}
                    />
                    {errors.name && touched.name && (
                      <Text style={styles.error}>{errors.name}</Text>
                    )}
                  </View>

                  {/* Description */}
                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>
                      Description
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        { color: theme.colors.text, height: 100 },
                      ]}
                      onChangeText={handleChange('description')}
                      onBlur={handleBlur('description')}
                      value={values.description}
                      placeholderTextColor={placeHolderColor.color}
                      placeholder={'description...'}
                      multiline
                      numberOfLines={4}
                      maxLength={180}
                      textAlignVertical="top"
                    />
                    {errors.description && touched.description && (
                      <Text style={styles.error}>{errors.description}</Text>
                    )}
                  </View>

                  {/* Icon Picker (optional) */}
                  <IconPicker
                    theme={theme}
                    values={values}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    isIconDropdownOpen={isIconDropdownOpen}
                    setIsIconDropdownOpen={setIsIconDropdownOpen}
                    iconSearchTerm={iconSearchTerm}
                    setIconSearchTerm={setIconSearchTerm}
                    suggestions={suggestions}
                    filteredIconNames={filteredIconNames}
                  />
                </View>
              </ScrollView>

              {/* Footer Buttons fixed at bottom */}
              <View style={styles.footer}>
                <CTAButton
                  title="Create Group"
                  onPress={() => handleSubmit()}
                  type="primary"
                  disabled={isCreating}
                />
                <View style={{ width: 12 }} />
                <CTAButton
                  title="Cancel"
                  onPress={handleClose}
                  type="secondary"
                />

              </View>
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupInfoContainer: {
    flex: 1,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  groupDescription: {
    fontSize: 16,
    color: '#888',
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  modalTitle: {
    fontSize: 35,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'ChokoMilky',
      android: 'ChokoMilky-gx8gR',
    }),
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 12,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
  suggestionContainer: {
    marginBottom: 16,
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  // icon preview + chips
  iconPreviewWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPreviewCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPreviewLetter: {
    fontSize: 20,
    fontWeight: '700',
  },
  iconChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  iconChipText: {
    marginLeft: 6,
    fontSize: 12,
  },
  browseAllToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  browseAllText: {
    fontSize: 13,
    marginRight: 4,
  },

  dropdown: {
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
    maxHeight: 260,
  },
  dropdownSearchInput: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    margin: 8,
  },
  dropdownList: {
    paddingBottom: 8,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  dropdownOptionText: {
    marginLeft: 8,
    fontSize: 14,
  },

  footer: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8
  },
});

export default CreateGroupModal;