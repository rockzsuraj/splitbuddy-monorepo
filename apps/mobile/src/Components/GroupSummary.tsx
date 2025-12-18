import React, { FC, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../Hooks/theme';
import { Balance, Group, Expense, RecommendedSettlement, Settlement } from '../../types/group';
import { getPairKey } from '../utils/utils';
import ExpenseEditModal from '../Modal/ExpenseEditModal';

export type SplitMode = 'splitwise' | 'tricount';

type Props = {
  group?: Group;
  totalExpenses?: number;
  youOwe?: number;
  youAreOwed?: number;
  balances?: Balance[];
  expenses?: Expense[];
  currentUserId?: number;

  splitMode?: SplitMode;
  onChangeSplitMode?: (group?: Group, mode?: SplitMode) => Promise<void>;

  // 🔥 NEW: when user taps "Settle"
  onSettlePress?: (settlement: RecommendedSettlement) => void;

  // 🔥 NEW: expense actions
  onEditExpense?: (expense: Expense) => Promise<void>;
  onDeleteExpense?: (expenseId: number) => Promise<void>;
};

const formatCurrency = (n: number) => {
  if (isNaN(n)) return '₹0';
  return `₹${n.toFixed(0)}`;
};

const formatDateTime = (iso: string | undefined | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';

  const day = d.getDate().toString().padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[d.getMonth()];
  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;

  return `${day} ${month}, ${h12}:${minutes} ${ampm}`;
};

type MemberExpenseSummary = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  total_amount: number;
  last_created_at?: string;
  count: number;
};

const GroupSummary: FC<Props> = ({
  group,
  totalExpenses = 0,
  youOwe = 0,
  youAreOwed = 0,
  expenses,
  currentUserId,
  splitMode = 'tricount',
  onChangeSplitMode,
  onSettlePress,
  onEditExpense,
  onDeleteExpense,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const [settlingKey, setSettlingKey] = useState<string | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<number | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editDescription, setEditDescription] = useState<string>('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const settlements = useMemo<RecommendedSettlement[]>(() => {
    return ((group as any)?.recommended_settlements ||
      []) as RecommendedSettlement[];
  }, [(group as any)?.recommended_settlements]);

  const getSettlementKey = (s: RecommendedSettlement) =>
    `${s.from_user_id}-${s.to_user_id}-${s.amount}`;

  const handleSettlePressInternal = async (s: RecommendedSettlement) => {
    if (!onSettlePress) return;
    const key = getSettlementKey(s);

    // already loading this one
    if (settlingKey === key) return;

    setSettlingKey(key);
    try {
      const maybePromise = onSettlePress(s);
      if (maybePromise && typeof (maybePromise as any).then === 'function') {
        await maybePromise;
      }
    } catch (e) {
      // optional: log / toast
    } finally {
      setSettlingKey(null);
    }
  };

  const memberMap = useMemo(() => {
    const map: Record<number, any> = {};
    group?.members?.forEach((m: any) => {
      map[m.id] = m;
    });
    return map;
  }, [group?.members]);

  const myId = currentUserId;

  const myToPay = useMemo(
    () => (myId ? settlements.filter((s) => s.from_user_id === myId) : []),
    [settlements, myId]
  );

  const myToReceive = useMemo(
    () => (myId ? settlements.filter((s) => s.to_user_id === myId) : []),
    [settlements, myId]
  );

  const otherSettlements = useMemo(
    () =>
      settlements.filter(
        (s) => s.from_user_id !== myId && s.to_user_id !== myId
      ),
    [settlements, myId]
  );

  const net = youAreOwed - youOwe;
  const netPositive = net >= 0;

  // 👇 Aggregate all expenses by paid_by.id so same user is not shown multiple times
  const memberExpenses: MemberExpenseSummary[] = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];
    const map = new Map<number, MemberExpenseSummary>();

    expenses.forEach((exp) => {
      const payer = exp.payer;
      if (!payer) return;
      const id = payer.id;
      const existing = map.get(id);
      const createdAt = exp.created_at as unknown as string | undefined;

      if (!existing) {
        map.set(id, {
          id,
          first_name: payer.first_name,
          last_name: payer.last_name,
          username: payer.username,
          total_amount: Number(exp.amount) || 0,
          last_created_at: createdAt,
          count: 1,
        });
      } else {
        existing.total_amount += Number(exp.amount) || 0;
        existing.count += 1;
        if (
          createdAt &&
          (!existing.last_created_at ||
            new Date(createdAt) > new Date(existing.last_created_at))
        ) {
          existing.last_created_at = createdAt;
        }
      }
    });

    return Array.from(map.values());
  }, [expenses]);

  const mySettlementsHistory = useMemo(
    () =>
      (group?.settlements || []).filter(
        (s: Settlement) => s.from_user_details?.id === myId || s.to_user_details?.id === myId
      ),
    [group?.settlements, myId]
  );

  const pairSettlementInfo = useMemo(() => {
    const info: Record<
      string,
      { totalSettled: number; lastSettledAt: string }
    > = {};

    (group?.settlements || []).forEach((s: any) => {
      if (!s.from_user || !s.to_user) return;
      const key = `${s.from_user.id}-${s.to_user.id}`;
      const amt = Number(s.amount) || 0;

      if (!info[key]) {
        info[key] = {
          totalSettled: amt,
          lastSettledAt: s.settled_at,
        };
      } else {
        info[key].totalSettled += amt;
        if (new Date(s.settled_at) > new Date(info[key].lastSettledAt)) {
          info[key].lastSettledAt = s.settled_at;
        }
      }
    });

    return info;
  }, [group?.settlements]);

  const handleOnSaveExpense = async (updated: Expense) => {
    try {
      await onEditExpense?.(updated);
    } catch (e) {
      console.log('error', e);

    }
  }

  const handleOnDeleteExpense = async (expenseId: number) => {
    try {
      await onDeleteExpense?.(expenseId);
    } catch (e) {
      // optional
    }
  }


// 👇 Detailed expense list with date & time
const renderExpenseItem = ({ item }: { item: Expense }) => {
  const payer = item.payer;
  const isYou = currentUserId && payer?.id === currentUserId;
  const payerLabel = isYou ? 'You' : payer?.first_name || 'Someone';

  const handleOpenEditor = () => {
    // only allow owner to edit/delete — otherwise ignore tap (or you may want view-only)
    if (!isYou) return;
    setEditingExpense(item);
    setEditDescription(item.description || '');
    setIsEditModalVisible(true);
  };

  return (
    <Pressable onPress={handleOpenEditor} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
      <View style={styles.expenseRow}>
        <View style={styles.expenseLeft}>
          <View style={styles.avatarSmall}>
            <Text style={styles.avatarSmallText}>{payer?.first_name?.[0]?.toUpperCase() || '?'}</Text>
          </View>
          <View style={styles.expenseTextWrap}>
            <Text style={[styles.expenseTitle, { color: theme.colors.text }]} numberOfLines={1}>{item.description}</Text>
            <Text style={[styles.expenseSubtitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>Paid by {payerLabel} · {formatDateTime(item.created_at as any)}</Text>
          </View>
        </View>

        <View style={styles.expenseRightSection}>
          <Text style={[styles.expenseAmount, { color: theme.colors.primary }]}>{formatCurrency(Number(item.amount))}</Text>
        </View>
      </View>
    </Pressable>
  );
};
const splitDescription =
  splitMode === 'splitwise'
    ? 'All group members share each expense unless changed.'
    : 'Only selected members share each expense (per expense split).';

return (
  <View style={styles.container}>
    {/* Header: group + net summary */}
    <View style={styles.topRow}>
      <View style={styles.groupInfo}>
        <View style={styles.groupIconWrapper}>
          <Icon
            name={group?.group_icon || 'groups'}
            size={20}
            color={theme.colors.background}
          />
        </View>
        <View>
          <Text
            numberOfLines={1}
            style={[styles.groupTitle, { color: theme.colors.text }]}
          >
            {group?.group_name || 'Group'}
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.groupSubtitle, { color: theme.colors.textSecondary }]}
          >
            Split details summary
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.netBadge,
          {
            backgroundColor: netPositive
              ? theme.colors.successSoft
              : theme.colors.dangerSoft,
          },
        ]}
      >
        <Text
          style={[
            styles.netBadgeLabel,
            {
              color: netPositive
                ? theme.colors.success
                : theme.colors.danger,
            },
          ]}
        >
          {netPositive ? 'You get' : 'You owe'}
        </Text>
        <Text
          style={[
            styles.netBadgeAmount,
            {
              color: netPositive
                ? theme.colors.success
                : theme.colors.danger,
            },
          ]}
        >
          {formatCurrency(Math.abs(net))}
        </Text>
      </View>
    </View>

    {/* Split mode toggle row */}
    <View style={styles.splitModeRow}>
      <Text style={[styles.splitModeLabel, { color: theme.colors.textSecondary }]}>
        Split mode
      </Text>
      <View style={styles.splitModeChips}>
        <Pressable
          style={[
            styles.splitChip,
            splitMode === 'splitwise' && styles.splitChipActive,
          ]}
          onPress={() => onChangeSplitMode?.(group, 'splitwise')}
        >
          <Text
            style={[
              styles.splitChipText,
              {
                color:
                  splitMode === 'splitwise'
                    ? theme.colors.background
                    : theme.colors.textSecondary,
              },
            ]}
            numberOfLines={1}
          >
            All group members
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.splitChip,
            splitMode === 'tricount' && styles.splitChipActive,
          ]}
          onPress={() => onChangeSplitMode?.(group, 'tricount')}
        >
          <Text
            style={[
              styles.splitChipText,
              {
                color:
                  splitMode === 'tricount'
                    ? theme.colors.black
                    : theme.colors.textSecondary,
              },
            ]}
            numberOfLines={1}
          >
            Selected members per expense
          </Text>
        </Pressable>
      </View>
    </View>

    <Text
      style={[
        styles.splitModeDescription,
        { color: theme.colors.textMuted },
      ]}
      numberOfLines={2}
    >
      {splitDescription}
    </Text>

    {/* Middle: stats cards */}
    <View style={styles.statsRow}>
      <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
          You owe
        </Text>
        <Text style={[styles.statValue, { color: theme.colors.danger }]}>
          {formatCurrency(youOwe)}
        </Text>
      </View>

      <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
          You are owed
        </Text>
        <Text style={[styles.statValue, { color: theme.colors.success }]}>
          {formatCurrency(youAreOwed)}
        </Text>
      </View>

      <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
          Group total
        </Text>
        <Text style={[styles.statValue, { color: theme.colors.primary }]}>
          {formatCurrency(totalExpenses)}
        </Text>
      </View>
    </View>

    {/* Aggregated per-member added amounts */}
    {memberExpenses.length > 0 && (
      <>
        <View style={styles.sectionHeaderRow}>
          <Text
            style={[styles.sectionHeader, { color: theme.colors.text }]}
          >
            Who added how much
          </Text>
          <Text
            style={[
              styles.sectionSubtitle,
              { color: theme.colors.textMuted },
            ]}
          >
            Totals by member
          </Text>
        </View>

        <FlatList
          data={memberExpenses}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => {
            const isYou = currentUserId && item.id === currentUserId;
            return (
              <View style={styles.memberChip}>
                <View style={styles.memberChipHeader}>
                  <View style={styles.avatarSmall}>
                    <Text style={styles.avatarSmallText}>
                      {item?.first_name?.[0]?.toUpperCase() || '?'}
                    </Text>
                  </View>
                  <Text
                    style={[styles.memberNameText, { color: theme.colors.text }]}
                    numberOfLines={1}
                  >
                    {isYou ? 'You' : item.first_name}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.memberChipSubtitle,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Added {item.count} expense{item.count > 1 ? 's' : ''}
                </Text>
                <Text
                  style={[
                    styles.memberChipAmount,
                    { color: theme.colors.primary },
                  ]}
                >
                  {formatCurrency(item.total_amount)}
                </Text>
                {item.last_created_at && (
                  <Text
                    style={[
                      styles.memberChipMeta,
                      { color: theme.colors.textMuted },
                    ]}
                    numberOfLines={1}
                  >
                    Last: {formatDateTime(item.last_created_at)}
                  </Text>
                )}
              </View>
            );
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          contentContainerStyle={{ paddingVertical: 4 }}
        />
      </>
    )}

    {/* Recent expenses with date & time */}
    {expenses && expenses.length > 0 && (
      <>
        <View style={styles.sectionHeaderRow}>
          <Text
            style={[styles.sectionHeader, { color: theme.colors.text }]}
          >
            Recent expenses
          </Text>
          <Text
            style={[
              styles.sectionSubtitle,
              { color: theme.colors.textMuted },
            ]}
          >
            With date & time
          </Text>
        </View>
        <ExpenseEditModal
          visible={isEditModalVisible}
          expense={editingExpense}
          onClose={() => {
            setIsEditModalVisible(false);
            setEditingExpense(null);
            setEditDescription('');
          }}
          onSave={handleOnSaveExpense}
          onDelete={handleOnDeleteExpense}
        />

        <FlatList
          data={expenses}
          keyExtractor={(item) => String(item.expense_id)}
          renderItem={renderExpenseItem}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
        />
      </>
    )}

    {mySettlementsHistory.length > 0 && (
      <>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>
            Recent settlements
          </Text>
          <Text
            style={[
              styles.sectionSubtitle,
              { color: theme.colors.textMuted },
            ]}
          >
            What has already been settled
          </Text>
        </View>

        {mySettlementsHistory.slice(0, 5).map((s, idx) => {
          const youArePayer = s.from_user_details.id === myId;
          const friend = youArePayer ? s.to_user_details : s.from_user_details;
          const friendName = friend.first_name || friend.username || 'Friend';
          const label = youArePayer
            ? `You paid ${friendName}`
            : `${friendName} paid you`;

          return (
            <View key={`hist-${idx}`} style={styles.settleRow}>
              <View style={styles.settleLeft}>
                <View style={styles.avatarSmall}>
                  <Text style={styles.avatarSmallText}>
                    {friendName[0]?.toUpperCase() || '?'}
                  </Text>
                </View>
                <View style={styles.balanceTextWrap}>
                  <Text
                    style={[styles.balanceTitle, { color: theme.colors.text }]}
                    numberOfLines={1}
                  >
                    {label}
                  </Text>
                  <Text
                    style={[
                      styles.balanceSubtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    {formatCurrency(Number(s.amount))} ·{' '}
                    {formatDateTime(s.settled_at as any)}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  borderRadius: 999,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  backgroundColor: theme.colors.successSoft,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '600',
                    color: theme.colors.success,
                  }}
                >
                  Settled
                </Text>
              </View>
            </View>
          );
        })}
      </>
    )}

    {/* Divider */}
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: theme.colors.border,
        marginVertical: 8,
      }}
    />

    {/* Settlements */}
    <View style={styles.balancesHeaderRow}>
      <Text style={[styles.balancesHeader, { color: theme.colors.text }]}>
        Settlements
      </Text>
      <Text style={{ fontSize: 12, color: theme.colors.textMuted }}>
        Who should pay whom
      </Text>
    </View>

    {settlements.length === 0 && (
      <Text
        style={{
          fontSize: 12,
          color: theme.colors.textMuted,
          marginTop: 4,
        }}
      >
        Everyone is settled up ✅
      </Text>
    )}

    {/* For you */}
    {myId && (myToPay.length > 0 || myToReceive.length > 0) && (
      <View style={styles.sectionBlock}>
        <Text
          style={[
            styles.sectionHeader,
            { color: theme.colors.textSecondary, marginBottom: 4 },
          ]}
        >
          For you
        </Text>

        {myToPay.map((s, idx) => {
          const friend = memberMap[s.to_user_id];
          const friendName = friend?.first_name || friend?.username || 'Friend';
          const isLoading = settlingKey === getSettlementKey(s);

          const pairKey = getPairKey(s.from_user_id, s.to_user_id);
          const pairInfo = pairSettlementInfo[pairKey];

          return (
            <View key={`you-pay-${idx}`} style={styles.settleRow}>
              <View style={styles.settleLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {friendName[0]?.toUpperCase() || '?'}
                  </Text>
                </View>
                <View style={styles.balanceTextWrap}>
                  <Text
                    style={[styles.balanceTitle, { color: theme.colors.text }]}
                    numberOfLines={1}
                  >
                    You pay {friendName}
                  </Text>

                  {/* Pending amount */}
                  <Text
                    style={[
                      styles.balanceSubtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    Pending: {formatCurrency(s.amount)}
                  </Text>

                  {/* Already settled info, if any */}
                  {pairInfo && (
                    <Text
                      style={[
                        styles.balanceSubtitle,
                        { color: theme.colors.textMuted },
                      ]}
                      numberOfLines={1}
                    >
                      Already settled: {formatCurrency(pairInfo.totalSettled)} ·
                      {' '}
                      Last on {formatDateTime(pairInfo.lastSettledAt)}
                    </Text>
                  )}
                </View>
              </View>

              <Pressable
                style={[
                  styles.settleButton,
                  (isLoading || !onSettlePress) && styles.settleButtonDisabled,
                ]}
                onPress={() => handleSettlePressInternal(s)}
                disabled={isLoading || !onSettlePress}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={theme.colors.black} />
                ) : (
                  <>
                    <Icon
                      name="check-circle-outline"
                      size={16}
                      color={theme.colors.black}
                    />
                    <Text style={styles.settleButtonText}>Settle</Text>
                  </>
                )}
              </Pressable>
            </View>
          );
        })}



        {/* Someone pays you */}
        {myToReceive.map((s, idx) => {
          const friend = memberMap[s.from_user_id];
          const friendName = friend?.first_name || friend?.username || 'Friend';

          return (
            <View key={`you-get-${idx}`} style={styles.settleRow}>
              <View style={styles.settleLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {friendName[0]?.toUpperCase() || '?'}
                  </Text>
                </View>
                <View style={styles.balanceTextWrap}>
                  <Text
                    style={[styles.balanceTitle, { color: theme.colors.text }]}
                    numberOfLines={1}
                  >
                    {friendName} will pay you
                  </Text>
                  <Text
                    style={[
                      styles.balanceSubtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    {formatCurrency(s.amount)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    )}

    {/* Between others */}
    {otherSettlements.length > 0 && (
      <View style={styles.sectionBlock}>
        {myId && (
          <Text
            style={[
              styles.sectionHeader,
              { color: theme.colors.textSecondary, marginBottom: 4 },
            ]}
          >
            Between others
          </Text>
        )}

        {otherSettlements.map((s, idx) => {
          const from = memberMap[s.from_user_id];
          const to = memberMap[s.to_user_id];

          const fromName = from?.first_name || from?.username || 'Someone';
          const toName = to?.first_name || to?.username || 'Someone';

          const pairKey = getPairKey(s.from_user_id, s.to_user_id);
          const pairInfo = pairSettlementInfo[pairKey];

          return (
            <View key={`other-${idx}`} style={styles.settleRow}>
              <View style={styles.settleLeft}>
                <View style={styles.avatarSmall}>
                  <Text style={styles.avatarSmallText}>
                    {fromName[0]?.toUpperCase() || '?'}
                  </Text>
                </View>
                <View style={styles.balanceTextWrap}>
                  <Text
                    style={[styles.balanceTitle, { color: theme.colors.text }]}
                    numberOfLines={1}
                  >
                    {fromName} pays {toName}
                  </Text>

                  {/* Pending amount */}
                  <Text
                    style={[
                      styles.balanceSubtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    Pending: {formatCurrency(s.amount)}
                  </Text>

                  {/* Already settled info, if any */}
                  {pairInfo && (
                    <Text
                      style={[
                        styles.balanceSubtitle,
                        { color: theme.colors.textMuted },
                      ]}
                      numberOfLines={1}
                    >
                      Already settled: {formatCurrency(pairInfo.totalSettled)} ·
                      {' '}
                      Last on {formatDateTime(pairInfo.lastSettledAt)}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          );
        })}


      </View>
    )}
  </View>
);
};

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal: 12,
      marginTop: 8,
      marginBottom: 12,
      padding: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.cardSoft,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: theme.colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    groupInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    groupIconWrapper: {
      width: 32,
      height: 32,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.secondary,
      marginRight: 8,
    },
    groupTitle: {
      fontSize: 16,
      fontWeight: '700',
    },
    groupSubtitle: {
      fontSize: 12,
      marginTop: 1,
    },
    netBadge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    netBadgeLabel: {
      fontSize: 10,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    netBadgeAmount: {
      fontSize: 14,
      fontWeight: '700',
    },

    // split mode
    splitModeRow: {
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    splitModeLabel: {
      fontSize: 12,
      fontWeight: '500',
    },
    splitModeChips: {
      flexDirection: 'row',
      columnGap: 6,
      flexShrink: 1,
      justifyContent: 'flex-end',
    },
    splitChip: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.colors.border,
      maxWidth: 150,
      alignItems: 'center',
      justifyContent: 'center',
    },
    splitChipActive: {
      borderColor: theme.colors.button,
      backgroundColor: theme.colors.button,
    },
    splitChipText: {
      fontSize: 10,
      fontWeight: '500',
    },
    splitModeDescription: {
      marginTop: 4,
      fontSize: 11,
    },

    statsRow: {
      flexDirection: 'row',
      marginTop: 10,
      columnGap: 8,
    },
    statCard: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: 8,
      paddingHorizontal: 10,
      justifyContent: 'center',
    },
    statLabel: {
      fontSize: 11,
      marginBottom: 2,
    },
    statValue: {
      fontSize: 14,
      fontWeight: '700',
    },

    sectionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 4,
    },
    sectionHeader: {
      fontSize: 14,
      fontWeight: '600',
    },
    sectionSubtitle: {
      fontSize: 12,
    },

    memberChip: {
      width: 130,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    memberChipHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    avatarSmall: {
      width: 24,
      height: 24,
      borderRadius: 999,
      backgroundColor: theme.colors.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 6,
    },
    avatarSmallText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.background,
    },
    memberNameText: {
      fontSize: 12,
      fontWeight: '600',
      flexShrink: 1,
    },
    memberChipSubtitle: {
      fontSize: 11,
      marginBottom: 2,
    },
    memberChipAmount: {
      fontSize: 13,
      fontWeight: '700',
    },
    memberChipMeta: {
      fontSize: 10,
      marginTop: 2,
    },

    expenseRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    expenseLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    expenseRightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    expenseTextWrap: {
      flexShrink: 1,
    },
    expenseTitle: {
      fontSize: 13,
      fontWeight: '600',
    },
    expenseSubtitle: {
      fontSize: 11,
      marginTop: 1,
    },
    expenseAmount: {
      fontSize: 14,
      fontWeight: '700',
    },
    expenseActionsRow: {
      flexDirection: 'row',
      gap: 4,
    },
    expenseActionButton: {
      width: 28,
      height: 28,
      borderRadius: 999,
      backgroundColor: theme.colors.card,
      justifyContent: 'center',
      alignItems: 'center',
    },
    expenseActionButtonDisabled: {
      opacity: 0.6,
    },

    balancesHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
      marginTop: 4,
    },
    balancesHeader: {
      fontSize: 14,
      fontWeight: '600',
    },

    balanceTextWrap: {
      flexShrink: 1,
    },
    balanceTitle: {
      fontSize: 13,
      fontWeight: '600',
    },
    balanceSubtitle: {
      fontSize: 11,
      marginTop: 1,
    },

    avatar: {
      width: 30,
      height: 30,
      borderRadius: 999,
      backgroundColor: theme.colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    avatarText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },

    sectionBlock: {
      marginTop: 6,
      marginBottom: 4,
    },

    settleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 6,
    },
    settleLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: theme.colors.button,
      shadowColor: theme.colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    settleButtonDisabled: {
      opacity: 0.6,
    },
    settleButtonText: {
      marginLeft: 4,
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.black,
    },

  });

export default GroupSummary;
