# 📱 DiasporaConnect — Présentation et Guide de Test

Ce document résume le fonctionnement de l'application mobile DiasporaConnect, les travaux réalisés pour intégrer le design system "The Private Ledger", ainsi que les instructions nécessaires pour tester l'application en environnement réel avec **Expo Go** et **ngrok**.

---

## 1. Ce que fait l'application (et ce qui a été fait)

**DiasporaConnect** est une plateforme de transfert d'argent (Remittance) basée sur la blockchain Celo (réseau Alfajores en test). Elle vise à supprimer les frais exorbitants des opérateurs traditionnels (estimés entre 7 et 15%) grâce à un smart contract qui réduit les frais à moins de 1%. 

L'application a deux facettes prêtes pour la démonstration :
- **Un parcours Expéditeur (Diaspora)** : Où l'utilisateur connecte son portefeuille Web3 (simulé par MetaMask), estime les frais avec un comparateur temps réel, puis valide la transaction validée par un contrat Solidity.
- **Un parcours Destinataire (Bénin)** : Plus simplifié, où l'utilisateur s'identifie via un OTP (One Time Password) lié à son numéro de téléphone, voit son solde en FCFA et peut initier un retrait direct vers son compte Mobile Money (MTN ou Moov).

**Travaux réalisés lors de la dernière phase de développement :**
- Refonte complète de la charte graphique sous le design system haut de gamme **"The Private Ledger"** (fonds texturés `surface`, accents or massif, typographies `Newsreader`, `Space Grotesk` et `Public Sans`).
- Développement des **22 écrans** répartis en 8 blocs, de l'onboarding au retrait, en passant par des calculateurs asymétriques et des dashboards.
- Création de composants UI premium (Shadows diffuses, Glassmorphism pour la bottom tab, Boutons dégradés Gold).
- Création du véritable smart contract en Solidity `DiasporaConnect.sol` incluant les paiements conditionnels et les remboursements d'urgence.

---

## 2. Environnement de Test : Expo Go et ngrok

Pour tester et présenter l'application lors du Hackathon MIABE 2026 en utilisant de vrais smartphones, nous allons utiliser **Expo Go** pour compiler l'application de façon instantanée, et **ngrok** pour exposer le backend local au reste du monde (ou au réseau Wi-Fi).

### Prérequis
1. L'application **Expo Go** installée sur le smartphone de test (Android ou iOS).
2. Un compte ngrok et l'outil installé sur la machine hébergeant le backend (ex: votre ordinateur portable).
3. Assurez-vous d'être connecté au même réseau Wi-Fi (recommandé pour Expo Go).

### Étape 2.1 : Exposer le Backend avec ngrok
Votre backend (ex: Node.js) fonctionne probablement sur un port local, disons le `3000` ou `8080`. Vous devez relier ce tunnel local vers une URL publique :
```bash
# Dans le terminal du serveur Backend de votre ordinateur :
ngrok http 3000
```
ngrok vous fournira une URL du type `https://abcdef123.ngrok-free.app`. **Copiez cette URL**.

### Étape 2.2 : Démarrer l'Application Mobile
Dans le dossier du projet React Native (DiasporaConnect), lancez le serveur Expo :
```bash
npx expo start
```
- Scannez le **QR code** qui s'affiche dans votre terminal avec l'application Expo Go de votre téléphone (ou avec l'appareil photo si vous êtes sur iOS).

---

## 3. Configuration réseau : Où modifier l'Adresse IP ou l'URL

Puisque que le port du backend pointe maintenant vers une adresse ngrok au lieu de `localhost` (ou si vous utilisez simplement une adresse IP locale IPv4 de type `192.168.x.x`), vous devrez mettre à jour cette adresse dans le code de l'application mobile pour qu'elle puisse communiquer avec l'API.

> [!CAUTION]
> **Ne laissez jamais `localhost` ou `127.0.0.1` dans le simulateur ou le téléphone, car l'application cherchera l'API sur le téléphone lui-même, occasionnant une erreur.** 

### Fichier à modifier : `src/services/apiService.js`

Allez dans le fichier source qui gère toutes les requêtes, repérez la constante `BASE_URL`, et remplacez la valeur :

```javascript
// Chemin : src/services/apiService.js

// ❌ Avant (ou environnement mocké par défaut) :
const BASE_URL = 'https://api.diasporaconnect.africa/v1'; 

// ✅ Après (utilisant ngrok) :
const BASE_URL = 'https://abcdef123.ngrok-free.app/v1';

// ✅ Ou si vous testez via IP locale (ex: 192.168.1.50) sans ngrok :
const BASE_URL = 'http://192.168.1.50:3000/v1';
```

**(Optionnel) Fichiers réseau supplémentaires :**
Si vous possédez d'autres services comme WebSockets ou l'accès au nœud RPC Celo hébergé localement, modifiez l'adresse dans :
`src/services/blockchainService.js` (où se trouvent l'intégration ethers.js et les URLs du Provider RPC si vous ne pointez pas directement vers un RPC public Celo Alfajores).

---

## 4. Astuces pour le jury

> [!TIP]
> - Mettez en avant le fait que la démo tourne réellement sur téléphone, rendue possible via **Expo Go**.
> - Pour éviter que l'URL ne change toutes les 2h avec ngrok gratuit, prévoyez de modifier le fichier `apiService.js` **juste avant** votre présentation.
> - Rappelez que les animations et la rapidité du flux sur téléphone simulent l'immédiateté d'une interaction blockchain !
