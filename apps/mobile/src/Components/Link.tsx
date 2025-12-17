import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../Hooks/theme';


const Link = ({
  text,
  navigate
}: { text: string, navigate: any }) => {

  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={() => navigation.navigate(navigate)}>
      <Text style={{ color: theme.colors.highlightedText , fontWeight: 'bold' }}>{text}</Text>
    </TouchableOpacity>
  );
};


export default Link;
