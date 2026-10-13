export interface Category {
    id: string;
    name: string;
    icon: string;
    type: 'revenu' | 'depense' | 'both';
}

export const CATEGORIES: Category[] = [
    // Catégories REVENUS
  { id: 'salaire', name: 'Salaire', icon: 'briefcase', type: 'revenu' },
  { id: 'freelance', name: 'Freelance', icon: 'laptop', type: 'revenu' },
  { id: 'investissement', name: 'Investissement', icon: 'trending-up', type: 'revenu' },
  { id: 'cadeau', name: 'Cadeau', icon: 'gift', type: 'revenu' },
  { id: 'autre-revenu', name: 'Autre', icon: 'cash', type: 'revenu' },

  // Catégories DÉPENSES
  { id: 'alimentation', name: 'Alimentation', icon: 'fast-food', type: 'depense' },
  { id: 'transport', name: 'Transport', icon: 'car', type: 'depense' },
  { id: 'logement', name: 'Logement', icon: 'home', type: 'depense' },
  { id: 'sante', name: 'Santé', icon: 'medkit', type: 'depense' },
  { id: 'loisirs', name: 'Loisirs', icon: 'game-controller', type: 'depense' },
  { id: 'shopping', name: 'Shopping', icon: 'cart', type: 'depense' },
  { id: 'education', name: 'Éducation', icon: 'school', type: 'depense' },
  { id: 'factures', name: 'Factures', icon: 'document-text', type: 'depense' },
  { id: 'autre-depense', name: 'Autre', icon: 'ellipsis-horizontal-circle', type: 'depense' },
];

//Fonction pour fitrer par type
export const getCategoryByType = (type: 'revenu' | 'depense') => {
    return CATEGORIES.filter(cat => cat.type || cat.type === 'both');
};

//Fonction pour obtenir une catégorie par ID
export const getCategoryById = (id: string) => {
    return CATEGORIES.find(cat => cat.id === id);
};