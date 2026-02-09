# 🎨 Customization Guide

Learn how to customize the AI Finance Tracker to match your needs!

## 🎨 Changing Colors

### Update the Color Scheme

Edit `src/theme/colors.ts`:

```typescript
export const COLORS = {
  // Change primary color
  primary: {
    500: '#FF6B6B', // Your custom color
    // ... other shades
  },
  
  // Change income/expense colors
  income: '#4ECDC4',
  expense: '#FF6B6B',
};
```

### Add New Gradients

```typescript
gradients: {
  custom: ['#FF6B6B', '#FF8E53'],
},
```

Then use in components:
```typescript
<GlassCard
  gradient
  gradientColors={COLORS.gradients.custom}
/>
```

## 📊 Adding New Categories

Edit `src/constants/index.ts`:

```typescript
export const CATEGORIES = [
  // Add your category
  { 
    id: 'gaming', 
    name: 'Gaming', 
    icon: '🎮', 
    color: '#9B59B6' 
  },
  // ... existing categories
];
```

## 💱 Adding New Currencies

Edit `src/constants/index.ts`:

```typescript
export const CURRENCIES = [
  // Add your currency
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  // ... existing currencies
];
```

## 🧮 Adding a New Calculator

Create a new calculator component in `src/screens/CalculatorScreen.tsx`:

```typescript
const MyCalculator: React.FC = () => {
  const [input1, setInput1] = useState(0);
  const [input2, setInput2] = useState(0);
  
  // Your calculation logic
  const result = input1 * input2;
  
  return (
    <ScrollView>
      <GlassCard style={styles.inputCard}>
        <Text>Input 1: {input1}</Text>
        <Slider
          value={input1}
          onValueChange={setInput1}
          minimumValue={0}
          maximumValue={1000}
        />
      </GlassCard>
      
      <GlassCard style={styles.resultCard}>
        <Text>Result: {result}</Text>
      </GlassCard>
    </ScrollView>
  );
};
```

Then add to calculator list:

```typescript
export const CALCULATOR_TYPES = [
  {
    id: 'mycalc',
    name: 'My Calculator',
    description: 'My custom calculator',
    icon: '🔢',
    color: '#FF6B6B',
  },
  // ... existing calculators
];
```

## 🎨 Creating Custom Components

### Example: Custom Card

Create `src/components/MyCard.tsx`:

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from './GlassCard';
import { COLORS, SPACING } from '@/theme/colors';

interface MyCardProps {
  title: string;
  value: number;
}

export const MyCard: React.FC<MyCardProps> = ({ title, value }) => {
  return (
    <GlassCard style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
  },
  title: {
    color: COLORS.text.secondary,
  },
  value: {
    color: COLORS.text.primary,
    fontSize: 24,
  },
});
```

Then export in `src/components/index.ts`:
```typescript
export { MyCard } from './MyCard';
```

## 📱 Adding a New Screen

1. Create `src/screens/MyScreen.tsx`:

```typescript
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { GlassCard } from '@/components';
import { COLORS, SPACING } from '@/theme/colors';

export const MyScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>My Custom Screen</Text>
        <GlassCard>
          <Text>Content here</Text>
        </GlassCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark[400],
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    padding: SPACING.lg,
  },
});
```

2. Add to navigation in `src/navigation/BottomTabNavigator.tsx`:

```typescript
import { MyScreen } from '@/screens/MyScreen';

// In the Tab.Navigator:
<Tab.Screen
  name="MyTab"
  component={MyScreen}
  options={{
    tabBarIcon: ({ focused }) => (
      <TabIcon icon="⭐" label="My Tab" focused={focused} />
    ),
  }}
/>
```

## 🔧 Customizing the AI

### Change AI Prompt

Edit `src/constants/index.ts`:

```typescript
export const AI_PROMPTS = {
  CATEGORIZE: `Your custom prompt here...`,
};
```

### Add Custom Rules

Edit `src/services/ai/gemini.ts`:

```typescript
const rules: Record<string, string[]> = {
  gaming: ['steam', 'playstation', 'xbox', 'game'],
  // ... add your rules
};
```

## 🎭 Adding New Themes

Edit `src/constants/index.ts`:

```typescript
export const THEMES = {
  DARK: 'dark',
  BLUE: 'blue',
  AMOLED: 'amoled',
  CUSTOM: 'custom', // Add new theme
} as const;
```

Then handle in theme logic:

```typescript
const getThemeColors = (theme: string) => {
  switch (theme) {
    case 'custom':
      return { backgroundColor: '#YOUR_COLOR' };
    // ... existing themes
  }
};
```

## 📊 Customizing Charts

### Change Chart Colors

In any screen with charts:

```typescript
const chartConfig = {
  backgroundColor: '#YOUR_BG_COLOR',
  backgroundGradientFrom: '#START_COLOR',
  backgroundGradientTo: '#END_COLOR',
  color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
  // ... other options
};
```

### Add More Data Points

Modify chart data in `src/screens/AnalyticsScreen.tsx`:

```typescript
const monthlyTrendData = useMemo(() => {
  // Your custom data logic
  return {
    labels: ['Jan', 'Feb', 'Mar', ...],
    datasets: [{ data: [100, 200, 300, ...] }],
  };
}, [dependencies]);
```

## 🗄️ Extending the Store

Add new state in `src/store/index.ts`:

```typescript
interface AppState {
  // ... existing state
  
  // Add new state
  myCustomData: any[];
  setMyCustomData: (data: any[]) => void;
}

// In the store:
myCustomData: [],
setMyCustomData: (data) => set({ myCustomData: data }),
```

## 🎨 Typography Customization

Edit `src/theme/colors.ts`:

```typescript
export const TYPOGRAPHY = {
  sizes: {
    // Add custom sizes
    huge: 64,
    tiny: 8,
  },
  fonts: {
    // Add custom fonts
    heading: 'YourFont-Bold',
    body: 'YourFont-Regular',
  },
};
```

## 📱 App Configuration

Edit `app.json`:

```json
{
  "expo": {
    "name": "My Finance App",
    "slug": "my-finance-app",
    "icon": "./src/assets/my-icon.png",
    "splash": {
      "image": "./src/assets/my-splash.png"
    }
  }
}
```

## 🔔 Adding Notifications (Future)

1. Install expo-notifications:
```bash
expo install expo-notifications
```

2. Create notification service:
```typescript
// src/services/notifications.ts
import * as Notifications from 'expo-notifications';

export const scheduleNotification = async (title: string, body: string) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { seconds: 1 },
  });
};
```

## 🎯 Best Practices

### When Adding Features
1. Create types first in `src/types/`
2. Add constants if needed in `src/constants/`
3. Build reusable components in `src/components/`
4. Create screen in `src/screens/`
5. Update navigation
6. Test thoroughly

### Code Style
- Use TypeScript strictly
- Follow existing patterns
- Use theme tokens (COLORS, SPACING)
- Add proper types
- Keep components small
- Extract logic to hooks/utils

### Testing Changes
```bash
# Clear cache if needed
npm start -- --clear

# Type check
npm run type-check

# Lint
npm run lint
```

## 📚 Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)

## 🎨 Design Resources

- [Colors](https://coolors.co/)
- [Icons](https://emojipedia.org/)
- [Gradients](https://uigradients.com/)
- [Typography](https://type-scale.com/)

## 💡 Tips

1. **Always test on both iOS and Android**
2. **Use theme tokens instead of hardcoded values**
3. **Keep components pure and reusable**
4. **Add TypeScript types for safety**
5. **Follow the existing folder structure**
6. **Document complex logic**

---

**Customize away! Make it yours! 🎨**
