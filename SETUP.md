# 🚀 Quick Start Guide

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

If you encounter any issues, try:
```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Add your API keys:
```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
```

### 3. Start Development Server
```bash
npm start
```

Then:
- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Scan QR code with Expo Go app on your phone

## Getting Gemini API Key (Required for AI Features)

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to your `.env` file

**Note**: The app works without Gemini API key, but falls back to rule-based categorization.

## Optional: Clerk Authentication Setup

If you want to use real authentication:

1. Visit [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Select "React Native" as platform
4. Copy the Publishable Key
5. Add it to your `.env` file

**Note**: The app has a built-in guest mode if you skip this step.

## Common Issues & Solutions

### Issue: Metro bundler not starting
**Solution**:
```bash
npm start -- --clear
```

### Issue: iOS build fails
**Solution**:
```bash
cd ios && pod install && cd ..
npm start
```

### Issue: Android build fails
**Solution**:
```bash
npm start -- --clear
```

### Issue: Reanimated not working
**Solution**: Make sure `babel-plugin-reanimated` is the last plugin in `babel.config.js`

## Project Features Checklist

- ✅ AI-Powered Transaction Categorization
- ✅ Advanced Analytics Dashboard
- ✅ 6 Financial Calculators (SIP, Lumpsum, EMI, Credit, Inflation, FIRE)
- ✅ Beautiful Glassmorphism UI
- ✅ Smooth 60fps Animations
- ✅ Haptic Feedback
- ✅ Dark Mode
- ✅ Local Data Persistence
- ✅ Export/Import Data
- ✅ Multi-Currency Support
- ✅ Theme Switching

## Development Tips

### Hot Reload
- Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android) to open dev menu
- Enable Fast Refresh for instant updates

### Debugging
- Use React Native Debugger
- Or Chrome DevTools via dev menu

### Performance
- Use Flipper for performance profiling
- Monitor with React DevTools

## Building for Production

### iOS (requires Mac)
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

## Testing the App

### Guest Mode Testing
1. Start the app
2. Click "Continue as Guest" on login screen
3. Explore all features

### Manual Testing Checklist
- [ ] Add income transaction
- [ ] Add expense transaction
- [ ] Test AI categorization
- [ ] View analytics charts
- [ ] Use SIP calculator
- [ ] Use EMI calculator
- [ ] Change currency
- [ ] Change theme
- [ ] Export data
- [ ] Logout and login again

## App Structure Overview

```
Dashboard → View balance, recent transactions, AI insights
Analytics → Charts, trends, spending analysis
Calculator → 6 financial calculators with real-time results
Profile → Settings, data management, themes
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Set up environment variables
3. ✅ Get Gemini API key
4. ✅ Start the app
5. 🎯 Add your first transaction
6. 📊 Explore analytics
7. 🧮 Try calculators
8. ⚙️ Customize settings

## Support

If you encounter any issues:
1. Check the README.md for detailed documentation
2. Clear cache: `npm start -- --clear`
3. Reinstall dependencies: `rm -rf node_modules && npm install`

---

**Happy Coding! 🚀**
