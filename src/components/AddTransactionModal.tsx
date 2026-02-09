import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '@/theme/colors';
import { Button } from './Button';
import { GlassCard } from './GlassCard';
import { CATEGORIES, TRANSACTION_TYPES } from '@/constants';
import { useStore } from '@/store';
import { geminiService } from '@/services/ai';
import * as Haptics from 'expo-haptics';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose,
}) => {
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [isAICategorizing, setIsAICategorizing] = useState(false);
  const [aiConfidence, setAiConfidence] = useState<number | null>(null);
  
  const addTransaction = useStore((state) => state.addTransaction);
  
  const handleAICategorize = async () => {
    if (!title || !amount) return;
    
    setIsAICategorizing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      const result = await geminiService.categorizeTransaction(
        title,
        parseFloat(amount),
        note
      );
      
      const category = CATEGORIES.find((cat) => cat.id === result.category);
      if (category) {
        setSelectedCategory(category);
        setAiConfidence(result.confidence);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('AI Categorization Error:', error);
    } finally {
      setIsAICategorizing(false);
    }
  };
  
  const handleSave = () => {
    if (!amount || !title) return;
    
    addTransaction({
      title,
      amount: parseFloat(amount),
      type,
      category: selectedCategory.id,
      categoryIcon: selectedCategory.icon,
      categoryColor: selectedCategory.color,
      date: new Date().toISOString(),
      note,
      aiCategorized: aiConfidence !== null,
      aiConfidence: aiConfidence || undefined,
    });
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Reset form
    setAmount('');
    setTitle('');
    setNote('');
    setType('expense');
    setSelectedCategory(CATEGORIES[0]);
    setAiConfidence(null);
    
    onClose();
  };
  
  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.fullScreenContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Add Transaction</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Type Selector */}
              <View style={styles.typeContainer}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    type === 'expense' && styles.typeButtonActive,
                    { borderColor: COLORS.expense },
                  ]}
                  onPress={() => setType('expense')}
                >
                  <Text
                    style={[
                      styles.typeText,
                      type === 'expense' && { color: COLORS.expense },
                    ]}
                  >
                    Expense
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    type === 'income' && styles.typeButtonActive,
                    { borderColor: COLORS.income },
                  ]}
                  onPress={() => setType('income')}
                >
                  <Text
                    style={[
                      styles.typeText,
                      type === 'income' && { color: COLORS.income },
                    ]}
                  >
                    Income
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* Amount Input */}
              <GlassCard style={styles.inputCard}>
                <Text style={styles.label}>Amount</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.text.tertiary}
                  keyboardType="numeric"
                />
              </GlassCard>
              
              {/* Title Input */}
              <GlassCard style={styles.inputCard}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g., Grocery shopping"
                  placeholderTextColor={COLORS.text.tertiary}
                />
              </GlassCard>
              
              {/* AI Categorize Button */}
              {title && amount && (
                <Button
                  title={isAICategorizing ? 'AI Categorizing...' : '✨ AI Categorize'}
                  onPress={handleAICategorize}
                  variant="gradient"
                  loading={isAICategorizing}
                  style={styles.aiButton}
                />
              )}
              
              {/* Category Selection */}
              <Text style={styles.sectionTitle}>
                Category
                {aiConfidence && (
                  <Text style={styles.confidence}>
                    {' '}
                    (AI: {Math.round(aiConfidence * 100)}%)
                  </Text>
                )}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory.id === category.id && {
                        backgroundColor: `${category.color}30`,
                        borderColor: category.color,
                      },
                    ]}
                    onPress={() => {
                      setSelectedCategory(category);
                      setAiConfidence(null);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              {/* Note Input */}
              <GlassCard style={styles.inputCard}>
                <Text style={styles.label}>Note (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.noteInput]}
                  value={note}
                  onChangeText={setNote}
                  placeholder="Add a note..."
                  placeholderTextColor={COLORS.text.tertiary}
                  multiline
                  numberOfLines={3}
                />
              </GlassCard>
            </ScrollView>
            
            {/* Save Button - Fixed at bottom */}
            <View style={styles.buttonContainer}>
              <Button
                title="Save Transaction"
                onPress={handleSave}
                variant="gradient"
                size="large"
                fullWidth
                disabled={!amount || !title}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.dark[400],
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    backgroundColor: COLORS.dark[400],
    paddingTop: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.dark[200],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.dark[100],
  },
  closeText: {
    fontSize: TYPOGRAPHY.sizes.xl,
    color: COLORS.text.primary,
  },
  typeContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  typeButton: {
    flex: 1,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    borderColor: COLORS.dark[200],
    alignItems: 'center',
    backgroundColor: COLORS.dark[300],
  },
  typeButtonActive: {
    backgroundColor: COLORS.dark[200],
  },
  typeText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.secondary,
  },
  inputCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.dark[200],
    borderRadius: RADIUS.xl,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  input: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.primary,
    paddingVertical: SPACING.sm,
  },
  amountInput: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    paddingVertical: SPACING.sm,
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: SPACING.sm,
  },
  aiButton: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  confidence: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.primary[400],
  },
  categoryScroll: {
    marginBottom: SPACING.lg,
    paddingLeft: SPACING.lg,
  },
  categoryButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.dark[300],
    marginRight: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 90,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  categoryName: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    textAlign: 'center',
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  saveButton: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  scrollContent: {
    paddingBottom: SPACING.md,
  },
  buttonContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xxl : SPACING.lg,
    backgroundColor: COLORS.dark[400],
    borderTopWidth: 1,
    borderTopColor: COLORS.dark[200],
  },
});
