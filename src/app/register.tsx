import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView, ActivityIndicator, Image } from "react-native";
import { useRouter } from "expo-router";
import { useBudgetStore } from "@/store/budgetStore";
import { COLORS } from "@/theme/color";
import { Ionicons } from "@expo/vector-icons";

export default function Register() {
    const router = useRouter();
    const register = useBudgetStore((state) => state.register);

    //États pour les champs
    const [name, setName]                          = useState('');
    const [email, setEmail]                        = useState('');
    const [password, setPassword]                  = useState('');
    const [confirmPassword, setConfirmPassword]    = useState('');
    const [error, setError]                        = useState('');
    const [loading, setLoading]                    = useState(false);
    const [secureText, setSecureText]              = useState(true);
    const [secureConfirm, setSecureConfirm]        = useState(true);
    
    

    const handleRegister = () => {
        //Validation des champs avant soummission
        if(!name || !email || !password || !confirmPassword) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        //Validation de la correspondance des mots de passe
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        setError('');
        setLoading(true);

        setTimeout(() => {

            //Appel de l'action Zustand pour enregistrer l'utilisateur localement
           const errorResult = register(name.trim(), email.trim().toLowerCase(), password) as string | null;
        
            setLoading(false)

            if (errorResult) {
                setError(errorResult);
            } else {
                //Redirection automatique vers l'écran de connexion
                router.push('/')
            }
        }, 800)
    };

    return (
        <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : "height"}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {/** Section Logo */}
                    <View style={styles.logoContainer}>
                        <Image 
                            source={require('@/assets/images/icon.png')}
                            style={styles.mainLogo}
                            resizeMode='contain'
                        />                              
                    </View>

                    {/** Section formulaire */}
                    <View style={styles.formContainer}>
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <TextInput 
                            style={styles.input}
                            placeholder="Nom complet"
                            placeholderTextColor={COLORS.textSecondary}
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            autoCorrect={false}
                        />
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
                        
                        <View style={styles.inputContainer}>
                            <TextInput 
                                style={styles.inputField}
                                placeholder="Confirmer le mot de passe"
                                placeholderTextColor={COLORS.textSecondary}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={secureConfirm}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <TouchableOpacity 
                                style={styles.eyeButton} 
                                onPress={() => setSecureConfirm(!secureConfirm)}
                            >
                                <Ionicons 
                                name={secureConfirm ? "eye-off-outline" : "eye-outline"} 
                                size={22} 
                                color={COLORS.textSecondary} 
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                        {loading ? (
                            <ActivityIndicator color={COLORS.textPrimary}/>
                        ) : (
                            <Text style={styles.buttonText}>S&apos;INSCRIRE</Text>
                        )}
                        </TouchableOpacity>
                    </View>

                    {/** Lien de redirection */}
                    <TouchableOpacity
                        style={styles.footerLink}
                        onPress={() => router.push('/')}
                    >
                        <Text style={styles.footerText}>
                            Déjà un compte ? <Text style={styles.linkText}> Se connecter</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 60,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      },
      mainLogo: {
        width: 150,      
        height: 150,
        borderRadius: 28, 
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
        marginTop: 24,
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