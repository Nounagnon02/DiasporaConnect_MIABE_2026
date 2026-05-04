# DiasporaConnect — MIABE 2026

> Plateforme de transfert d'argent (Remittance) basée sur la blockchain **Celo**, conçue pour la diaspora africaine. Réduit les frais de transfert de 7–15% (opérateurs traditionnels) à **moins de 1%** grâce à un smart contract Solidity.

---

## Aperçu

DiasporaConnect propose deux parcours utilisateurs :

- **Expéditeur (Diaspora)** — Connecte son portefeuille Web3, compare les frais en temps réel, et valide une transaction sécurisée par un smart contract Celo.
- **Destinataire (Bénin)** — S'identifie via OTP, consulte son solde en FCFA, et initie un retrait vers son compte Mobile Money (MTN / Moov).

---

## Stack Technique

| Couche | Technologie |
|---|---|
| Mobile | React Native 0.81 + Expo ~54 |
| Navigation | React Navigation v7 (Stack + Bottom Tabs) |
| État global | Zustand v5 |
| Blockchain | Celo Alfajores (testnet) — ethers.js v6, viem, wagmi |
| Smart Contract | Solidity ^0.8.19 — Hardhat v3 |
| Wallet | WalletConnect / Reown AppKit |
| i18n | i18next (FR, EN, FON) |
| Requêtes API | TanStack Query v5 |
| Design System | "The Private Ledger" (Newsreader, Space Grotesk, Public Sans) |

---

## Structure du Projet

```
DiasporaConnect_MIABE_2026/
├── DiasporaConnect/          # Application React Native (Expo)
│   ├── contracts/            # Smart contract Solidity
│   │   └── DiasporaConnect.sol
│   ├── scripts/              # Scripts de déploiement Hardhat
│   ├── src/
│   │   ├── components/       # Composants UI réutilisables
│   │   ├── i18n/             # Traductions (fr, en, fon)
│   │   ├── navigation/       # Navigateurs (Root, App, Tabs, Stacks)
│   │   ├── screens/          # Écrans (auth, onboarding, sender, receiver, shared)
│   │   ├── services/         # API, blockchain, mock data
│   │   ├── store/            # Store Zustand
│   │   └── theme/            # Thème et design tokens
│   ├── App.js
│   └── package.json
├── maquette/                 # Maquettes HTML statiques (22 écrans)
├── Docs/                     # Documentation, designs Stitch, démo web
├── fichier_complet_pour_les_HTML.html  # Prototype HTML complet (single-file)
└── project_explanation_and_testing.md
```

---

## Prérequis

- Node.js >= 18
- npm ou yarn
- [Expo Go](https://expo.dev/go) installé sur le smartphone de test
- (Optionnel) [ngrok](https://ngrok.com) pour exposer le backend local

---

## Installation

```bash
cd DiasporaConnect
npm install
```

---

## Lancer l'application

```bash
npx expo start
```

Scannez le QR code avec **Expo Go** (Android) ou l'appareil photo (iOS).

```bash
# Cibler une plateforme spécifique
npx expo start --android
npx expo start --ios
npx expo start --web
```

---

## Configuration

Copiez `.env` et renseignez vos valeurs :

```env
API_URL=https://api.diasporaconnect.africa/v1
RPC_URL=https://alfajores-forno.celo-testnet.org
CONTRACT_ADDRESS=0x...
WALLET_CONNECT_PROJECT_ID=<votre_project_id>
EXCHANGE_RATE=612.5
```

> **Important :** Pour tester sur téléphone physique, remplacez `API_URL` par l'URL ngrok ou l'IP locale dans `src/services/apiService.js`. Ne laissez jamais `localhost` — l'app cherchera l'API sur le téléphone lui-même.

```bash
# Exposer le backend local avec ngrok
ngrok http 3000
# → Copiez l'URL générée dans apiService.js
```

---

## Smart Contract

Le contrat `DiasporaConnect.sol` gère trois opérations :

| Fonction | Description |
|---|---|
| `deposit(phone)` | L'expéditeur verrouille les fonds dans le contrat |
| `release(id, node)` | Le nœud Mobile Money confirme et libère les fonds |
| `refund(id)` | Remboursement automatique après 72h si non libéré |

### Déployer sur Celo Alfajores

```bash
cd DiasporaConnect
npx hardhat run scripts/deploy.js --network alfajores
```

Mettez à jour `CONTRACT_ADDRESS` dans `.env` avec l'adresse déployée.

---

## Écrans (22 écrans)

| Bloc | Écrans |
|---|---|
| Onboarding | Splash, Welcome, Sécurité blockchain, Rapidité, Économies |
| Auth | Sélection du rôle, Auth Expéditeur, Auth Destinataire |
| Expéditeur | Home, Envoi (4 étapes), Historique, Impact, Profil |
| Destinataire | Home, Retrait (confirmation, opérateur, succès) |
| Partagé | Contact, Calculateur de frais |

---

## Prototype HTML

Le fichier `fichier_complet_pour_les_HTML.html` à la racine est un prototype **single-file** autonome (HTML + CSS + JS) qui simule l'intégralité du flux sans dépendances. Ouvrez-le directement dans un navigateur.

---

## Hackathon MIABE 2026

Ce projet est soumis dans le cadre du **Hackathon MIABE 2026** avec pour objectif de démontrer qu'une infrastructure blockchain peut rendre les transferts d'argent diaspora → Afrique de l'Ouest accessibles, transparents et quasi-gratuits.

---

## Licence

Projet académique / hackathon — usage non commercial.
