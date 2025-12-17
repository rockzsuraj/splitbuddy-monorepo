import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface Props {
  message: string;
  type: 'success' | 'error';
}

const Message: React.FC<Props> = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // const timeout = setTimeout(() => {
    //   setIsVisible(false);
    // }
    // , 5000);

    // return () => {
    //   clearTimeout(timeout);
    // };
  }, []);

  const backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
  const borderColor = type === 'success' ? '#c3e6cb' : '#f5c6cb';
  const textColor = type === 'success' ? '#155724' : '#721c24';
  const iconColor = type === 'success' ? '#155724' : '#721c24';

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <View>
      {isVisible && (
        <View style={[styles.container, { backgroundColor, borderColor }]}>
          <FontAwesome5 name={type === 'success' ? 'check-circle' : 'times-circle'} size={24} color={iconColor} />
          <Text style={[styles.message, { color: textColor }]}>{message}</Text>
          <Text style={[styles.closeButton, { color: textColor }]} onPress={handleClose}>
            X
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  message: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  closeButton: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Message;
