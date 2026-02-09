import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { COLORS, SPACING, TYPOGRAPHY } from '@/theme/colors';
import { GlassCard } from './GlassCard';

const screenWidth = Dimensions.get('window').width;

interface ChartConfig {
  backgroundColor: string;
  backgroundGradientFrom: string;
  backgroundGradientTo: string;
  decimalPlaces: number;
  color: (opacity?: number) => string;
  labelColor: (opacity?: number) => string;
  style: {
    borderRadius: number;
  };
  propsForDots: {
    r: string;
    strokeWidth: string;
    stroke: string;
  };
}

const chartConfig: ChartConfig = {
  backgroundColor: COLORS.dark[400],
  backgroundGradientFrom: COLORS.dark[400],
  backgroundGradientTo: COLORS.dark[300],
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 105, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.7})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: COLORS.primary[500],
  },
};

interface LineChartComponentProps {
  data: {
    labels: string[];
    datasets: { data: number[] }[];
  };
  title: string;
}

export const LineChartComponent: React.FC<LineChartComponentProps> = ({ data, title }) => {
  return (
    <GlassCard style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={data}
        width={screenWidth - SPACING.md * 4}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={false}
        withOuterLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
      />
    </GlassCard>
  );
};

interface PieChartComponentProps {
  data: {
    name: string;
    population: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
  }[];
  title: string;
}

export const PieChartComponent: React.FC<PieChartComponentProps> = ({ data, title }) => {
  return (
    <GlassCard style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <PieChart
        data={data}
        width={screenWidth - SPACING.md * 4}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        style={styles.chart}
      />
    </GlassCard>
  );
};

interface BarChartComponentProps {
  data: {
    labels: string[];
    datasets: { data: number[] }[];
  };
  title: string;
}

export const BarChartComponent: React.FC<BarChartComponentProps> = ({ data, title }) => {
  return (
    <GlassCard style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <BarChart
        data={data}
        width={screenWidth - SPACING.md * 4}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={chartConfig}
        style={styles.chart}
        withInnerLines={false}
        showBarTops={false}
        fromZero
      />
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  chart: {
    marginVertical: SPACING.sm,
    borderRadius: 16,
  },
});
