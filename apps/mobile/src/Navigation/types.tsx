import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Groups, TransactionType } from '../../types';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  WelcomeScreen: undefined;
  ForgotPassword: undefined;
};

export type GroupParamList = {
  Groups: undefined;
  CreateGroup: undefined;
  Transactions: { group: Groups } | undefined;
  Edit: TransactionType | undefined;
  EditGroup: { group: Groups };
};

export type UserParamList = {
  Profile: undefined;
  ChangePassword: undefined;
  updateProfile: undefined;
}

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type RootTabParamList = {
  Group: GroupParamList | undefined;
  User: UserParamList | undefined;
};

export type HomeTabScreenProps<T extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}