import { create } from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Structure d'une transaction
export interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: "revenu" | 'depense';
    category: string;
    date: string;
}

//Structure de l'utilisateur
interface User {
    name: string;
    email: string;
    password: string;
}

//Structure globale de l'état
interface BudgetState {
    userList: User[];
    currentUser: User | null;
    isConnected: boolean;
    solde: number;
    transactions: Transaction[];

    //Fonctions
    register: (name: string, email: string, password: string) => string | null;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    ajouterTransaction: (title: string, amount: number, type: 'revenu' | 'depense', category: string) => void;
    modifierTransaction: (id: string, title: string, amount: number, category: string) => void;
    supprimerTransaction: (id: string) => void;
}

export const useBudgetStore = create<BudgetState>()(
    persist(
        (set, get) => ({
            userList: [],
            currentUser: null,
            isConnected: false,
            solde: 0,
            transactions: [],

            //Inscription
            register: (name, email, password) => {
                const currentUsers = get().userList || [];

                //Vérifier si l'email saisit existe
                const emailExiste = currentUsers.some(user => user.email === email);

                if (emailExiste) {
                    return "Cette adresse e-mail est déjà utilisée sur cet appareil.";
                }
                
                const nouvelUtilisateur: User = { name, email, password};

                set({
                    userList: [...currentUsers, nouvelUtilisateur],
                    currentUser: nouvelUtilisateur,
                    isConnected: true,
                    solde: 0,
                    transactions: []
                });

                return null;
            },

            //Connexion
            login:(email, password) => {
                const currentUsers = get().userList || [];
                const userTrouve = currentUsers.find(user => user.email === email && user.password === password);

                if (userTrouve) {
                    set({ 
                        currentUser: userTrouve,
                        isConnected: true 
                    });
                    return true; //Accès autorisé
                } 
                return false; //Accès réfusé
            },

            //Déconnexion
            logout: ()  => set({ isConnected: false }),

            //Ajout de transaction
            ajouterTransaction: (title, amount, type, category) => {
                const nouvelleTransaction: Transaction = {
                    id: Math.random().toString(36).substring(2, 9),
                    title,
                    amount,
                    type,
                    category,
                    date: new Date().toLocaleDateString("fr-FR", {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                };

                const soldeActuel = get().solde;
                const nouveauSolde = type === 'revenu' 
                    ? soldeActuel + amount
                    : soldeActuel - amount;
                
                set((state) => ({
                    solde: nouveauSolde,
                    transactions: [nouvelleTransaction, ...state.transactions]
                }));
            },

            //Modification de transaction
            modifierTransaction: (id, title, amount, category) => {
                const listeTransactions = [...get().transactions];
                const index = listeTransactions.findIndex(t => t.id === id);

                if (index !== -1) {
                    const ancienne = listeTransactions[index];
                    let differenceSolde = 0;

                    if (ancienne.type === 'revenu') {
                        differenceSolde = amount - ancienne.amount;
                    } else {
                        differenceSolde = ancienne.amount - amount;
                    }

                    listeTransactions[index] = { ...ancienne, title, amount, category };

                    set({
                        solde: get().solde + differenceSolde,
                        transactions: listeTransactions
                    });
                }

            },

            //Suppression de transaction
            supprimerTransaction: (id) => {
                const ancienneTransaction = get().transactions.find(t => t.id === id);
                
                if (!ancienneTransaction) return;

                //Réajuster le solde avant d'effacer
                const soldeActuel = get().solde;
                const nouveauSolde = ancienneTransaction.type === 'revenu'
                    ? soldeActuel - ancienneTransaction.amount
                    : soldeActuel + ancienneTransaction.amount

                set({
                    solde: nouveauSolde,
                    transactions: get().transactions.filter(t => t.id !== id)
                });
            }
        }),
        {
            name: 'mon-budget-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);


