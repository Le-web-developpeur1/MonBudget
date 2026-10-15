# 📱 MonBudget - Application Mobile de Gestion Financière

**MonBudget** est une application mobile native et performante développée avec **React Native** et **Expo (SDK 57)**. Conçue avec une approche orientée expérience utilisateur (UI/UX) premium en mode sombre, elle permet aux utilisateurs de suivre leurs finances personnelles, de catégoriser leurs flux monétaires (Revenus & Dépenses) et de visualiser leur solde en temps réel en monnaie locale (Franc Guinéen - FG).

L'application intègre une architecture moderne et une monétisation active via le SDK de publicité mobile de Google.

---

## ✨ Fonctionnalités Principales

- 🔐 **Authentification Sécurisée** : Écrans de Connexion et d'Inscription épurés avec gestion des états utilisateurs.
- 💰 **Suivi Budgétaire Dynamique** : Tableau de bord complet affichant le solde actuel, le total des entrées (Revenus) et le total des sorties (Dépenses) mis à jour instantanément.
- 📊 **Historique des Transactions** : Liste des transactions récentes avec un système d'onglets pour filtrer et catégoriser les mouvements financiers.
- 💵 **Calculs en Temps Réel** : Intégration de filtres algorithmiques pour le calcul automatique des flux financiers du mois.
- 📢 **Monétisation Google AdMob** : Intégration native de bannières publicitaires adaptatives et sécurisées (`react-native-google-mobile-ads`) optimisées pour la Nouvelle Architecture d'Expo.
- 🎨 **Design Premium Sourdine** : Interface utilisateur moderne et soignée en mode sombre, optimisée pour le confort visuel.

---

## 🛠️ Stack Technique

- **Framework** : [React Native](https://reactnative.dev) & [Expo (SDK 57)](https://expo.dev)
- **Navigation** : Expo Router (Navigation basée sur le système de fichiers)
- **Gestion d'État (State Management)** : [Zustand](https://github.com) (Magasin d'état persistant, global et ultra-rapide)
- **Composants Natifs** : React Native Safe Area Context, Gesture Handler, Reanimated 4, Vector Icons
- **Monétisation** : Google AdMob SDK (Bannières adaptatives de production)
- **Langage** : TypeScript (Typage statique sécurisé)

---

## 🚀 Installation et Développement Local

### Prérequis
Assurez-vous d'avoir installé [Node.js](https://nodejs.org), le CLI d'Expo et les outils de développement Android (Android SDK / Java JDK).

1. **Cloner le projet**
   ```bash
   git clone git@github.com:Le-web-developpeur1/MonBudget.git
   cd mon-budget
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer l'environnement de développement (Expo Go)**
   ```bash
   npx expo start
   ```

4. **Compiler l'application en mode natif (Android Debug)**
   ```bash
   npx expo run:android
   ```

---

## 📦 Déploiement et Production (EAS Build)

L'application est configurée pour utiliser **EAS (Expo Application Services)** afin de générer des builds de production optimisés et signés dans le cloud.

Pour générer un fichier APK d'installation autonome, la configuration utilise le profil d'environnement crypté d'EAS :
```bash
eas build --platform android --profile preview
```

---

## 👤 Développeur

- **Boubacar Bah** - *Développeur Web & Mobile React Native / TypeScript Freelance*
- Portfolio : https://boubacarbah-portfolio.vercel.app/
