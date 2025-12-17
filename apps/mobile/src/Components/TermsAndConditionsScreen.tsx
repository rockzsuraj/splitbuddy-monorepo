import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import globalStyles from '../global/globalStyles';
import { useTheme } from '../Hooks/theme';

const TermsAndConditionsScreen = () => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // alignItems: 'flex-start',
      // paddingHorizontal: 20,
    },
    linksContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      // justifyContent: 'center',
      // alignItems: 'flex-start',
    },
    linkText: {
      fontSize: 12,
      color: 'blue',
      textDecorationLine: 'underline',
      textAlign: 'left'
    },
    checkboxText: {
      fontSize: 12,
      color: theme.colors.text
    },
  });

  const handleOpenURL = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.linksContainer}>
        <Text style={styles.checkboxText}>By clicking "Register" I agree that I have read and accepted the</Text>
        <TouchableOpacity onPress={() => handleOpenURL('https://doc-hosting.flycricket.io/terms-and-condition/a13faa61-3289-4e97-9bcd-33276c248618/terms')}>
          <Text style={styles.linkText}>Terms and Conditions</Text>
        </TouchableOpacity>
        <Text style={styles.checkboxText}> & </Text>
        <TouchableOpacity onPress={() => handleOpenURL('https://doc-hosting.flycricket.io/splitbuddy-privacy-policy/8703b5bd-5677-4444-84f9-c927874d5a64/privacy')}>
          <Text style={styles.linkText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TermsAndConditionsScreen;
