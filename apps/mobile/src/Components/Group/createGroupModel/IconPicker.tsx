import React from 'react';
import {
    Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AppTheme } from '../../../Hooks/theme';
import { FormValues } from './CreateGroupModal';
;

type IconPickerProps = {
    theme: AppTheme;
    values: FormValues;
    errors: any;
    touched: any;
    setFieldValue: (field: string, value: any) => void;
    isIconDropdownOpen: boolean;
    setIsIconDropdownOpen: (val: boolean) => void;
    iconSearchTerm: string;
    setIconSearchTerm: (val: string) => void;
    suggestions: { name: string; icon: string }[];
    filteredIconNames: string[];
  };
  

const IconPicker: React.FC<IconPickerProps> = ({
    theme,
    values,
    setFieldValue,
    isIconDropdownOpen,
    setIsIconDropdownOpen,
    iconSearchTerm,
    setIconSearchTerm,
    suggestions,
    filteredIconNames,
  }) => {
    const placeHolderColor = { color: theme.colors.black };
  
    const selectedSuggestion =
      values.icon && suggestions.find(s => s.icon === values.icon);
    const previewLabel =
      selectedSuggestion?.icon || values.icon || values.name?.charAt(0) || '?';
  
    return (
      <View style={styles.suggestionContainer}>
        {/* Preview avatar */}
        <View style={styles.iconPreviewWrapper}>
          <View
            style={[
              styles.iconPreviewCircle,
              { backgroundColor: theme.colors.primaryCard },
            ]}
          >
            {values.icon ? (
              <MaterialIcons
                name={values.icon}
                size={28}
                color={theme.colors.text}
              />
            ) : (
              <Text
                style={[styles.iconPreviewLetter, { color: theme.colors.text }]}
              >
                {previewLabel.toString().toUpperCase().charAt(0)}
              </Text>
            )}
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={[styles.suggestionTitle, { color: theme.colors.text }]}>
              {values.icon || `Group icon `}
            <Text style={{ color: '#999' }}>(optional)</Text>
            </Text>
            <Text style={{ fontSize: 12, color: '#888' }}>
              We’ll use the first letter if you skip this.
            </Text>
          </View>
        </View>
  
        {/* Suggested icons as chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10 }}
        >
          {suggestions.map(s => {
            const isActive = values.icon === s.icon;
            return (
              <TouchableOpacity
                key={s.icon}
                style={[
                  styles.iconChip,
                  {
                    borderColor: isActive
                      ? theme.colors.text
                      : theme.colors.border,
                    backgroundColor: isActive
                      ? theme.colors.primaryCard
                      : theme.colors.secondaryCard,
                  },
                ]}
                onPress={() => {
                  setFieldValue('icon', s.icon);
                }}
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name={s.icon}
                  size={18}
                  color={theme.colors.black}
                />
                <Text
                  style={[styles.iconChipText, { color: theme.colors.black }]}
                >
                  {s.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
  
        {/* Browse all icons toggle */}
        <TouchableOpacity
          style={[styles.browseAllToggle, {backgroundColor: theme.colors.secondaryCard}]}
          onPress={() => setIsIconDropdownOpen(!isIconDropdownOpen)}
          activeOpacity={0.7}
        >
          <Text style={[styles.browseAllText, { color: theme.colors.black }]}>
            {isIconDropdownOpen ? 'Hide all icons' : 'Browse all icons'}
          </Text>
          <MaterialIcons
            name={isIconDropdownOpen ? 'expand-less' : 'expand-more'}
            size={20}
            color={theme.colors.black}
          />
        </TouchableOpacity>
  
        {/* Full searchable list */}
        {isIconDropdownOpen && (
          <View
            style={[
              styles.dropdown,
              { backgroundColor: theme.colors.secondaryCard },
            ]}
          >
            <TextInput
              style={[
                styles.dropdownSearchInput,
                { color: theme.colors.black, borderColor: theme.colors.border },
              ]}
              placeholder="Search icon (e.g. home, group, flight...)"
              placeholderTextColor={placeHolderColor.color}
              value={iconSearchTerm}
              onChangeText={setIconSearchTerm}
            />
  
            <ScrollView style={styles.dropdownList} nestedScrollEnabled>
              {filteredIconNames.map(iconName => {
                const suggestionMatch = suggestions.find(
                  s => s.icon === iconName,
                );
                const label = suggestionMatch?.name ?? iconName;
                const isActive = iconName === values.icon;
  
                return (
                  <TouchableOpacity
                    key={iconName}
                    style={[
                      styles.dropdownOption,
                      isActive && { backgroundColor: theme.colors.primaryCard },
                    ]}
                    activeOpacity={0.7}
                    onPress={() => {
                      setFieldValue('icon', iconName);
                    }}
                  >
                    <MaterialIcons
                      name={iconName}
                      size={22}
                      color={theme.colors.black}
                    />
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        { color: theme.colors.black },
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };
  

  export default IconPicker;

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
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 20
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
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingBottom: 16,
      paddingTop: 8,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: '#ccc',
      backgroundColor: '#fff',
    },
  });