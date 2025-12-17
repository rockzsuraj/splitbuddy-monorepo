import { Picker } from "@react-native-picker/picker";
import React, { FC, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "./Hooks/theme";

interface Props {
  defaultType: 'credit' | 'debit';
  onValueChange: (val: 'debit' | 'credit') => void;
}

const DebitCreditPicker: FC<Props> = ({ defaultType, onValueChange }) => {

  const theme = useTheme();

  const pickerRef: any = useRef(null);
  function open() {
    if (!pickerRef) {
      return
    }
    pickerRef.current.focus();
  }
  function close() {
    if (!pickerRef) {
      return
    }
    pickerRef.current.blur();
  }

  const handleValueChange = (value: 'debit' | 'credit') => {
    onValueChange(value);
  };

  const dropdownIconColor = theme.colors.text;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.label, { color: theme.colors.text }]}>Transaction Type:</Text>
      <View style={[styles.pickerContainer]}>
        <Picker
          ref={pickerRef}
          selectedValue={defaultType}
          onValueChange={handleValueChange}
          style={[styles.picker, { backgroundColor: theme.colors.background, color: theme.colors.text }]}
          dropdownIconColor={dropdownIconColor}
          itemStyle={{ color: theme.colors.text }}
        >
          <Picker.Item label="Expense" value="debit" />
          <Picker.Item label="Income" value="credit" />
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 0.5,
    borderColor: "#ccc",
  },
  picker: {
    // flexGrow: 1,
    // width: "100%",
  },
});

export default DebitCreditPicker;
