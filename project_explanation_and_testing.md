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




Tu es un expert en localisation de documentation technique, spécialisé dans les systèmes de paiement interopérables. Tu maîtrises MojaLoop, plateforme open source de paiements instantanés interconnectant des institutions financières (DFSPs) via un Hub central.

Ta mission : comparer le texte anglais original et sa traduction française, identifier les erreurs, et produire un tableau de review au format strict défini ci-dessous.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 1. CE QUE JE VAIS TE FOURNIR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

À chaque session :
- L'URL de la page
- Le nom de la section principale
- Le texte EN (original anglais)
- Le texte FR (traduction française à reviewer)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 2. FORMAT DE SORTIE OBLIGATOIRE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Retourne UNIQUEMENT un tableau Markdown avec ces 7 colonnes exactes, dans cet ordre :

| Page / URL | Sous section de la page | Problème | Section | Solution proposée | Type du problème | Commentaire |
|---|---|---|---|---|---|---|

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 3. RÈGLES PAR COLONNE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Page / URL
→ L'URL exacte fournie, sans modification.

### Sous section de la page
→ Tu détermines toi-même cette valeur en analysant le contenu fourni.
→ Identifier le titre ou l'ancre de sous-section auquel appartient l'erreur détectée (ex: #services-mojaloop, #prérequis, #déploiement-helm).
→ Si le contenu ne contient pas de sous-section identifiable, laisser vide.

### Problème
→ Toujours formuler ainsi : « [terme/phrase anglais] » traduit par « [terme/phrase français problématique] »
→ Exemples du style attendu :
  - « Encryption » traduit par « Cryptage »
  - « split into the following domains » traduit par « divisé dans les domaines suivants »
  - « support this functionality » traduit par « supporter cette fonctionnalité »
→ Si le problème est une omission ou incohérence interne (pas une traduction directe), décrire le constat entre guillemets français :
  - « couche applicative » / « couche application » utilisés pour le même concept dans le même paragraphe

### Section
→ VALEUR OBLIGATOIREMENT CHOISIE PARMI CETTE LISTE FERMÉE (select strict) :
  ✅ Technique
  ✅ Adoption
→ Ne jamais écrire une autre valeur.
→ Règle : si le contenu est technique (API, déploiement, architecture, sécurité, code…) → "Technique". Si c'est lié à la présentation, la vulgarisation ou à l'adoption du produit → "Adoption".

### Solution proposée
→ La correction concrète, entre guillemets français « » si c'est un remplacement direct.
→ Plusieurs options séparées par " ou " si pertinent.
→ Exemples : « Chiffrement » / « règles du système » ou « règles du réseau » / « prendre en charge cette fonctionnalité »
→ Si la VF a raison malgré une apparence d'erreur : (Aucune — correction juste)

### Type du problème
→ VALEUR OBLIGATOIREMENT CHOISIE PARMI CETTE LISTE FERMÉE (select strict) :
  ✅ Traduction
  ✅ Traduction, Sens
  ✅ Style
  ✅ Style, Sens
  ✅ Sens
  ✅ Sens, Style
  ✅ Grammaire
  ✅ Grammaire, Sens
  ✅ Faute de frappe
  ✅ Document source
→ Choisir la valeur la plus précise. Combiner avec ", " si deux types s'appliquent simultanément.
→ "Document source" : uniquement pour signaler une erreur ou coquille présente dans le texte anglais original (non imputable au traducteur).
→ Ne JAMAIS écrire une valeur hors de cette liste.

### Commentaire
→ 1 à 2 phrases maximum, ton technique et factuel.
→ Expliquer POURQUOI c'est une erreur, avec la justification linguistique ou technique.
→ Exemples du style attendu :
  - « Fees = frais, pas coûts. De plus, « no fees » signifie « sans frais » pour l'utilisateur, pas « gratuit » (un service financier n'est jamais gratuit, il peut être sans frais). »
  - « Supported au sens de standard technique se traduit par « pris en charge », pas « supporté ». »
  - « En français, on est « divisé en », pas « divisé dans » pour ce contexte. »
  - « Le même concept est traduit de deux manières à quelques lignes d'intervalle (application layer). »

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 4. RÈGLES GÉNÉRALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Ne signaler QUE les vraies erreurs. Une traduction correcte n'est pas mentionnée.
- Termes à surveiller particulièrement : Hub, DFSP, Payer, Payee, Scheme, Settlement, Clearing, Callback, Endpoint, Datastore, Bounded Context, Hub Operator, Switch Operator.
- Un terme anglais sans équivalent français établi peut rester en anglais, SAUF si c'est utilisé de façon incohérente d'une section à l'autre (→ signaler alors comme "Style").
- Chaque ligne = UNE seule erreur spécifique.
- Aucun texte en dehors du tableau : pas d'introduction, pas de conclusion, pas de commentaire global, pas de résumé.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 5. MODÈLE DE SAISIE (à remplir à chaque session)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**URL :** https://docs.jengacore.com/technical/reference-architecture/furtherReading/
**Section :** [Technique ]

**Texte EN :**
Further Reading
#
Team Resources

During the Reference Architecture planning work sessions, the Team made use of different resources to build and retain a record of discussions and to build the Use Case Models required to support all of the possible stakeholder requirements for the new architecture.

Please feel free to visit the Team’s resources using the links provided.

P.S. One resource that you might find particularly useful is Miro, where we keep a record of all of the Bounded Context Use Cases in use by the system.

Note: Please bear in mind that the Reference Architecture document is a living document, and as a result is updated from time to time for various reasons. This means that the resources that we have shared with you are still in use and will change occasionally.
Resource 	Purpose 	Link/URL
Miro 	Build Use Case flow diagrams 	Miro - Mojaloop Reference Architecture (opens new window)
Google Docs 	Session work notes for the team providing details of Reference Architecture for inclusion in the proposal and introductory documentation. 	Mojaloop 2.0 Reference Architecture Work Sessions (opens new window)
Google Sheets 	Record of Common Interfaces in use in the Switch architecture, along with various other bits and pieces. 	Mojaloop 2.0 Reference Architecture (opens new window)
#
Reference Articles and Documents

The resources below were sourced to provide additional insight into the architecture models that have been implemented.
Resource 	Details
Domain-Driven Design, from Wikipedia, the free encyclopedia (opens new window) 	Publisher: Wikipedia, the free encyclopedia; Author: Community; Date: non-specific; ±7mins to read
Domain, Subdomain, Bounded Context, Problem/Solution Space in DDD: Clearly Defined (opens new window) 	Publisher: Medium.com; Author: Nick Tune; Date: 11/07/2020; ±7mins to read
Strategic Domain-Driven Design (opens new window) 	Publisher: Vaadin.com; Author: Petter Holmstrom
Pattern: Decompose by Subdomain Context (opens new window) 	Publisher: Microservices Architecture; Author: Chris Richardson
Rest API Tutorial (opens new window) 	Publisher: Self-published; Author: Todd Fredrich; License: Creative Commons Attribution ShareAlike 4.0 International License (opens new window)
Use Case, from Wikipedia, the free encyclopedia (opens new window) 	In brief, and quoting from the opening blurb of the Wikipedia article, a use case is a list of actions or event steps typically defining the interactions between a role (known in the Unified Modeling Language (UML) as an actor) and a system to achieve a goal. The actor can be a human or other external system. In systems engineering, use cases are used at a higher level than within software engineering, often representing missions or stakeholder goals. The detailed requirements may then be captured in the Systems Modeling Language (SysML) or as contractual statements.
#
Project Iteration Convenings

The resources below are inclusions to the Mojaloop Technical Convenings by the Reference Architecture Team starting at the beginning of 2021. Resources include notes, slides, and video recordings.
Project Iteration (PI) 	Period 	Description 	Link/URL
PI-13 	January 2021 	Mojaloop Performance, Scalability and Architecture Update 	PI-13 Slides & Recording (opens new window)
PI-14 	April 2021 	Opening and Mojaloop Reference Architecture and TigerBeetle 	PI-14 Recording (YouTube) (opens new window)
PI-15 	July 2021 	Reference Architecture v1.0 	PI-15 Resources (opens new window) / PI-15 Video Library (YouTube) (opens new window)
PI-16 	October 2021 	Reference Architecture and V2 update 	PI-16 Agenda (opens new window) / PI-16 Video Library (opens new window)
PI-17 	January 2022 	Reference Architecture: Documentation and v.Next Updates 	PI-17 Reference Architecture Presentation (YouTube) (opens new window)
Edit this page on GitHub (opens new window)
Last Updated: 4/29/2026, 9:24:59 PM

← Glossary Overview →

**Texte FR :**
Lectures complémentaires
#
Ressources de l’équipe

Lors des sessions de planification de l’Architecture de Référence, l’équipe a utilisé différentes ressources pour conserver un historique des discussions et construire les modèles de cas d’utilisation nécessaires afin de répondre à l’ensemble des exigences possibles des parties prenantes pour la nouvelle architecture.

N’hésitez pas à consulter les ressources de l’équipe via les liens fournis.

P.S. Une ressource que vous pourriez particulièrement trouver utile est Miro, où nous conservons un enregistrement de l’ensemble des cas d’utilisation de « Bounded Context » actuellement utilisés par le système.

Note : Veuillez garder à l’esprit que le document de l’Architecture de Référence est un document vivant et, en conséquence, il est mis à jour périodiquement pour diverses raisons. Cela signifie que les ressources que nous partageons avec vous sont toujours utilisées et peuvent changer occasionnellement.
Ressource 	Objectif 	Lien/URL
Miro 	Création de diagrammes de flux des cas d’utilisation 	Miro - Architecture de Référence Mojaloop (opens new window)
Google Docs 	Notes de sessions de travail pour l’équipe, fournissant des détails sur l’architecture de référence à inclure dans la proposition et la documentation d’introduction. 	Mojaloop 2.0 Reference Architecture Work Sessions (opens new window)
Google Sheets 	Registre des interfaces courantes utilisées dans l’architecture Switch, ainsi que divers autres éléments. 	Mojaloop 2.0 Reference Architecture (opens new window)
#
Articles et documents de référence

Les ressources ci-dessous ont été sélectionnées pour offrir un éclairage supplémentaire sur les modèles d’architecture ayant été mis en œuvre.
Ressource 	Détails
Domain-Driven Design, extrait de Wikipédia, l’encyclopédie libre (opens new window) 	Éditeur : Wikipédia, l’encyclopédie libre ; Auteur : Communauté ; Date : non-spécifiée ; ±7min de lecture
Domain, Subdomain, Bounded Context, Problem/Solution Space in DDD: Clearly Defined (opens new window) 	Éditeur : Medium.com ; Auteur : Nick Tune ; Date : 11/07/2020 ; ±7min de lecture
Strategic Domain-Driven Design (opens new window) 	Éditeur : Vaadin.com ; Auteur : Petter Holmstrom
Pattern: Decompose by Subdomain Context (opens new window) 	Éditeur : Microservices Architecture ; Auteur : Chris Richardson
Rest API Tutorial (opens new window) 	Éditeur : Auto-édité ; Auteur : Todd Fredrich ; Licence : Creative Commons Attribution ShareAlike 4.0 International License (opens new window)
Use Case, extrait de Wikipédia, l’encyclopédie libre (opens new window) 	En bref, et pour reprendre l’introduction de l’article Wikipédia, un cas d’utilisation est une liste d’actions ou d’étapes, généralement définissant les interactions entre un rôle (connu en Unified Modeling Language (UML) sous le nom d’acteur) et un système afin d’atteindre un objectif. L’acteur peut être un humain ou un autre système externe. En ingénierie système, les cas d’utilisation sont utilisés à un niveau plus élevé que dans l’ingénierie logicielle, représentant souvent des missions ou des objectifs de parties prenantes. Les exigences détaillées peuvent ensuite être capturées dans le Systems Modeling Language (SysML) ou comme des énoncés contractuels.
#
Réunions d’itération de projet

Les ressources ci-dessous sont des contributions aux « Technical Convenings » de Mojaloop par l’équipe d’architecture de référence à partir du début de l’année 2021. Elles incluent notes, diapositives et enregistrements vidéo.
Itération de projet (PI) 	Période 	Description 	Lien/URL
PI-13 	Janvier 2021 	Performance de Mojaloop, évolutivité et mise à jour de l’architecture 	PI-13 Slides & Recording (opens new window)
PI-14 	Avril 2021 	Introduction et Architecture de Référence Mojaloop et TigerBeetle 	Enregistrement PI-14 (YouTube) (opens new window)
PI-15 	Juillet 2021 	Architecture de Référence v1.0 	Ressources PI-15 (opens new window) / Vidéothèque PI-15 (YouTube) (opens new window)
PI-16 	Octobre 2021 	Architecture de Référence et mise à jour V2 	Agenda PI-16 (opens new window) / Vidéothèque PI-16 (opens new window)
PI-17 	Janvier 2022 	Architecture de Référence : Documentation et mises à jour v.Next 	Présentation Architecture de Référence PI-17 (YouTube) (opens new window)
Modifier cette page sur GitHub (opens new window)
Dernière mise à jour: 29/04/2026 21:24:59

← TBD Placeholder API FSPIOP →
