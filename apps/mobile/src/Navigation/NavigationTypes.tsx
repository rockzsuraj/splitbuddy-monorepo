import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Groups, TransactionType } from '../../types';
import { Group } from '../../types/group';

// Define the auth stack and its screens
export type AuthStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    WelcomeScreen: undefined;
    ForgotPassword: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
    NativeStackScreenProps<AuthStackParamList, T>;

// Define the user tab and its screens
export type UserTabParamList = {
    GroupStack: NavigatorScreenParams<GroupStackParamList>;
    UserStack: NavigatorScreenParams<UserStackParamList>;
};

export type UserTabScreenProps<T extends keyof UserTabParamList> =
    CompositeScreenProps<
        BottomTabScreenProps<UserTabParamList, T>,
        RootStackScreenProps<keyof RootStackParamList>
    >;

// Define the group stack and its screens
export type GroupStackParamList = {
    Groups: undefined;
    CreateGroup: undefined;
    Transactions: { group: Group } | undefined;
    EditTransaction: { transaction: TransactionType, group?: Groups } | undefined;
    EditGroup: Groups | undefined;
    AddTransactionModal: {
        group?: Groups;
    } | undefined;
};

export type GroupStackScreenProps<T extends keyof GroupStackParamList> =
    NativeStackScreenProps<GroupStackParamList, T>;

// Define the user stack and its screens
export type UserStackParamList = {
    Profile: undefined;
};

export type UserStackScreenProps<T extends keyof UserStackParamList> =
    NativeStackScreenProps<UserStackParamList, T>;

// Define the root stack and its screens
export type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    UserTab: NavigatorScreenParams<UserTabParamList>;
    NotFound: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;

// Merge the root stack with the root param list to enable nested navigation
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
