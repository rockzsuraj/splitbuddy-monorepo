import React, { FC } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet
} from 'react-native';
import { useTheme } from '../../Hooks/theme';
import { GroupListItem } from '../GroupListItem';
import { Group } from '../../../types/group';

interface Props {
  group: Group[];
  backGroundColor?: string;
  handleGroupAndTransaction: (group: Group) => void;
}

const GroupList: FC<Props> = ({ group = [], handleGroupAndTransaction }) => {
  const theme = useTheme();
  

  const renderItem = ({ item }: { item: Group }) => {
    console.log('render item', item);
    
    return (
      <GroupListItem
        item={item}
        handleGroupAndTransaction={handleGroupAndTransaction}
      />
    );
  }
  const keyExtractor = (item: Group, index: number) =>
    String(item?.group_id ?? index);

  return (
    <FlatList
      data={group}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={() => (
        <View style={styles.emptyWrap}>
          <Text
            style={[styles.emptyText, { color: theme.colors.textMuted }]}
          >
            No groups yet — create a group to start splitting.
          </Text>
        </View>
      )}
    />
  );
};

export default GroupList;

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