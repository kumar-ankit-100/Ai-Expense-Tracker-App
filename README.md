# 💰 AI-Powered Finance Tracker

A production-quality, AI-powered finance tracking mobile application built with React Native (Expo). This app features advanced UI/UX with glassmorphism, smooth animations, and AI-powered transaction categorization using Google's Gemini API.

## ✨ Features

### 🔐 Authentication
- Clerk-based authentication (Email/Google)
- Guest mode for quick access
- Secure session management

### 🧠 AI-Powered Features
- **Smart Transaction Categorization**: Uses Gemini AI to automatically categorize transactions
- **Intelligent Insights**: AI-generated spending insights and recommendations
- **Confidence Scoring**: See how confident the AI is about each categorization
- **Fallback Logic**: Rule-based categorization when AI is unavailable

### 🏠 Dashboard
- **Beautiful Balance Card**: Animated balance display with glassmorphism
- **Quick Stats**: Transaction count, monthly summary, active categories
- **AI Insights Card**: Personalized spending insights
- **Top Spending Categories**: Visual breakdown with progress bars
- **Recent Transactions**: Swipeable transaction list
- **Floating Action Button**: Quick transaction addition

### 📊 Advanced Analytics
- **Multiple Time Periods**: Week, Month, Year views
- **Income vs Expense Tracking**: Real-time balance calculation
- **Savings Rate**: Track your financial health
- **Interactive Charts**:
  - Monthly expense trend (Line Chart)
  - Category distribution (Pie Chart)
  - Income trend (Bar Chart)
- **Spending Velocity**: Daily average and forecasting
- **Smart Insights**: AI-powered spending analysis

### 🧮 Financial Calculators
- **SIP Calculator**: Systematic Investment Plan returns
- **Lumpsum Calculator**: One-time investment growth
- **EMI Calculator**: Loan EMI with detailed breakdown
- **Credit Card Calculator**: Payoff time and interest calculation
- **Inflation Calculator**: Purchasing power impact
- **FIRE Calculator**: Financial Independence Retire Early planning

Each calculator includes:
- Real-time slider inputs
- Visual growth charts
- Detailed breakdowns
- Save and share results

### 👤 Profile & Settings
- User profile management
- Currency selection (INR, USD, EUR, GBP, JPY, AUD, CAD)
- Theme switching (Dark, Blue, AMOLED)
- Data export (JSON format)
- Reset all data
- App information

### 🎨 UI/UX Excellence
- **Glassmorphism**: Modern glass-effect cards with blur
- **Smooth Animations**: 60fps animations using Reanimated
- **Micro-interactions**: Haptic feedback on every interaction
- **Gesture Support**: Swipeable components
- **Responsive Design**: Works on all screen sizes
- **Dark Mode**: Eye-friendly design
- **Skeleton Loaders**: Smooth loading states
- **Empty States**: Beautiful placeholders

## 🛠️ Tech Stack

### Core
- **React Native**: 0.73.4
- **Expo**: ~50.0.0
- **TypeScript**: 5.3.3

### State Management
- **Zustand**: Global state management
- **AsyncStorage**: Data persistence
- **MMKV**: High-performance storage

### UI/Animation
- **React Native Reanimated**: Smooth animations
- **React Native Gesture Handler**: Touch interactions
- **Expo Blur**: Glassmorphism effects
- **Expo Linear Gradient**: Beautiful gradients
- **NativeWind**: Tailwind CSS for React Native

### Navigation
- **React Navigation**: Bottom tabs + Stack navigation
- **React Navigation Bottom Tabs**: Tab navigation
- **React Navigation Native Stack**: Screen navigation

### Charts
- **React Native Chart Kit**: Beautiful charts
- **React Native SVG**: Vector graphics
- **Victory Native**: Advanced data visualization

### AI & Services
- **Google Generative AI**: Gemini API integration
- **Expo Haptics**: Tactile feedback
- **Expo Secure Store**: Secure data storage

### Authentication
- **Clerk Expo**: Frontend authentication

## 📁 Project Structure

```
src/
├── app/                    # App configuration
├── components/             # Reusable UI components
│   ├── Button.tsx         # Custom button component
│   ├── GlassCard.tsx      # Glassmorphism card
│   ├── BalanceCard.tsx    # Animated balance display
│   ├── TransactionItem.tsx # Transaction list item
│   ├── Charts.tsx         # Chart components
│   └── AddTransactionModal.tsx # Transaction modal
├── screens/               # Screen components
│   ├── DashboardScreen.tsx
│   ├── AnalyticsScreen.tsx
│   ├── CalculatorScreen.tsx
│   ├── ProfileScreen.tsx
│   └── AuthScreen.tsx
├── navigation/            # Navigation setup
│   └── BottomTabNavigator.tsx
├── store/                 # Zustand store
│   └── index.ts          # Global state management
├── services/              # External services
│   └── ai/
│       └── gemini.ts     # Gemini AI integration
├── utils/                 # Utility functions
│   └── helpers.ts        # Helper functions
├── hooks/                 # Custom React hooks
│   └── index.ts          # Custom hooks
├── theme/                 # Theme configuration
│   └── colors.ts         # Color palette & design tokens
├── constants/             # App constants
│   └── index.ts          # Categories, currencies, etc.
└── types/                 # TypeScript types
    └── index.ts          # Type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Expo CLI installed globally: `npm install -g expo-cli`
- iOS Simulator (for Mac) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   cd Expense-tracker-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your API keys:
   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

### Getting API Keys

#### Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key"
4. Copy the key to your `.env` file

#### Clerk API Key (Optional)
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Get your publishable key from the API Keys section
4. Copy to your `.env` file

## 🎯 Usage

### Adding Transactions
1. Tap the **+** button on the Dashboard
2. Select transaction type (Income/Expense)
3. Enter amount and title
4. Tap "✨ AI Categorize" for smart categorization
5. Or manually select a category
6. Add optional notes
7. Save!

### Viewing Analytics
1. Navigate to **Analytics** tab
2. Select time period (Week/Month/Year)
3. View charts and insights
4. Check your savings rate
5. See spending forecasts

### Using Calculators
1. Navigate to **Calculator** tab
2. Select a calculator type
3. Adjust inputs with sliders
4. View real-time results
5. See detailed breakdowns

### Managing Profile
1. Navigate to **Profile** tab
2. Change currency and theme
3. Export your data
4. Reset data if needed
5. Logout when done

## 🎨 Design Principles

- **Glassmorphism**: Frosted glass effect with blur
- **Neumorphism touches**: Subtle depth and shadows
- **Blue FinTech Theme**: Professional and trustworthy
- **Dark Mode First**: Easy on the eyes
- **60fps Animations**: Buttery smooth interactions
- **Haptic Feedback**: Tactile responses
- **Micro-interactions**: Delightful details

## 🔒 Data & Privacy

- **100% Local Storage**: No backend required
- **Offline First**: Works without internet
- **No Data Collection**: Your data stays on your device
- **Secure Storage**: Encrypted local storage
- **Export Anytime**: Download your data as JSON

## 📱 Screenshots

> Add screenshots here after building the app

## 🏗️ Architecture

### State Management
- Zustand for global state
- AsyncStorage for persistence
- Optimized selectors for performance

### Component Architecture
- Functional components with hooks
- Reusable design system
- Composition over inheritance
- Props validation with TypeScript

### Performance Optimizations
- Memoization with useMemo/useCallback
- FlatList for large lists
- Image optimization
- Lazy loading
- Code splitting

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint
```

## 📦 Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

### EAS Build (Recommended)
```bash
eas build --platform all
```

## 🤝 Contributing

This is a portfolio project, but contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent categorization
- Expo team for amazing tooling
- React Native community
- Design inspiration from Paytm, Zerodha, Jupiter, Fi Money

## 📞 Support

For support, email support@aifinancetracker.com or open an issue in the repository.

## 🚧 Roadmap

- [ ] Budget tracking and alerts
- [ ] Recurring transactions
- [ ] Bill reminders
- [ ] Financial goals
- [ ] Multi-currency support
- [ ] Widgets
- [ ] Apple Watch/Wear OS support
- [ ] Cloud backup (optional)
- [ ] Receipt scanning
- [ ] Bank account integration (read-only)

---

**Built with ❤️ using React Native & AI**

## Version
v1.0.0 - February 2026
