import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBudgetStore } from '@/store/budgetStore';
import { COLORS } from '@/theme/color';
import { getCategoryByType } from '@/constants/categories';
import { Ionicons } from '@expo/vector-icons';

export default function AddTransactionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const ajouterTransaction = useBudgetStore((state) => state.ajouterTransaction);
  const transactions = useBudgetStore((state) => state.transactions);
  const modifierTransaction = useBudgetStore((state) => state.modifierTransaction);

  // Le type est figé et récupéré depuis les paramètres ('depense' par défaut au cas où)
  const [type, setType] = useState<'revenu' | 'depense'>('depense');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  // Charger le mode création ou le mode édition selon la provenance
  useEffect(() => {
    if (params.editId) {
      // Mode Édition : on récupère les données de la transaction existante
      const txAModifier = transactions.find(t => t.id === params.editId);
      if (txAModifier) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setType(txAModifier.type);
        setAmount(txAModifier.amount.toString());
        setTitle(txAModifier.title);
        setCategory(txAModifier.category);
      }
    } else if (params.initialType === 'revenu' || params.initialType === 'depense') {
      // Mode Création : on récupère le type poussé par l'historique
      setType(params.initialType);
    }
  }, [params.editId, params.initialType, transactions]);

  const handleSave = () => {
    const parsedAmount = parseFloat(amount.replace(/\s/g, ''));

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Veuillez entrer un montant valide supérieur à 0.');
      return;
    }
    if (!title.trim()) {
      setError('Veuillez donner un titre à cette transaction.');
      return;
    }

    if (!category) {
      setError('Veuillez donnez une catégorie à cette transaction');
      return;
    }

    setError('');


    if (params.editId) {
      modifierTransaction(params.editId as string, title.trim(), parsedAmount, category);
    } else {
      ajouterTransaction(title.trim(), parsedAmount, type, category);
    }

    // Retourne à l'historique calé sur le bon onglet
    router.replace({ pathname: '/history', params: { tab: type } });
  };

  // Couleurs et textes dynamiques hérités du type figé
  const isRevenu = type === 'revenu';
  const activeColor = isRevenu ? COLORS.primary : COLORS.danger;
  const buttonText = isRevenu ? 'ENREGISTRER LE REVENU' : 'ENREGISTRER LA DÉPENSE';

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Titre de l'écran */}
        <Text style={styles.headerTitle}>Nouvelle transaction</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* 1. BLOC DU MONTANT (Couleur dynamique verte ou rouge) */}
        <View style={styles.inputBlock}>
          <TextInput 
            style={[styles.amountInput, { color: activeColor }]}
            placeholder="0 FG"
            placeholderTextColor={COLORS.textSecondary}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            maxLength={12}
          />
        </View>

        {/* 2. CHAMP DU TITRE (Ex: Carburant) */}
        <TextInput 
          style={styles.input}
          placeholder={isRevenu ? "Salaire du mois...." : "Carburant"}
          placeholderTextColor={COLORS.textSecondary}
          value={title}
          onChangeText={setTitle}
          autoCapitalize="sentences"
        />

        {/* 3. CHAMP DE LA CATÉGORIE EN MODE MENU DÉROULANT SIMULÉ */}
        <Text style={styles.label}>Catégorie</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {getCategoryByType(type).map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryButton,
                category === cat.id && styles.categoryButtonActive
              ]}
              onPress={() => setCategory(cat.id)}
            >
              <Ionicons name={cat.icon as any} size={22} color={category === cat.id ? COLORS.primary : COLORS.textSecondary} />
              <Text style={[
                styles.categoryText,
                category === cat.id && styles.categoryTextActive
              ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 4. GROS BOUTON UNIQUE DYNAMIQUE */}
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: activeColor }]} 
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>{buttonText}</Text>
        </TouchableOpacity>

        {/* Bouton Annuler */}
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 35,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 32,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputBlock: {
    width: '100%',
    height: 80,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  amountInput: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'right', // Aligné à droite comme sur tes maquettes Figma
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  dropdownInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 56,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  dropdownInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  dropdownArrow: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  saveButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  label: {
  fontSize: 14,
  color: COLORS.textSecondary,
  marginBottom: 8,
  fontWeight: '600',
},
categoryScroll: {
  marginBottom: 20,
},
categoryContainer: {
  gap: 12,
  paddingRight: 20,
},
categoryButton: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  backgroundColor: COLORS.card,
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 12,
  borderWidth: 2,
  borderColor: 'transparent',
},
categoryButtonActive: {
  borderColor: COLORS.primary,
  backgroundColor: COLORS.primary + '20',
},
categoryIcon: {
  fontSize: 20,
},
categoryText: {
  fontSize: 14,
  color: COLORS.textSecondary,
  fontWeight: '600',
},
categoryTextActive: {
  color: COLORS.primary,
  fontWeight: 'bold',
},

});
