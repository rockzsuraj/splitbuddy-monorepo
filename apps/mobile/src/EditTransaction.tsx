import { NavigationProp, RouteProp } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import ModalHeader from "./Components/ModalHeader";
import EditTransactionForm from "./Form/EditTransactionForm";
import { GroupStackParamList } from "./Navigation/NavigationTypes";


type TransactionsProp = RouteProp<GroupStackParamList, 'EditTransaction'>;

type Props = {
  route: TransactionsProp;
  navigation: NavigationProp<GroupStackParamList, 'EditTransaction'>;
};

const EditTransaction = ({ navigation, route }: Props) => {

  return (
    <View style={{ flex: 1 }}>
      <ModalHeader title="Edit your transaction" />
      <EditTransactionForm navigation={navigation} route={route} />
    </View>
  );
};

export default EditTransaction;
