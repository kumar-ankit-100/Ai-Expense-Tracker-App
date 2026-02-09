import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { GlassCard, Button } from '@/components';
import { useStore } from '@/store';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '@/theme/colors';
import { APP_CONFIG } from '@/constants';

export const ProfileScreen = () => {
  const user = useStore((state) => state.user);
  const updateUserSettings = useStore((state) => state.updateUserSettings);
  const resetAllData = useStore((state) => state.resetAllData);
  const exportData = useStore((state) => state.exportData);
  const transactions = useStore((state) => state.transactions);
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // In a real app, you would use Clerk's signOut here
            useStore.setState({ user: null });
          },
        },
      ]
    );
  };
  
  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your transactions and data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetAllData();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'All data has been reset');
          },
        },
      ]
    );
  };
  
  const handleExportData = async () => {
    try {
      const data = exportData();
      await Share.share({
        message: data,
        title: 'Export Finance Data',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.lg }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        
        {/* User Info Card */}
        <GlassCard
          gradient
          gradientColors={['rgba(0, 105, 255, 0.3)', 'rgba(0, 105, 255, 0.1)']}
          style={styles.userCard}
        >
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'G'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'guest@example.com'}</Text>
          <View style={styles.userBadge}>
            <Text style={styles.userBadgeText}>✨ Premium</Text>
          </View>
        </GlassCard>
        
        {/* Stats */}
        <View style={styles.statsContainer}>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statEmoji}>📝</Text>
            <Text style={styles.statValue}>{transactions.length}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </GlassCard>
          
          <GlassCard style={styles.statCard}>
            <Text style={styles.statEmoji}>📅</Text>
            <Text style={styles.statValue}>
              {Math.ceil((Date.now() - new Date(user?.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24))}
            </Text>
            <Text style={styles.statLabel}>Days Active</Text>
          </GlassCard>
        </View>
        
        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity onPress={handleExportData}>
            <GlassCard style={styles.actionCard}>
              <Text style={styles.actionIcon}>📤</Text>
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Export Data</Text>
                <Text style={styles.actionDescription}>
                  Download your data as JSON
                </Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </GlassCard>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleResetData}>
            <GlassCard style={styles.actionCard}>
              <Text style={styles.actionIcon}>🗑️</Text>
              <View style={styles.actionInfo}>
                <Text style={[styles.actionTitle, { color: COLORS.error }]}>
                  Reset All Data
                </Text>
                <Text style={styles.actionDescription}>
                  Delete all transactions and settings
                </Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </GlassCard>
          </TouchableOpacity>
        </View>
        
        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <GlassCard style={styles.aboutCard}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Version</Text>
              <Text style={styles.aboutValue}>{APP_CONFIG.VERSION}</Text>
            </View>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>App Name</Text>
              <Text style={styles.aboutValue}>{APP_CONFIG.APP_NAME}</Text>
            </View>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Support</Text>
              <Text style={styles.aboutValue}>{APP_CONFIG.SUPPORT_EMAIL}</Text>
            </View>
          </GlassCard>
        </View>
        
        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark[400],
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
  },
  userCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
  },
  userName: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  userBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.primary[500] + '30',
    borderRadius: RADIUS.full,
    marginTop: SPACING.xs,
  },
  userBadgeText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.primary[400],
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: 32,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary[400],
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  actionCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
  },
  actionArrow: {
    fontSize: TYPOGRAPHY.sizes.xl,
    color: COLORS.text.secondary,
  },
  aboutCard: {
    marginHorizontal: SPACING.md,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.dark[200],
  },
  aboutLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
  },
  aboutValue: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
  },
  logoutButton: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
});
