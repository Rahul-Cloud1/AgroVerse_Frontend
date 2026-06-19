# AgroVerseApp 🌱📱

AgroVerseApp is the Web App frontend for the AgroVerse agriculture platform. It delivers marketplace, rental, crop advisory, and order management experiences through a polished React Native app.

## 🚀 Key Features

- 👨‍🌾 **KrishiMitra** – crop advisory and farming support flows
- 🛒 **AgroMart** – shop agricultural supplies, tools, and products
- 🚜 **AgroRent** – rent farm equipment and gardening machines
- 🌿 **AgriKart** – marketplace for bulk produce and farm goods
- 🧾 **Orders** – view order history and manage purchases
- 📍 **Expo Location** – built-in location support for farming services
- 📷 **Image Picker** – upload product or equipment images

## 📦 Tech Stack

- **Expo SDK** – app runtime and build tooling
- **React Native** – cross-platform UI framework
- **TypeScript** – typed JavaScript for safer development
- **React Navigation** – drawer and stack navigation
- **Axios** – API request management
- **AsyncStorage** – local persistence
- **Expo AV, Linear Gradient, Image Picker, Location** – native device features
- **@expo/vector-icons** – iconography

## 🧱 Project Structure

- `App.tsx` – app entry point
- `screens/` – feature screens like `HomeScreen`, `AgroMart`, `AgroRent`, `KrishiMitra`, `Orders`, and `AgriKart`
- `components/` – reusable UI components
- `config/` – API and app configuration
- `contexts/` – app context providers
- `assets/` – images, icons, and data assets
- `public/` – web assets and redirects

## 🚀 Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start the Expo development server:

```bash
npm start
```

3. Run on Android:

```bash
npm run android
```

4. Run on iOS:

```bash
npm run ios
```

5. Run on web:

```bash
npm run web
```

6. Build and serve web output:

```bash
npm run build
npm run serve
```

## ✅ Notes

- Make sure you have the Expo CLI installed globally for native execution.
- This project targets Expo-managed React Native and works across Android, iOS, and web platforms.

## 📄 License

Use this repository as a foundation for your own AgroVerse mobile experience.

