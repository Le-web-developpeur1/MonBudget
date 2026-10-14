import { getCategoryById } from '@/constants/categories';
import { Transaction, useBudgetStore } from '@/store/budgetStore';
import { COLORS } from '@/theme/color';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FilterPeriod = 'aujourdhui' | 'semaine' | 'mois' | 'toutes';

export default function HistoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Onglet actif ('revenu' ou 'depense') hérité de l'accueil
  const [activeTab] = useState<'revenu' | 'depense'>(
    (params.tab === 'revenu' || params.tab === 'depense') ? params.tab : 'depense'
  );
  // Filtre temporel actif (Par défaut 'toutes' comme sur ta maquette)
  const [period, setPeriod] = useState<FilterPeriod>('aujourdhui');

  const transactions = useBudgetStore((state) => state.transactions);

  const supprimerTransaction = useBudgetStore((state) => state.supprimerTransaction);



  // 1. Filtrer d'abord par type (Revenu ou Dépense)
  const typeFiltered = transactions.filter(t => t.type === activeTab);

  // 2. Filtrer ensuite par période (Simulé ici, extensible selon tes besoins réels)
  const filteredTransactions = typeFiltered.filter(t => {
    if (period === 'toutes') return true;
    
    //Parser la date de la transaction
    const [datePart] = t.date.split(',');
    const  [jour, mois, annee] = datePart.split('/').map(Number);
    const transactionDate = new Date(annee, mois - 1, jour);
    transactionDate.setHours(0, 0, 0, 0);

    //Date actuelle
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //Calculer la difference en jours
    const differenceMs = today.getTime() - transactionDate.getTime();
    const differenceJours = Math.floor(differenceMs / (1000 * 60 * 60 *24));

    switch(period) {
      case 'aujourdhui':
        return differenceJours === 0;
      case 'semaine':
        return differenceJours >= 0;
      case 'mois':
        return differenceJours >= 0 && differenceJours < 30;
      default: 
        return true;
    }
  });

    const renderItem = ({ item }: { item: Transaction }) => {
    const isRevenu = item.type === 'revenu';
    const category = getCategoryById(item.category);

    const handleAction = () => {
      Alert.alert(
        "Options de transaction",
        `Que souhaitez-vous faire avec "${item.title}" ?`,
        [
          {
            text: "Modifier",
            onPress: () => {
              // On redirige vers l'écran de formulaire en lui passant l'ID de la transaction existante à modifier
              router.push({ 
                pathname: '/add', 
                params: { editId: item.id, initialType: item.type } 
              });
            }
          },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: () => {
              Alert.alert(
                "Confirmation",
                "Voulez-vous vraiment supprimer définitivement cette ligne ?",
                [
                  { text: "Annuler", style: "cancel" },
                  { text: "Oui, supprimer", style: "destructive", onPress: () => supprimerTransaction(item.id) }
                ]
              );
            }
          },
          { text: "Annuler", style: "cancel" }
        ]
      );
    };

    return (
      // On transforme le View de la carte en TouchableOpacity pour pouvoir cliquer dessus !
      <TouchableOpacity style={styles.transactionCard} onPress={handleAction}>
        <View style={{ 
          width: 36, 
          height: 36,
          right: 6,
          borderRadius: 8, 
          backgroundColor: isRevenu ? COLORS.primary + '20' : COLORS.danger + '20',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Ionicons 
            name={category?.icon as any || 'cash'} 
            size={20} 
            color={isRevenu ? COLORS.primary : COLORS.danger} 
          />
        </View>

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
      </TouchableOpacity>
    );
  };


  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Bouton Retour dissimulé ou discret */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/home')}>
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>

      {/* 1. SECTION EN-TÊTE DYNAMIQUE (Titre + Bouton d'action en haut) */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Historique</Text>
        
        <TouchableOpacity 
          style={[
            styles.headerActionButton, 
            { backgroundColor: activeTab === 'revenu' ? COLORS.primary : COLORS.danger }
          ]}
          onPress={() => router.push({ pathname: '/add', params: { initialType: activeTab } })}
        >
          <Text style={styles.headerActionButtonText}>
            {activeTab === 'revenu' ? 'Ajouter un revenu' : 'Ajouter une dépense'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. BARRE DE FILTRES TEMPORELS */}
      <View style={styles.filterBar}>
        {(['aujourdhui', 'semaine', 'mois', 'toutes'] as FilterPeriod[]).map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.filterChip,
              period === p && styles.filterChipActive
            ]}
            onPress={() => setPeriod(p)}
          >
            <Text style={[
              styles.filterChipText,
              period === p && styles.filterChipTextActive
            ]}>
              {p === 'aujourdhui' ? "Aujourd'hui" : p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 3. LISTE DES TRANSACTIONS */}
      {filteredTransactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun historique enregistré.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'ios' ? 0 : 18,
  },
  backButton: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  headerActionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20, // Bords très arrondis comme des pilules
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActionButtonText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 24,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: COLORS.card, // Devient un bloc gris-bleu quand il est actif
  },
  filterChipText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: COLORS.textPrimary,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 18,
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
    marginTop: 6,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
