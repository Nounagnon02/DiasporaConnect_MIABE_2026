# DiasporaConnect — Présentation complète & Guide de Test

> Hackathon MIABE 2026 — Plateforme de transfert d'argent blockchain (Celo) pour la diaspora africaine

---

## 1. Ce qu'est DiasporaConnect

DiasporaConnect est une application mobile React Native (Expo) qui connecte la diaspora africaine en Europe à leurs familles au Bénin via la blockchain Celo. L'objectif central : réduire les frais de transfert de 7–15% (opérateurs traditionnels) à **moins de 1%** grâce à un smart contract Solidity.

L'application couvre deux parcours utilisateurs complets :

- **Expéditeur (Diaspora)** — Connecte son wallet Web3, compare les frais en temps réel, et valide une transaction sécurisée par le smart contract `DiasporaConnect.sol` sur Celo Alfajores.
- **Destinataire (Bénin)** — S'identifie via OTP lié à son numéro de téléphone, consulte son solde en FCFA, et initie un retrait vers MTN Money ou Moov Money.

---

## 2. Fonctionnalités détaillées

### 2.1 Onboarding (5 écrans)

- **Splash** — Animation d'entrée avec le logo DiasporaConnect.
- **Welcome** — Présentation de la valeur principale : transferts < 1% de frais.
- **Sécurité blockchain** — Explication du smart contract Celo et de la protection des fonds.
- **Rapidité** — Mise en avant de la confirmation en < 60 secondes.
- **Économies** — Comparaison visuelle des frais vs Western Union, MoneyGram, SWIFT.

### 2.2 Authentification

- **Sélection du rôle** — L'utilisateur choisit entre "Expéditeur" et "Destinataire".
- **Auth Expéditeur** — Connexion simulée avec wallet Web3 (MetaMask / WalletConnect). En démo, un wallet mock est injecté automatiquement avec un solde de 1 242,80 USD.
- **Auth Destinataire** — Saisie du numéro de téléphone + code OTP à 6 chiffres. En démo, tout code OTP est accepté.
- **KYC** — Écran de vérification d'identité (statut : `none` / `pending` / `verified`). Simulé en démo.

### 2.3 Parcours Expéditeur

#### Dashboard (Home Expéditeur)
- Solde affiché en USD et en équivalent FCFA (taux live ou fallback 612,5).
- **Bannière taux de change** — Alerte si le taux EUR/USD évolue significativement.
- **Prédiction IA du taux** — Le module `aiService.predictRateTrend` analyse les 5 dernières valeurs et affiche un conseil : "Bon moment pour envoyer 📈" ou "Attendez 2–4h 📉" avec un score de confiance en %.
- **Bouton CTA "Faire un transfert"** — Accès direct au calculateur.
- **Carte économies du mois** — Affiche les USD économisés vs Western Union ce mois-ci.
- **Raccourcis rapides** — 5 boutons : Récurrent, Épargne, Parrainage, Impact, Contacts.
- **Graphique taux EUR/USD** — Courbe historique des taux (composant `RateChart`).
- **3 dernières transactions** — Avec lien vers l'historique complet.
- **Indicateur réseau** — Affiche si l'app est en mode hors-ligne.

#### Calculateur de frais
- Saisie du montant en **EUR ou USD** (toggle).
- Calcul instantané de ce que le bénéficiaire reçoit en **FCFA**.
- **Comparateur de frais** (`FeeComparator`) — Tableau comparatif en temps réel :
  - DiasporaConnect : **0,8%**
  - WorldRemit : 7%
  - MoneyGram : 11%
  - Western Union : 14%
  - SWIFT : 18%
- **Suggestions intelligentes de montant** (`SmartAmountSuggestion`) — Propose des montants basés sur l'historique, la période du mois (fin de mois, rentrée scolaire, fêtes), et le solde disponible.
- Bannière "Vous économisez X USD vs le marché".
- Bouton "Continuer le transfert" → lance le flux d'envoi en 4 étapes.

#### Flux d'envoi (4 étapes)

**Étape 1 — Initialisation**
- Écran de transition avec indicateur de progression (4 étapes).
- Si le montant est déjà défini (venant du calculateur), passe automatiquement à l'étape 2.

**Étape 2 — Destinataire**
- Saisie manuelle du numéro Mobile Money (+229).
- **Scanner QR Code** — Simule un scan (en prod : expo-camera). Après 2 secondes, remplit automatiquement le numéro `+229 97 45 12 87` (Adjoua Adjovi, MTN).
- **Destinataires récents** — Liste des 3 bénéficiaires sauvegardés avec avatar coloré, nom, numéro et opérateur. Sélection en un tap.

**Étape 3 — Confirmation**
- **Détection IA d'anomalie** (`aiService.detectAnomaly`) — Analyse comportementale avant envoi :
  - Niveau `high` 🚨 : montant inhabituel + nouveau destinataire.
  - Niveau `medium` ⚠️ : montant 3× la moyenne ou plusieurs transferts en < 10 min.
  - Niveau `low` ℹ️ : montant plus élevé que d'habitude.
- **Récapitulatif complet** : montant envoyé, frais Celo (0,002 CELO), frais DiasporaConnect (0,8%), montant reçu en FCFA et USD.
- **Carte bénéficiaire** : nom, numéro, opérateur.
- **Validation biométrique** (`BiometricGuard`) — Popup de confirmation simulant Face ID / empreinte digitale avant l'envoi.
- Bouton "Confirmer et Envoyer" → déclenche `executeTransferDemo` (simulation 4,5 secondes avec étapes progressives).

**Étape 4 — Succès**
- **Animation confettis** au chargement.
- **Checkmark animé** (spring animation).
- Carte de détail de la transaction : référence, hash Celo (tronqué + bouton "Copier"), statut "En confirmation" avec dot clignotant, réseau "Celo Alfajores".
- **Barre de progression** de confirmation Celo (~60 secondes).
- Encart "Vous avez économisé X USD vs Western Union".
- Boutons : "Nouveau transfert", "Suivre ce transfert", "Voir l'historique".

#### Historique des transactions
- Filtres : Tous / Envoyés / Reçus.
- **Groupement par date** : Aujourd'hui / Cette semaine / Ce mois / Plus ancien.
- **Skeleton loader** animé pendant le chargement (1,2 secondes).
- Pull-to-refresh.
- Tap sur une transaction → écran de détail complet.
- État vide avec illustration si aucune transaction.

#### Écran Impact
- **Résumé IA narratif** (`generateImpactNarrative`) — Texte personnalisé selon le nombre de transferts et les économies réalisées, avec équivalences concrètes (repas familiaux, jours d'école, mois de courses).
- **Animation de connexion** (composant `ConnectionAnim`).
- **Score personnel** : total économisé vs WU, nombre de transferts, CO₂ évité.
- **Système de badges** (6 badges) : Premier envoi 🚀, Économiseur 💰, Champion 🏆, Fidèle ⭐, Diamant 💎, Ambassadeur 🤝. Les badges non débloqués sont grisés avec un cadenas.
- **Compteurs globaux animés** : 1 247 familles aidées, 18 653 $ économisés, < 1% de frais.
- **Alignement ODD** : ODD 1 (Fin de la pauvreté), ODD 8 (Travail décent), ODD 10 (Inégalités réduites).
- **Scénarios concrets** : Kofi (Paris, 200 USD → économie 26,20 USD), Adjoa (Bruxelles), Séraphin (Lyon).

#### Micro-épargne
- **Solde épargne** affiché sur fond sombre avec intérêts générés (taux DeFi Celo : 4,2%/an via Moola Market).
- **Projection annuelle** calculée automatiquement.
- **Arrondi automatique** (toggle) — À chaque transfert, la différence est épargnée. 3 options : arrondi au dollar supérieur, aux 5 USD, ou 1 USD fixe.
- **Historique des contributions** avec date et ID de transaction.
- Bouton "Retirer l'épargne" avec confirmation Alert.

#### Transferts récurrents
- Création de transferts programmés (hebdomadaire, mensuel).
- Toggle actif/inactif par transfert.
- Suppression avec confirmation.

#### Parrainage
- **Code unique** affiché (ex: `KOFI2026`) avec bouton "Copier".
- **QR Code généré en SVG** (pattern pseudo-aléatoire basé sur le code).
- Bouton "Partager mon code" → ouvre le share natif du téléphone.
- **Statistiques** : amis parrainés, gains totaux en USD, gains en attente.
- Explication du mécanisme en 3 étapes.
- Récompense : 0,50 USD en cUSD sur wallet Celo par filleul.

#### Gestion des bénéficiaires
- Liste des contacts sauvegardés avec avatar coloré.
- Ajout, modification, suppression de bénéficiaires.

#### Profil & Paramètres
- Informations utilisateur.
- **Paramètres de notifications** (6 toggles) : alerte taux, transfert envoyé, transfert reçu, rappel récurrent, alerte sécurité, rapport hebdomadaire.
- Sélection de la langue : Français, English, Fɔngbè (FON).
- Déconnexion.

### 2.4 Parcours Destinataire

#### Dashboard (Home Destinataire)
- **Solde disponible à retirer** en FCFA (ex: 131 191 FCFA).
- Bouton CTA "Retirer maintenant" → flux de retrait.
- 3 badges info : Instantané ⚡, Sécurisé 🔒, Sans frais 💵.
- **Transferts reçus récents** avec détail par transaction.

#### Flux de retrait (3 étapes)

**Sélection de l'opérateur**
- Choix entre **MTN Money** et **Moov Money**.
- Affichage du montant disponible.

**Confirmation**
- Récapitulatif : montant en FCFA, opérateur choisi, numéro de téléphone.
- Bouton "Confirmer le retrait".

**Succès**
- Confirmation visuelle du retrait initié.
- Délai estimé affiché.

### 2.5 Écrans partagés

- **Contact / Support** — Formulaire de contact et FAQ.
- **Détail de transaction** — Hash Celo complet, statut, confirmations, frais gas, économies vs WU.
- **Suivi de transfert** (`TransferTracker`) — Suivi en temps réel de l'état d'un transfert en cours.
- **Paramètres de notifications** — Accessible depuis le profil.

### 2.6 Assistant IA "Lumière"

L'assistant conversationnel multilingue répond en **Français, Anglais et Fɔngbè** :
- Calculs de transfert à la demande.
- Informations sur les frais, taux, sécurité, Mobile Money.
- En production : connecté à GPT-4o-mini (OpenAI). En démo : réponses hors-ligne basées sur mots-clés.

### 2.7 Smart Contract `DiasporaConnect.sol`

Déployé sur Celo Alfajores (testnet). Trois fonctions principales :

| Fonction | Description |
|---|---|
| `deposit(phone)` | L'expéditeur verrouille les fonds dans le contrat |
| `release(id, node)` | Le nœud Mobile Money confirme et libère les fonds |
| `refund(id)` | Remboursement automatique après 72h si non libéré |

En démo, `executeTransferDemo` simule le cycle complet en ~4,5 secondes avec étapes progressives visibles à l'écran.

---

## 3. Ce qu'on voit à l'écran lors des tests

### Lancement de l'app

1. **Splash screen** avec logo animé (~2 secondes).
2. **Onboarding** — 4 slides swipables avec illustrations et textes sur la blockchain, la rapidité et les économies. Bouton "Commencer" sur le dernier slide.
3. **Sélection du rôle** — Deux cartes : "Expéditeur" et "Destinataire".

### Parcours Expéditeur — ce qu'on voit

- **Auth** : Bouton "Connecter mon wallet" → confirmation instantanée (mock), accès au dashboard.
- **Dashboard** : Fond crème texturé (`#FAF9F5`), solde `1 242,80 USD` en typographie Newsreader, bannière taux or, prédiction IA avec badge "✨ IA", graphique de courbe, 3 transactions récentes.
- **Calculateur** : Saisie `200 EUR` → affichage immédiat `≈ 121 985 FCFA` reçus. Tableau comparatif avec barres de progression colorées montrant DiasporaConnect en vert (0,8%) vs les autres en rouge/orange.
- **Étape 2** : Tap sur "Adjoua Adjovi" → carte surlignée avec badge ✓ doré.
- **Étape 3** : Si c'est un nouveau destinataire avec un gros montant, une bannière ⚠️ IA apparaît en haut. Tap "Confirmer" → popup biométrique simulé → bouton en état "Signature en cours...".
- **Étape 4** : Confettis dorés, checkmark animé qui "pop", hash Celo tronqué `0x3f4a8b2c...`, barre de progression qui avance lentement, encart vert "Vous avez économisé 26,20 USD".

### Parcours Destinataire — ce qu'on voit

- **Auth** : Saisie du numéro → bouton "Envoyer le code" → champ OTP à 6 cases → n'importe quel code → accès au dashboard.
- **Dashboard** : Solde `131 191 FCFA` en grand, bouton doré "Retirer maintenant", liste des transferts reçus.
- **Retrait** : Sélection MTN ou Moov → confirmation → écran de succès.

### Design system "The Private Ledger" — ce qu'on voit

- Fond texturé chaud `#FAF9F5` (surface).
- Accents **or massif** `#755B00` / `#C9A84C` sur tous les boutons CTA, badges, montants.
- Typographies : **Newsreader** (serif, pour les grands montants), **Space Grotesk** (titres), **Public Sans** (corps de texte).
- Bottom tab avec effet **glassmorphism** (fond semi-transparent flouté).
- Boutons CTA en **dégradé or** `#755B00 → #C9A84C`.
- Shadows diffuses (pas de bordures dures).
- Skeleton loaders animés (pulse) pendant les chargements.

---

## 4. Environnement de test : Expo Go + ngrok

### Prérequis
1. **Expo Go** installé sur le smartphone de test (Android ou iOS).
2. Être sur le même réseau Wi-Fi que la machine qui lance Expo.
3. (Optionnel) **ngrok** si un backend local doit être exposé.

### Lancer l'application

```bash
cd DiasporaConnect
npm install
npx expo start
```

Scannez le QR code avec Expo Go (Android) ou l'appareil photo (iOS).

### Exposer le backend avec ngrok (si nécessaire)

```bash
ngrok http 3000
# → Copiez l'URL générée (ex: https://abcdef123.ngrok-free.app)
```

### Fichier à modifier : `src/services/apiService.js`

```javascript
// ❌ Ne pas laisser localhost
const BASE_URL = 'https://api.diasporaconnect.africa/v1';

// ✅ Avec ngrok
const BASE_URL = 'https://abcdef123.ngrok-free.app/v1';

// ✅ Avec IP locale
const BASE_URL = 'http://192.168.1.50:3000/v1';
```

> **Important :** Ne jamais laisser `localhost` ou `127.0.0.1` — l'app cherchera l'API sur le téléphone lui-même.

---

## 5. Données de démo (mock)

Tout fonctionne sans backend réel. Les données mock sont dans `src/services/mockData.js` :

| Donnée | Valeur démo |
|---|---|
| Wallet expéditeur | `0x742d...3E1f` — 1 242,80 USD |
| Destinataire par défaut | Adjoua Adjovi, +229 97 45 12 87, MTN |
| Solde destinataire | 131 191 FCFA |
| Taux EUR/USD | 1,08 |
| Taux USD/FCFA | 612,5 |
| Frais DiasporaConnect | 0,8% |
| Code OTP valide | N'importe quel code à 6 chiffres |
| Durée simulation transfert | ~4,5 secondes |

---

## 6. Astuces pour la présentation au jury

- **Montrez le comparateur de frais** sur le calculateur : c'est l'argument choc. Entrez 200 EUR et montrez que WU prendrait 28 USD vs 1,80 USD avec DiasporaConnect.
- **Déclenchez la détection IA** : entrez un montant très élevé (ex: 5000 USD) vers un nouveau destinataire pour voir la bannière d'alerte 🚨.
- **Montrez l'écran Impact** : les compteurs animés et les badges créent un effet visuel fort.
- **Démontrez le multilingue** : changez la langue en Fɔngbè dans le profil pour montrer la localisation.
- **Modifiez `apiService.js` juste avant** la présentation si vous utilisez ngrok (l'URL change toutes les 2h avec le plan gratuit).
- L'app fonctionne **100% hors-ligne** en mode démo — pas besoin de connexion internet pour la démonstration principale.
