#!/bin/bash

# Création forcée du fichier local.properties attendu par Gradle
mkdir -p android
echo "sdk.dir=/home/expo/android-sdk" > android/local.properties

# Injection de la variable d'environnement AdMob attendue par la bibliothèque publicitaire
echo "googleMobileAdsJson={\"android_app_id\":\"ca-app-pub-7768106667453820~6590622719\",\"ios_app_id\":\"ca-app-pub-3940256099942544~1458002511\"}" >> android/gradle.properties

echo "✅ Variables AdMob injectées avec succès pour le cloud d'Expo !"
