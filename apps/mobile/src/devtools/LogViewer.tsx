import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { logger, LogEntry, LogLevel } from './Logger';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const LOG_COLORS: Record<LogLevel, string> = {
  info: '#2196F3',
  warn: '#FF9800',
  error: '#F44336',
  debug: '#9C27B0',
  api: '#FF5722',
};

export default function LogViewer({ visible, onClose }: Props) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<LogLevel | 'all'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (visible) {
      const allLogs = logger.getLogs();
      setLogs(allLogs);
    }
  }, [visible]);

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.level === filter;
    const matchesSearch = search === '' || 
      log.message.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const copyLogsToClipboard = () => {
    const logText = filteredLogs.map(log => {
      let text = `[${formatTime(log.timestamp)}] ${log.level.toUpperCase()}: ${log.message}`;
      if (log.data) text += `\nData: ${JSON.stringify(log.data, null, 2)}`;
      if (log.stack) text += `\nStack: ${log.stack}`;
      return text;
    }).join('\n\n');
    
    Clipboard.setString(logText);
    Alert.alert('Copied', 'Logs copied to clipboard');
  };

  const renderLogEntry = (log: LogEntry) => (
    <View key={log.id} style={styles.logEntry}>
      <View style={styles.logHeader}>
        <View style={[styles.levelBadge, { backgroundColor: LOG_COLORS[log.level] }]}>
          <Text style={styles.levelText}>{log.level.toUpperCase()}</Text>
        </View>
        <Text style={styles.timestamp}>{formatTime(log.timestamp)}</Text>
      </View>
      <Text style={styles.message}>{log.message}</Text>
      {log.data && (
        <Text style={styles.data}>{JSON.stringify(log.data, null, 2)}</Text>
      )}
      {log.stack && (
        <Text style={styles.stack}>{log.stack}</Text>
      )}
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Debug Logs</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.controls}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search logs..."
              value={search}
              onChangeText={setSearch}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterRow}>
                {(['all', 'error', 'api', 'warn', 'info', 'debug'] as const).map(level => (
                  <Pressable
                    key={level}
                    style={[
                      styles.filterButton,
                      filter === level && styles.filterButtonActive,
                      level !== 'all' && { backgroundColor: LOG_COLORS[level] + '20' }
                    ]}
                    onPress={() => setFilter(level)}
                  >
                    <Text style={[
                      styles.filterText,
                      filter === level && styles.filterTextActive
                    ]}>
                      {level.toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.actions}>
            <Pressable 
              style={styles.actionButton} 
              onPress={() => setLogs(logger.getLogs())}
            >
              <Text>Refresh</Text>
            </Pressable>
            <Pressable 
              style={styles.actionButton} 
              onPress={() => {
                logger.clearLogs();
                setLogs([]);
              }}
            >
              <Text>Clear</Text>
            </Pressable>
            <Pressable 
              style={styles.actionButton} 
              onPress={copyLogsToClipboard}
            >
              <Text>Copy</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.logsList}>
            {filteredLogs.length === 0 ? (
              <Text style={styles.noLogs}>No logs found</Text>
            ) : (
              filteredLogs.map(renderLogEntry)
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  controls: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  logsList: {
    flex: 1,
    padding: 16,
  },
  logEntry: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ddd',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  message: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  data: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  stack: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
    marginTop: 4,
  },
  noLogs: {
    textAlign: 'center',
    color: '#666',
    marginTop: 50,
  },
});