import { NavigationProp, RouteProp } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, View, Alert, RefreshControl } from 'react-native';
import ScreenContainer from './Components/ScreenContainer';
import TransactionsHeader from './Components/TransactionsHeader';
import { GroupStackParamList } from './Navigation/NavigationTypes';
import { useAddExpense, useAddMember, useCreateSettlement, useDeleteExpense, useDeleteGroup, useGroup, useRemoveMember, useUpdateExpense, useUpdateGroup } from './api/hooks/useGroups';
import GroupSummary from './Components/GroupSummary';
import AddTransactionSheet, { AddTransactionPayload, AddTransactionSheetRef } from './Modal/AddTransactionSheet';
import { AppContext } from './Context/AppProvider';
import { Balance, Expense, Group } from '../types/group';

type TransactionRouteProp = RouteProp<GroupStackParamList, 'Transactions'>;

type TransactionProps = {
  route: TransactionRouteProp;
  navigation: NavigationProp<GroupStackParamList, 'Transactions'>;
};

export default function Transactions({ navigation, route }: TransactionProps) {

  console.log('navigation, route', navigation, route);


  const group = route.params?.group;
  const groupId = group?.group_id ?? ''
  const { mutateAsync: addMember } = useAddMember()
  const { mutateAsync: deleteGroup } = useDeleteGroup()
  const { state: { user } } = useContext(AppContext);
  const addSheetRef = useRef<AddTransactionSheetRef>(null);
  const { mutateAsync: addExpense } = useAddExpense(groupId);
  // get fetching/refetch handles so we can control UI and avoid extra manual refetches
  const { data, isFetching: isGroupFetching, refetch: refetchGroup } = useGroup(groupId);
  // Only fetch balances when splitMode changes OR on manual refetch — disable automatic fetch on mount
  const { mutateAsync: createSettlement } = useCreateSettlement(groupId)
  const { mutateAsync: removeMember } = useRemoveMember()
  const { mutateAsync: updateGroup } = useUpdateGroup()
  const { mutateAsync: updateExpense } = useUpdateExpense(groupId)
  const { mutateAsync: deleteExpense } = useDeleteExpense(groupId)
  const [isSwitchingSplitMode, setIsSwitchingSplitMode] = useState(false);
  const groupDetails = data?.data?.group
  const { setSuccessMessage, setErrorMessage } = useContext(AppContext);
  const [splitMode, setSplitMode] = useState<'splitwise' | 'tricount'>(groupDetails?.split_mode || 'splitwise');

  console.log('groupdetails', groupDetails);
  console.log('splitMode', splitMode);

  useEffect(() => {
    if (!groupDetails?.split_mode) {
      return;
    }
    setSplitMode(groupDetails?.split_mode)
  }, [groupDetails?.split_mode])

  const currentUserId = user?.id; // from auth / session

  const myBalanceEntry = groupDetails?.balances?.find(
    (b: Balance) => b.id === currentUserId
  );

  const myBalance = Number(myBalanceEntry?.balance ?? 0); // ensure number

  const youOweValue = myBalance < 0 ? Math.abs(myBalance) : 0;
  const youAreOwedValue = myBalance > 0 ? myBalance : 0;

  const handleAddTransaction = async (payload: AddTransactionPayload) => {
    const res = await addExpense({
      amount: payload.amount,
      description: payload.description,
      paidBy: payload.paidByUserId
    })
    return res;
  }
  const handleAddMember = async (group: Group, member: { email: string }): Promise<void> => {
    await addMember({ groupID: group.group_id, payload: member })
    navigation.goBack()
  }

  const handleDeleteGroup = async (group: Group) => {
    await deleteGroup(group.group_id)
  }

  const handleAddTransactionPress = () => {
    addSheetRef.current?.open();
  };

  const handleOnSettlePress = async (
    { from_user_id, to_user_id, amount }
      : {
        from_user_id: number,
        to_user_id: number,
        amount: number
      }

  ) => {
    try {
      await createSettlement({ to_user_id, from_user_id, amount })
    } catch (error) {
      console.log('error', error);
    }
  }

  const handleUpdateGroup = async (group?: Group, updates?: Partial<Group>) => {
    if (!group || !updates) {
      return
    }
    await updateGroup({ groupID: group?.group_id, data: updates });
  };

  const handleChangeSplitMode = async (group?: Group, mode?: 'splitwise' | 'tricount') => {
    if (!group || !mode || mode === splitMode) return;
    const prev = splitMode;
    try {
      // UI feedback
      setIsSwitchingSplitMode(true);
      // persist to backend - adjust payload to match your hook's contract
      // many hooks expect an object like { groupId, ...updates }:
      await updateGroup({ groupID: group.group_id, data: { split_mode: mode } });
      // DO NOT call refetch() — react-query auto-refetches when splitMode state changes
      // because useGroup(groupId, splitMode) has splitMode as a dependency
      setSuccessMessage(`Mode is changed successfully`)
    } catch (err) {
      setErrorMessage('Could not update split mode. Please try again.');
      console.error('Failed to update split_mode', err);
    } finally {
      setIsSwitchingSplitMode(false);
    }
  };

  const handleRefresh = () => {
    refetchGroup();
  };

  const handleRemoveMember = async (group: Group, memberId: string) => {
    await removeMember({ groupID: group.group_id, userID: memberId })
  }

  const handleOnDeleteExpense = async (expenseId: string | number) => {
    try {
      await deleteExpense(expenseId);
    } catch (e) {
      setErrorMessage('Could not refresh group data. Please try again.');
    }
  }
  const handleOnEditExpense = async (expense: Expense) => {
    try {
      await updateExpense({
        expenseId: expense.expense_id, payload: {
          amount: expense.amount,
          description: expense.description
        }
      });
    } catch (e) {
      setErrorMessage('Could not refresh group data. Please try again.');
    }
  }
  return (
    <ScreenContainer>
      <View style={{ flex: 1, position: 'relative' }}>
        <TransactionsHeader
          onDeleteGroup={handleDeleteGroup}
          onAddMember={handleAddMember}
          onUpdateGroup={handleUpdateGroup}
          navigation={navigation}
          route={route}
          group={groupDetails}
          onPressAddTransaction={handleAddTransactionPress}
          onRemoveMember={handleRemoveMember}
        />

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isSwitchingSplitMode || isGroupFetching}   // spinner in the pull-down
              onRefresh={handleRefresh}
            />
          }
        >
          <GroupSummary
            group={groupDetails}
            totalExpenses={Number(groupDetails?.total_expense)}
            youOwe={youOweValue}
            youAreOwed={youAreOwedValue}
            balances={groupDetails?.balances}
            expenses={groupDetails?.expenses}
            currentUserId={user?.id}
            splitMode={splitMode}
            onChangeSplitMode={handleChangeSplitMode}
            onSettlePress={handleOnSettlePress}
            onDeleteExpense={handleOnDeleteExpense}
            onEditExpense={handleOnEditExpense}
          />
        </ScrollView>


        <AddTransactionSheet
          ref={addSheetRef}
          group={groupDetails}
          currentUserId={currentUserId}
          onAddTransaction={handleAddTransaction}
        />
      </View>
    </ScreenContainer>
  );

}