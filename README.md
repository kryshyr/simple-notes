# SimpleNotes 📝

A simple note-taking application built with React Native and Expo. Stay organized and keep track of your thoughts, tasks, and ideas with this intuitive mobile app.

## What You Can Do 🚀

### 1. Login Screen
- Simple login form with validation
- Mock credentials for testing:
  - Username: `test`
  - Password: `password123`
- Form validation for empty fields and invalid credentials
- Session persistence (stays logged in after app restart)

### 2. Home Dashboard (Coming Soon)
- **Note Management**: Create, view, edit, and delete notes
- **Search**: Filter notes by title or description
- **Add Notes**: Pop-up modal to create new notes
- **Empty State**: Helpful message when no notes exist
- **Logout**: Clear session and return to login

## Technologies Used 🛠️

- **React Native** with Expo
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **NativeWind** for styling (Tailwind CSS for React Native)

## Setup Instructions 🚀

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd simple-notes
   npm install
   ```

2. **Start the app**
   ```bash
   npx expo start
   ```

3. **Run on device**
   - Scan QR code with Expo Go app
   - Or run on iOS/Android simulator

### Test Login
- Username: `test`
- Password: `password123`

## Development Commands 📋

```bash
# Start development server
npx expo start

# Clear cache and start
npx expo start --clear

# Run on simulators
npx expo run:ios
npx expo run:android
```

## Learn More 📚

- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/docs/getting-started)
- [Redux Toolkit documentation](https://redux-toolkit.js.org/)