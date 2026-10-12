import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useBudgetStore, Transaction } from '@/store/budgetStore';
import { COLORS } from '@/theme/color';

let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;

try {
  const GoogleAds = require('react-native-google-mobile-ads');
  BannerAd = GoogleAds.BannerAd;
  BannerAdSize = GoogleAds.BannerAdSize;
  TestIds = GoogleAds.TestIds;
} catch (e) {
  // Si on est sur Expo Go, le module plante mais l'application ignore l'erreur sans s'arrêter !
}

export default function HomeScreen() {
  const router = useRouter();
  
  // Utilise TestIds.BANNER si l'outil existe, sinon met une chaîne vide temporaire pour Expo Go
  const adUnitId = __DEV__ ? (TestIds?.BANNER || '') : 'ca-app-pub-7768106667453820/1338296037'; 

  const user = useBudgetStore((state) => state.currentUser);
  const solde = useBudgetStore((state) => state.solde);
  const transactions = useBudgetStore((state) => state.transactions);
  const logout = useBudgetStore((state) => state.logout);

  const totalEntrees = transactions
    .filter(t => t.type === 'revenu')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSorties = transactions
    .filter(t => t.type === 'depense')
    .reduce((sum, t) => sum + t.amount, 0);

  const renderItem = ({ item }: { item: Transaction }) => {
    const isRevenu = item.type === 'revenu';
    return (
      <View style={styles.transactionCard}>
        <View style={styles.transactionLeft}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionDate}>{item.date}</Text>
        </View>
        <Text style={[
          styles.transactionAmount, 
          { color: isRevenu ? COLORS.primary : COLORS.danger }
        ]}>
          {isRevenu ? '+' : '-'} {item.amount.toLocaleString()} FG
        </Text>
      </View>
    );
  };

  return (
      <View style={styles.container}>
          <View style={styles.card}>
              {/* Section En-tête / Profil */}
              <View style={styles.header}>
                  <View>
                      <Text style={styles.welcomeText}>Bonjour, {user?.name || 'Diallo'} 👋</Text>
                      <Text style={styles.subWelcome}>Suivi de vos finances</Text>
                  </View>
                  <TouchableOpacity style={styles.logoutButton} onPress={() => { logout(); router.replace('/'); }}>
                      <Text style={styles.logoutText}>Quitter</Text>
                  </TouchableOpacity>
              </View>
              
              {/* 🔴 SÉCURITÉ GLOBALE : La pub ne s'affiche que si l'application est compilée en natif (EAS Build) et que le module existe */}
              {!__DEV__ && BannerAd && (
                <View style={styles.adContainer}>
                  <BannerAd
                      unitId={adUnitId}
                      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                      requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                      }}
                  />
                </View>
              )}

              {/* Section Carte de Solde Global */}
              <View style={styles.soldeCard}>
                <Text style={styles.soldeLabel}>SOLDE ACTUEL</Text>
                <Text style={styles.soldeAmount}>{solde.toLocaleString()} FG</Text>
                
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                    <Text style={[styles.statValue, { color: COLORS.primary }]}>
                        ▲ +{totalEntrees.toLocaleString()} FG
                    </Text>
                    </View>
                    <View style={styles.statBox}>
                    <Text style={[styles.statValue, { color: COLORS.danger }]}>
                        ▼ -{totalSorties.toLocaleString()} FG
                    </Text>
                    </View>
                </View>
              </View>
          </View>

          {/* Titre Section Historique */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transactions récentes</Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* Liste des transactions récentes */}
            {transactions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Aucune transaction enregistrée pour le moment.</Text>
              </View>
            ) : (
              <FlatList
                data={transactions.slice(0, 5)}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.listContainer}
              />
            )}
          </ScrollView>

          <View style={styles.actionButtonContainer}>
              <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: COLORS.primary}]}
                  onPress={() => router.push({ pathname: '/history', params: {tab: "revenu"}})}
              >
                  <Text style={styles.actionButtonText}>Revenu</Text>
              </TouchableOpacity>

              <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: COLORS.danger}]}
                  onPress={() => router.push({ pathname: '/history', params: {tab: "depense"}})}
              >
                  <Text style={styles.actionButtonText}>Dépense</Text>
              </TouchableOpacity>
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'ios' ? 50 : 20, 
  },
  adContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
  },
  card: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  subWelcome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: COLORS.danger,
    borderRadius: 12
  },
  logoutText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  soldeCard: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
  },
  soldeLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  soldeAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 8,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 16,
  },
  statBox: {
    flex: 1,
  },
  statValue: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  sectionHeader: {
    marginHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  listContainer: {
    marginBottom: 24,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  transactionDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 24,
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: 14,
    paddingHorizontal: 16,
  },
  actionButtonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: COLORS.background,
    paddingTop: 8,
  },
  actionButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  actionButtonText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
