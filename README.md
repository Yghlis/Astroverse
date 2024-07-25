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

| Tâche                                                                       | Achraf         |     Youri    |
| --------------------------------------------------------------------------- | ------ | ----- | ----- | ---- |
| --------------------------------------------------------------------------- | ------ | ----- | ----- | ---- |
|                                                                             | Front  | Back  | Front | Back |
| **Inscription avec confirmation par mail**                                  | x      |       |       | X    |
| **Connexion et prévention de la connexion si le compte n’est pas confirmé** | X      |       |       | X    |
| **Réinitialisation du mot de passe**                                        | X      |       | x     | X    |
| **Conservation des mots de passes hachés**                                  |        |       |       | X    |
| **Recherche via entrée utilisateur** : par nom                              | X      |       |       | X    |
| **Recherche facettée** : Personnages, Univers, Évaluations, Prix, promotion | X      |       |       | X    |
| **Alertes sur les nouveaux produits**                                       |        |       |       | X    |
| **Alertes sur le restock de produits**                                      |        |       |       | X    |
| **Alertes sur les changements de prix**                                     |        |       |       | X    |
| **Inscription à la newsletter**                                             | X      |       |       | X    |
| **Panier**                                                                  | X      |       |       | X    |
| **Card du shop**                                                            | X      |       |       | X    |
| **Intégration d’API de paiement** : [Stripe](https://stripe.com)            |        |       | x     | X    |
| **Card KPI**                                                                | X      |       |       | X    |
| **Navbar backoffice**                                                       | X      |       |       |      |
| **Carrousel landing page**                                                  | X      |       |       | X    |
| **Carrousel top product**                                                   | X      |       |       | X    |
| **Card universe**                                                           | X      |       | x     | X    |
| **CGU et autre droit**                                                      |        |       | x     | X    |
| **Alertes en fin de stock**                                                 |        |       |       | X    |
| **Graphique d’évolution des stocks**                                        | X      |       |       | X    |
| **Demande de facturation**                                                  |        |       |       | X    |
| **Demande de retour produit**                                               |        |       |       | X    |
| **Recommander un produit**                                                  |        |       |       | X    |
| **CRUD sur l’ensemble des ressources**                                      | X      |       |       | X    |
| **Dashboard avec datavisualisation personnalisable**                        | X      |       |       | X    |
| **Side bar multi utilisation (favoris, connexion, et toggle des KPI)**      | X      |       |       |      |
| **Gestion des données personnelles d’un client**                            | X      |       |       | X    |
| **Autocomplétion de l'adresse**                                             | X      | X     |       |      |
| **Responsive navbar**                                                       | X      |       |       |      |
| **Structures des pages avec gestion router view**                           | X      |       |       |      |
| **Animation motion one + vue transition + scss**                            | X      |       |       |      |
| **Gridstack grid gestion**                                                  | X      |       |       |      |

Liste non exhaustive dans la mesure où beaucoup de tâches sont faites ensemble

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
