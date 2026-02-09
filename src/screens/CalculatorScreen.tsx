import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { GlassCard, Button, LineChartComponent } from '@/components';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '@/theme/colors';
import { CALCULATOR_TYPES } from '@/constants';
import { calculateSIP, calculateLumpsum, calculateEMI } from '@/utils/helpers';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

type CalculatorType = 'sip' | 'lumpsum' | 'emi' | 'credit' | 'inflation' | 'fire';

export const CalculatorScreen = () => {
  const [selectedCalculator, setSelectedCalculator] = useState<CalculatorType | null>(null);
  
  if (!selectedCalculator) {
    return <CalculatorList onSelect={setSelectedCalculator} />;
  }
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setSelectedCalculator(null)}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      
      {selectedCalculator === 'sip' && <SIPCalculator />}
      {selectedCalculator === 'lumpsum' && <LumpsumCalculator />}
      {selectedCalculator === 'emi' && <EMICalculator />}
      {selectedCalculator === 'credit' && <CreditCardCalculator />}
      {selectedCalculator === 'inflation' && <InflationCalculator />}
      {selectedCalculator === 'fire' && <FIRECalculator />}
    </View>
  );
};

const CalculatorList: React.FC<{ onSelect: (type: CalculatorType) => void }> = ({
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Calculator Hub</Text>
          <Text style={styles.subtitle}>Financial planning tools</Text>
        </View>
        
        {CALCULATOR_TYPES.map((calc, index) => (
          <Animated.View key={calc.id} entering={FadeInDown.delay(index * 100)}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onSelect(calc.id as CalculatorType);
              }}
              activeOpacity={0.7}
            >
              <GlassCard
                gradient
                gradientColors={[`${calc.color}30`, `${calc.color}10`]}
                style={styles.calcCard}
              >
                <View style={styles.calcContent}>
                  <View style={[styles.calcIcon, { backgroundColor: `${calc.color}20` }]}>
                    <Text style={styles.calcEmoji}>{calc.icon}</Text>
                  </View>
                  <View style={styles.calcInfo}>
                    <Text style={styles.calcName}>{calc.name}</Text>
                    <Text style={styles.calcDescription}>{calc.description}</Text>
                  </View>
                  <Text style={styles.arrow}>→</Text>
                </View>
              </GlassCard>
            </TouchableOpacity>
          </Animated.View>
        ))}
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const SIPCalculator: React.FC = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(10);
  
  const result = calculateSIP(monthlyInvestment, returnRate, years);
  
  const chartData = {
    labels: result.yearlyBreakdown
      .filter((_, i) => i % Math.ceil(years / 6) === 0)
      .map((y) => `Y${y.year}`),
    datasets: [
      {
        data: result.yearlyBreakdown
          .filter((_, i) => i % Math.ceil(years / 6) === 0)
          .map((y) => y.value),
      },
    ],
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.calcHeader}>
        <Text style={styles.calcTitle}>📊 SIP Calculator</Text>
        <Text style={styles.calcSubtitle}>Systematic Investment Plan</Text>
      </View>
      
      {/* Inputs */}
      <GlassCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>
          Monthly Investment: ₹{monthlyInvestment.toLocaleString()}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={500}
          maximumValue={100000}
          step={500}
          value={monthlyInvestment}
          onValueChange={setMonthlyInvestment}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.dark[200]}
          thumbTintColor={COLORS.primary[500]}
        />
      </GlassCard>
      
      <GlassCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>Expected Return: {returnRate}% p.a.</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={30}
          step={0.5}
          value={returnRate}
          onValueChange={setReturnRate}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.dark[200]}
          thumbTintColor={COLORS.primary[500]}
        />
      </GlassCard>
      
      <GlassCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>Time Period: {years} years</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={40}
          step={1}
          value={years}
          onValueChange={setYears}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.dark[200]}
          thumbTintColor={COLORS.primary[500]}
        />
      </GlassCard>
      
      {/* Results */}
      <GlassCard
        gradient
        gradientColors={['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.05)']}
        style={styles.resultCard}
      >
        <Text style={styles.resultTitle}>Results</Text>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Total Investment</Text>
          <Text style={styles.resultValue}>
            ₹{result.totalInvestment.toLocaleString()}
          </Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Estimated Returns</Text>
          <Text style={[styles.resultValue, { color: COLORS.income }]}>
            ₹{result.estimatedReturns.toLocaleString()}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Total Value</Text>
          <Text style={[styles.resultValue, styles.totalValue]}>
            ₹{result.totalValue.toLocaleString()}
          </Text>
        </View>
      </GlassCard>
      
      {/* Chart */}
      <LineChartComponent data={chartData} title="Investment Growth" />
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const LumpsumCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState(100000);
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(10);
  
  const result = calculateLumpsum(principal, returnRate, years);
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.calcHeader}>
        <Text style={styles.calcTitle}>💰 Lumpsum Calculator</Text>
        <Text style={styles.calcSubtitle}>One-time Investment</Text>
      </View>
      
      <GlassCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>
          Investment Amount: ₹{principal.toLocaleString()}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={10000}
          maximumValue={10000000}
          step={10000}
          value={principal}
          onValueChange={setPrincipal}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.dark[200]}
          thumbTintColor={COLORS.primary[500]}
        />
      </GlassCard>
      
      <GlassCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>Expected Return: {returnRate}% p.a.</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={30}
          step={0.5}
          value={returnRate}
          onValueChange={setReturnRate}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.dark[200]}
          thumbTintColor={COLORS.primary[500]}
        />
      </GlassCard>
      
      <GlassCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>Time Period: {years} years</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={40}
          step={1}
          value={years}
          onValueChange={setYears}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.dark[200]}
          thumbTintColor={COLORS.primary[500]}
        />
      </GlassCard>
      
      <GlassCard
        gradient
        gradientColors={['rgba(59, 130, 246, 0.2)', 'rgba(59, 130, 246, 0.05)']}
        style={styles.resultCard}
      >
        <Text style={styles.resultTitle}>Results</Text>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Principal Amount</Text>
          <Text style={styles.resultValue}>₹{result.totalInvestment.toLocaleString()}</Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Estimated Returns</Text>
          <Text style={[styles.resultValue, { color: COLORS.income }]}>
            ₹{result.estimatedReturns.toLocaleString()}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Maturity Value</Text>
          <Text style={[styles.resultValue, styles.totalValue]}>
            ₹{result.totalValue.toLocaleString()}
          </Text>
        </View>
      </GlassCard>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const EMICalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  
  const result = calculateEMI(loanAmount, interestRate, tenure);
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.calcHeader}>
        <Text style={styles.calcTitle}>🏦 EMI Calculator</Text>
        <Text style={styles.calcSubtitle}>Loan EMI Calculator</Text>
      </View>
      
      <GlassCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>Loan Amount: ₹{loanAmount.toLocaleString()}</Text>
        <Slider
          style={styles.slider}
          minimumValue={100000}
          maximumValue={10000000}
          step={50000}
          value={loanAmount}
          onValueChange={setLoanAmount}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.dark[200]}
          thumbTintColor={COLORS.primary[500]}
        />
      </GlassCard>
      
      <GlassCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>Interest Rate: {interestRate}% p.a.</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={20}
          step={0.1}
          value={interestRate}
          onValueChange={setInterestRate}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.dark[200]}
          thumbTintColor={COLORS.primary[500]}
        />
      </GlassCard>
      
      <GlassCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>Loan Tenure: {tenure} years</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={30}
          step={1}
          value={tenure}
          onValueChange={setTenure}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.dark[200]}
          thumbTintColor={COLORS.primary[500]}
        />
      </GlassCard>
      
      <GlassCard
        gradient
        gradientColors={['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.05)']}
        style={styles.resultCard}
      >
        <Text style={styles.resultTitle}>Results</Text>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Monthly EMI</Text>
          <Text style={[styles.resultValue, styles.emiValue]}>
            ₹{result.emi.toLocaleString()}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Principal Amount</Text>
          <Text style={styles.resultValue}>₹{loanAmount.toLocaleString()}</Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Total Interest</Text>
          <Text style={[styles.resultValue, { color: COLORS.expense }]}>
            ₹{result.totalInterest.toLocaleString()}
          </Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Total Payment</Text>
          <Text style={styles.resultValue}>
            ₹{result.totalPayment.toLocaleString()}
          </Text>
        </View>
      </GlassCard>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const CreditCardCalculator: React.FC = () => {
  const [balance, setBalance] = useState(50000);
  const [apr, setApr] = useState(36);
  const [monthlyPayment, setMonthlyPayment] = useState(5000);
  
  const monthlyRate = apr / 12 / 100;
  const monthsToPayoff = Math.log(monthlyPayment / (monthlyPayment - balance * monthlyRate)) / Math.log(1 + monthlyRate);
  const totalInterest = (monthlyPayment * monthsToPayoff) - balance;
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.calcHeader}>
        <Text style={styles.calcTitle}>💳 Credit Card Calculator</Text>
        <Text style={styles.calcSubtitle}>Payoff Calculator</Text>
      </View>
      
      <GlassCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>Outstanding Balance: ₹{balance.toLocaleString()}</Text>
        <Slider
          style={styles.slider}
          minimumValue={1000}
          maximumValue={500000}
          step={1000}
          value={balance}
          onValueChange={setBalance}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.dark[200]}
          thumbTintColor={COLORS.primary[500]}
        />
      </GlassCard>
      
      <GlassCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>APR: {apr}%</Text>
        <Slider
          style={styles.slider}
          minimumValue={12}
          maximumValue={48}
          step={1}
          value={apr}
          onValueChange={setApr}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.dark[200]}
          thumbTintColor={COLORS.primary[500]}
        />
      </GlassCard>
      
      <GlassCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>
          Monthly Payment: ₹{monthlyPayment.toLocaleString()}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={balance * monthlyRate}
          maximumValue={balance}
          step={100}
          value={monthlyPayment}
          onValueChange={setMonthlyPayment}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.dark[200]}
          thumbTintColor={COLORS.primary[500]}
        />
      </GlassCard>
      
      <GlassCard
        gradient
        gradientColors={['rgba(139, 92, 246, 0.2)', 'rgba(139, 92, 246, 0.05)']}
        style={styles.resultCard}
      >
        <Text style={styles.resultTitle}>Results</Text>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Months to Payoff</Text>
          <Text style={styles.resultValue}>
            {isFinite(monthsToPayoff) ? Math.ceil(monthsToPayoff) : 'N/A'}
          </Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Total Interest</Text>
          <Text style={[styles.resultValue, { color: COLORS.expense }]}>
            ₹{isFinite(totalInterest) ? totalInterest.toLocaleString() : 'N/A'}
          </Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Total Amount Paid</Text>
          <Text style={styles.resultValue}>
            ₹{isFinite(monthsToPayoff) ? (monthlyPayment * Math.ceil(monthsToPayoff)).toLocaleString() : 'N/A'}
          </Text>
        </View>
      </GlassCard>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const InflationCalculator: React.FC = () => {
  const [currentAmount, setCurrentAmount] = useState(100000);
  const [inflationRate, setInflationRate] = useState(6);
  const [years, setYears] = useState(10);
  
  const futureValue = currentAmount / Math.pow(1 + inflationRate / 100, years);
  const purchasingPowerLoss = currentAmount - futureValue;
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.calcHeader}>
        <Text style={styles.calcTitle}>📉 Inflation Calculator</Text>
        <Text style={styles.calcSubtitle}>Purchasing Power Impact</Text>
      </View>
      
      <GlassCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>
          Current Amount: ₹{currentAmount.toLocaleString()}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={10000}
          maximumValue={10000000}
          step={10000}
          value={currentAmount}
          onValueChange={setCurrentAmount}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.dark[200]}
          thumbTintColor={COLORS.primary[500]}
        />
      </GlassCard>
      
      <GlassCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>Inflation Rate: {inflationRate}%</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={15}
          step={0.5}
          value={inflationRate}
          onValueChange={setInflationRate}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.dark[200]}
          thumbTintColor={COLORS.primary[500]}
        />
      </GlassCard>
      
      <GlassCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>Time Period: {years} years</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={40}
          step={1}
          value={years}
          onValueChange={setYears}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.dark[200]}
          thumbTintColor={COLORS.primary[500]}
        />
      </GlassCard>
      
      <GlassCard
        gradient
        gradientColors={['rgba(245, 158, 11, 0.2)', 'rgba(245, 158, 11, 0.05)']}
        style={styles.resultCard}
      >
        <Text style={styles.resultTitle}>Results</Text>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Today's Value</Text>
          <Text style={styles.resultValue}>₹{currentAmount.toLocaleString()}</Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Future Purchasing Power</Text>
          <Text style={styles.resultValue}>₹{futureValue.toLocaleString()}</Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Purchasing Power Loss</Text>
          <Text style={[styles.resultValue, { color: COLORS.expense }]}>
            ₹{purchasingPowerLoss.toLocaleString()}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <Text style={styles.inflationNote}>
          In {years} years, ₹{currentAmount.toLocaleString()} will have the purchasing
          power of ₹{futureValue.toLocaleString()} in today's terms
        </Text>
      </GlassCard>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const FIRECalculator: React.FC = () => {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(45);
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [monthlySavings, setMonthlySavings] = useState(30000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  
  const yearsToRetirement = retirementAge - currentAge;
  const requiredCorpus = monthlyExpenses * 12 * 25; // 25x annual expenses (4% rule)
  
  const futureValue = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement) +
    monthlySavings * 12 * (Math.pow(1 + expectedReturn / 100, yearsToRetirement) - 1) / (expectedReturn / 100);
  
  const deficit = Math.max(0, requiredCorpus - futureValue);
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.calcHeader}>
        <Text style={styles.calcTitle}>🔥 FIRE Calculator</Text>
        <Text style={styles.calcSubtitle}>Financial Independence, Retire Early</Text>
      </View>
      
      <GlassCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>Current Age: {currentAge}</Text>
        <Slider
          style={styles.slider}
          minimumValue={18}
          maximumValue={60}
          step={1}
          value={currentAge}
          onValueChange={setCurrentAge}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.dark[200]}
          thumbTintColor={COLORS.primary[500]}
        />
      </GlassCard>
      
      <GlassCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>Target Retirement Age: {retirementAge}</Text>
        <Slider
          style={styles.slider}
          minimumValue={currentAge + 1}
          maximumValue={70}
          step={1}
          value={retirementAge}
          onValueChange={setRetirementAge}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.dark[200]}
          thumbTintColor={COLORS.primary[500]}
        />
      </GlassCard>
      
      <GlassCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>
          Monthly Expenses: ₹{monthlyExpenses.toLocaleString()}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={10000}
          maximumValue={200000}
          step={5000}
          value={monthlyExpenses}
          onValueChange={setMonthlyExpenses}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.dark[200]}
          thumbTintColor={COLORS.primary[500]}
        />
      </GlassCard>
      
      <GlassCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>
          Current Savings: ₹{currentSavings.toLocaleString()}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10000000}
          step={50000}
          value={currentSavings}
          onValueChange={setCurrentSavings}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.dark[200]}
          thumbTintColor={COLORS.primary[500]}
        />
      </GlassCard>
      
      <GlassCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>
          Monthly Savings: ₹{monthlySavings.toLocaleString()}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100000}
          step={1000}
          value={monthlySavings}
          onValueChange={setMonthlySavings}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.dark[200]}
          thumbTintColor={COLORS.primary[500]}
        />
      </GlassCard>
      
      <GlassCard style={styles.inputCard}>
        <Text style={styles.inputLabel}>Expected Return: {expectedReturn}% p.a.</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={20}
          step={0.5}
          value={expectedReturn}
          onValueChange={setExpectedReturn}
          minimumTrackTintColor={COLORS.primary[500]}
          maximumTrackTintColor={COLORS.dark[200]}
          thumbTintColor={COLORS.primary[500]}
        />
      </GlassCard>
      
      <GlassCard
        gradient
        gradientColors={['rgba(236, 72, 153, 0.2)', 'rgba(236, 72, 153, 0.05)']}
        style={styles.resultCard}
      >
        <Text style={styles.resultTitle}>FIRE Analysis</Text>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Required Corpus (25x Rule)</Text>
          <Text style={styles.resultValue}>₹{requiredCorpus.toLocaleString()}</Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Projected Savings</Text>
          <Text style={[styles.resultValue, { color: COLORS.income }]}>
            ₹{futureValue.toLocaleString()}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        {deficit > 0 ? (
          <>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Shortfall</Text>
              <Text style={[styles.resultValue, { color: COLORS.expense }]}>
                ₹{deficit.toLocaleString()}
              </Text>
            </View>
            <Text style={styles.fireNote}>
              You need to save more to achieve FIRE by age {retirementAge}
            </Text>
          </>
        ) : (
          <Text style={[styles.fireNote, { color: COLORS.income }]}>
            🎉 You're on track to achieve FIRE by age {retirementAge}!
          </Text>
        )}
      </GlassCard>
      
      <View style={{ height: 40 }} />
    </ScrollView>
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
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
  },
  calcCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  calcContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calcIcon: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  calcEmoji: {
    fontSize: 28,
  },
  calcInfo: {
    flex: 1,
  },
  calcName: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  calcDescription: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
  },
  arrow: {
    fontSize: TYPOGRAPHY.sizes.xl,
    color: COLORS.text.secondary,
  },
  backButton: {
    position: 'absolute',
    top: SPACING.xxl,
    left: SPACING.lg,
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.glass.light,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  backIcon: {
    fontSize: TYPOGRAPHY.sizes.xl,
    color: COLORS.text.primary,
  },
  calcHeader: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl * 1.5,
    paddingBottom: SPACING.lg,
  },
  calcTitle: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  calcSubtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
  },
  inputCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  resultCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  resultTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  resultLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
  },
  resultValue: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
  },
  totalValue: {
    fontSize: TYPOGRAPHY.sizes.xl,
    color: COLORS.primary[400],
  },
  emiValue: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    color: COLORS.primary[400],
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.dark[200],
    marginVertical: SPACING.sm,
  },
  inflationNote: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    lineHeight: 20,
    marginTop: SPACING.sm,
  },
  fireNote: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    lineHeight: 20,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});
