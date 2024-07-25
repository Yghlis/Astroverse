# Astroverse 

Astroverse est un site e-commerce de vente de figurines en France. Vous pouvez accéder au site à l'URL suivante : [Astroverse](https://astroverse.onrender.com/).

## Fonctionnalités

### Authentification

- **Inscription avec confirmation par mail**
- **Connexion et prévention de la connexion si le compte n’est pas confirmé**
- **Réinitialisation du mot de passe**
- **Conservation des mots de passes hachés**

### Recherche de Produits

- **Recherche via entrée utilisateur** : par nom.
- **Recherche facettée** : Personnages, Univers, Évaluations, Prix, promotion.

### Gestion d'Alerte par Mail

- **Alertes sur les nouveaux produits**
- **Alertes sur le restock de produits**
- **Alertes sur les changements de prix**
- **Inscription à la newsletter**

### Panier avec Système de Réservation

- **Réservation de 15 minutes** (3min pour la démonstration)

### Intégration d'une Plateforme de Paiement

- **Intégration d’API de paiement** : [Stripe](https://stripe.com).

### Gestion des Stocks

- **Alertes en fin de stock**
- **Graphique d’évolution des stocks**

### Historique de Commande

- **Demande de facturation**
- **Demande de retour produit**
- **Recommander un produit**

### Panel d'Administration

- **CRUD sur l’ensemble des ressources**
- **Dashboard avec datavisualisation personnalisable**

### Rôles Utilisateurs

- **ROLE_USER** : client classique
- **ROLE_STORE_KEEPER** : gestion des stocks (accès au panel admin en mode restrain)
- **ROLE_ADMIN** : accès au panel admin

### Fonctionnalités Bonus

- **Gestion des données personnelles d’un client** ( le client peux modifier ses informations)
- **Gestion d’opérations de promotion** (lors de la création du produit)
- **Autocomplétion de l'adresse**

## Déploiement

Nous avons utilisé [Render](https://render.com) pour le déploiement de notre application.

## Gestion des Tâches

Pour la gestion des tâches, nous avons utilisé [Trello](https://trello.com). Les tâches ont été réparties entre les membres de l'équipe selon les domaines suivants :

- **Front-end** : développement de l'interface utilisateur avec VueJS.
- **Back-end** : développement des API et de la logique métier avec NodeJs et MongoDB.

## Technologies Utilisées

- **NodeJs** : [Site officiel](https://nodejs.org)
- **MongoDB** : [Site officiel](https://www.mongodb.com)
- **VueJS** : [Site officiel](https://vuejs.org)
- **TypeScript** : [Site officiel](https://www.typescriptlang.org)
- **Motion One** : [Motion](https://motion.dev)
- **Grid Stack** : [Gridstack.js](https://gridstackjs.com)
- **Pinia** : [Pinia](https://pinia.vuejs.org)
- **Stripe** : [Stripe](https://stripe.com)
- **Bcrypt** : [Bcrypt](https://www.npmjs.com/package/bcrypt)
- **Chart.js** : [Chart.js](https://www.chartjs.org)
- **Jspdf** : [Jspdf](https://parall.ax/products/jspdf)
- **Jwt-decode** : [Jwt-decode](https://www.npmjs.com/package/jwt-decode)
- **Multer** : [Multer](https://www.npmjs.com/package/multer)
- **Vue-router** : [Vue-router](https://router.vuejs.org)
- **Zod** : [Zod](https://zod.dev)

## Répartition des Tâches

# Liste des tâches

## Inscription avec confirmation par mail
- Achraf : x
- Youri : x

## Connexion et prévention de la connexion si le compte n’est pas confirmé
- Achraf : x
- Youri : x

## Réinitialisation du mot de passe
- Achraf : x
- Youri : x

## Conservation des mots de passes hachés
- Achraf : 
- Youri : x

## Recherche via entrée utilisateur : par nom
- Achraf : x
- Youri : x

## Recherche facettée : Personnages, Univers, Évaluations, Prix, promotion
- Achraf : x
- Youri : x

## Alertes sur les nouveaux produits
- Achraf : 
- Youri : x

## Alertes sur le restock de produits
- Achraf : 
- Youri : x

## Alertes sur les changements de prix
- Achraf : 
- Youri : x

## Inscription à la newsletter
- Achraf : x
- Youri : x

## Panier
- Achraf : x
- Youri : x

## Card du shop
- Achraf : x
- Youri : x

## Intégration d’API de paiement : Stripe
- Achraf : x
- Youri : x

## Card KPI
- Achraf : x
- Youri : x

## Navbar backoffice
- Achraf : x
- Youri : 

## Carrousel landing page
- Achraf : x
- Youri : x

## Carrousel top product
- Achraf : x
- Youri : x

## Card universe
- Achraf : x
- Youri : x

## CGU et autre droit
- Achraf : 
- Youri : x

## Alertes en fin de stock
- Achraf : 
- Youri : x

## Graphique d’évolution des stocks
- Achraf : x
- Youri : x

## Demande de facturation
- Achraf : 
- Youri : x

## Demande de retour produit
- Achraf : 
- Youri : x

## Recommander un produit
- Achraf : 
- Youri : x

## CRUD sur l’ensemble des ressources
- Achraf : x
- Youri : x

## Dashboard avec datavisualisation personnalisable
- Achraf : x
- Youri : x

## Side bar multi utilisation (favoris, connexion, et toggle des KPI)
- Achraf : x
- Youri : 

## Gestion des données personnelles d’un client
- Achraf : x
- Youri : x

## Autocomplétion de l'adresse
- Achraf : x
- Youri : x

## Responsive navbar
- Achraf : x
- Youri : 

## Structures des pages avec gestion router view
- Achraf : x
- Youri : 

## Animation motion one + vue transition + scss
- Achraf : x
- Youri : 

## Gridstack grid gestion
- Achraf : x
- Youri : 

Liste non exhaustive dans la mesure où beaucoup de tâches sont faites ensemble.

## Installation
( utiliser la branche deploy-render )

Pour installer et exécuter le projet en local :

1. Clonez le repository :

   ```bash
   git clone https://github.com/votre-repository/astroverse.git
   ```

2. Accédez au répertoire du projet :

   ```bash
   cd astroverse
   ```

3. Installez les dépendances pour le serveur NodeJs :

   ```bash
   cd server
   npm install
   ```

4. Installez les dépendances pour le client VueJs :

   ```bash
   cd client
   npm install
   ```

5. Démarrez l'application :
   ```bash
   docker-compose up --build
   ```

---

Astroverse - Vendre des figurines n'a jamais été aussi facile!
