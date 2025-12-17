import { FC, useContext } from "react";
import { Group } from "../../types/group";
import { useGroup } from "../api/hooks/useGroups";
import { useTheme } from "../Hooks/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from "../Context/AppProvider";

interface GroupListItemProps {
  item: Group;
  handleGroupAndTransaction: (group: Group) => void;
}

export const GroupListItem: FC<GroupListItemProps> = ({
  item,
  handleGroupAndTransaction,
}) => {
  const theme = useTheme();
  const { state: { user } } = useContext(AppContext);
  const { data: {
    data: { group } = {},
  } = {},
    isLoading,
    isError,
  } = useGroup(item.group_id); // ✅ valid hook usage

  console.log('group **', group);


  const formatCurrency = (n: number) => {
    if (isNaN(n)) return '₹0';
    return `₹${n.toFixed(0)}`;
  };

  const lightColors: Record<string, string> = {
    home: '#FFE0B2',
    'flight-takeoff': '#FFF3E0',
    'local-bar': '#F5F5DC',
    group: '#E0F2F1',
    'family-restroom': '#E0F7FA',
    groups: '#E0E0E0',
  };


  const iconName = item?.group_icon || 'group';
  const iconBg = lightColors[iconName] || lightColors['groups'];

  // ---- use API data if available, else fallback ----
  // assuming backend returns: total_expense, balances, members, lastActivity etc.

  const totalGroupExpense = group?.total_expense ?
    Number(group?.total_expense)
    : 0;

  const membersCount = Array.isArray(group?.members)
    ? group!.members.length
    : 4;

  // TODO: get logged-in user id from context/prop
  const currentUserId = user?.id; // <--- replace with real user id

  const myBalance =
    group?.balances?.find((b: any) => b.id === currentUserId)
      ?.balance ?? 0;

  console.log('myBalance', myBalance);


  const isPositive = myBalance >= 0;
  const youGet = isPositive ? myBalance : 0;
  const youOwe = isPositive ? 0 : Math.abs(myBalance);

  const lastActivity =
    group?.created_at || 'Last expense · 2 days ago';

  return (
    <Pressable
      onPress={() => handleGroupAndTransaction(item)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.colors.pr },
        pressed && styles.pressed,
      ]}
    >
      {/* Left accent + icon */}
      <View style={styles.leftCol}>
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
          <Icon
            name={iconName}
            size={26}
            color={theme.colors.background}
          />
        </View>
        <View
          style={[
            styles.accentBar,
            { backgroundColor: theme.colors.accentSoft },
          ]}
        />
      </View>

      {/* Main content */}
      <View style={styles.middle}>
        {/* Top row: title + net badge */}
        <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={1}
              style={[styles.title, { color: theme.colors.text }]}
            >
              {item?.group_name || 'Untitled Group'}
            </Text>
          </View>

          <View
            style={[
              styles.netBadge,
              {
                backgroundColor: isPositive
                  ? theme.colors.successSoft
                  : theme.colors.dangerSoft,
              },
            ]}
          >
            <Text
              style={[
                styles.netBadgeLabel,
                {
                  color: isPositive
                    ? theme.colors.success
                    : theme.colors.danger,
                },
              ]}
            >
              {isPositive ? 'You get' : 'You owe'}
            </Text>
            <Text
              style={[
                styles.netBadgeAmount,
                {
                  color: isPositive
                    ? theme.colors.success
                    : theme.colors.danger,
                },
              ]}
            >
              {formatCurrency(Math.abs(myBalance))}
            </Text>
          </View>
        </View>

        {/* Stats: total + members */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Icon
              name="receipt-long"
              size={16}
              color={theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.statText,
                { color: theme.colors.textSecondary },
              ]}
            >
              Total {formatCurrency(totalGroupExpense)}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Icon
              name="group"
              size={16}
              color={theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.statText,
                { color: theme.colors.textSecondary },
              ]}
            >
              {membersCount} members
            </Text>
          </View>
        </View>

        {/* Chips + last activity */}
        <View style={styles.bottomRow}>
          <View style={styles.chipRow}>
            <View
              style={[
                styles.chip,
                { backgroundColor: theme.colors.warningSoft },
              ]}
            >
              <Text
                style={[
                  styles.chipLabel,
                  { color: theme.colors.textMuted },
                ]}
              >
                You owe
              </Text>
              <Text
                style={[
                  styles.chipValue,
                  { color: theme.colors.danger },
                ]}
              >
                {formatCurrency(youOwe)}
              </Text>
            </View>

            <View
              style={[
                styles.chip,
                { backgroundColor: theme.colors.primarySoft },
              ]}
            >
              <Text
                style={[
                  styles.chipLabel,
                  { color: theme.colors.textMuted },
                ]}
              >
                You get
              </Text>
              <Text
                style={[
                  styles.chipValue,
                  { color: theme.colors.success },
                ]}
              >
                {formatCurrency(youGet)}
              </Text>
            </View>
          </View>

          <View style={styles.lastActivityWrap}>
            <Icon
              name="schedule"
              size={14}
              color={theme.colors.textMuted}
            />
            <Text
              numberOfLines={1}
              style={[
                styles.lastActivityText,
                { color: theme.colors.textMuted },
              ]}
            >
              {lastActivity}
            </Text>
          </View>
        </View>
      </View>

      {/* Right chevron */}
      <View style={styles.chevronWrap}>
        <Icon
          name="chevron-right"
          size={24}
          color={theme.colors.primary}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 18,
    padding: 12,
    elevation: 4,
    shadowColor: '#000', // can also be a token if you want
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  pressed: {
    opacity: 0.96,
    transform: [{ scale: 0.995 }],
  },
  leftCol: {
    alignItems: 'center',
    marginRight: 10,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accentBar: {
    marginTop: 6,
    width: 4,
    borderRadius: 999,
    height: 32,
  },
  middle: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  netBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  netBadgeLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  netBadgeAmount: {
    fontSize: 13,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
  },
  statText: {
    fontSize: 12,
  },
  bottomRow: {
    marginTop: 8,
  },
  chipRow: {
    flexDirection: 'row',
    columnGap: 8,
  },
  chip: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipLabel: {
    fontSize: 11,
  },
  chipValue: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '700',
  },
  lastActivityWrap: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 4,
  },
  lastActivityText: {
    fontSize: 11,
  },
  chevronWrap: {
    justifyContent: 'center',
    marginLeft: 6,
  },
  emptyWrap: {
    marginTop: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
  },
});
