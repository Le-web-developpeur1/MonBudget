import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { useBudgetStore } from '@/store/budgetStore';
import { COLORS } from '@/theme/color';
import { Ionicons } from '@expo/vector-icons';

export default function ConnexionScreen() {
  const router = useRouter();
  const login = useBudgetStore((state) => state.login);

  // États pour gérer les champs et les erreurs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const handleLogin = () => {
    // Validation rapide des champs
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setError('');
    setLoading(true);

    // Simulation d'une légère attente pour faire pro
    setTimeout(() => {
      const success = login(email.trim().toLowerCase(), password);
      setLoading(false);

      if (success) {
        // Redirection vers l'écran d'accueil
        router.replace('/home');
      } else {
        setError('Adresse e-mail ou mot de passe incorrect.');
      }
    }, 800);
  };

  return (
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          {/* Section Logo / Titre */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/images/icon.png')}
              style={styles.mainLogo}
              resizeMode='contain'
            />
          </View>

          {/* Section Formulaire */}
          <View style={styles.formContainer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Champ E-mail */}
            <TextInput 
              style={styles.input}
              placeholder="Adresse e-mail"
              placeholderTextColor={COLORS.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Champ Mot de passe */}
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.inputField}
                placeholder="Mot de passe"
                placeholderTextColor={COLORS.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureText}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                  style={styles.eyeButton} 
                  onPress={() => setSecureText(!secureText)}
                >
                  <Ionicons 
                    name={secureText ? "eye-off-outline" : "eye-outline"} 
                    size={22} 
                    color={COLORS.textSecondary} 
                  />
                </TouchableOpacity>
            </View>

            {/* Bouton de Connexion */}
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.textPrimary} />
              ) : (
                <Text style={styles.buttonText}>SE CONNECTER</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Lien de redirection vers l'inscription */}
          <TouchableOpacity 
            style={styles.footerLink}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.footerText}>
              Pas encore de compte ? <Text style={styles.linkText}>S&apos;inscrire</Text>
            </Text>
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
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 20,
    width: '100%',
  },
  mainLogo: {
    width: 100,      
    height: 100,
    borderRadius: 22, 
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    width: '100%',
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
  button: {
    width: '100%',
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerLink: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 56,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputField: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  eyeButton: {
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeText: {
    fontSize: 18,
  },
});
