<template>
    <div class="legal-content">
      <h1>{{ title }}</h1>
      <div v-if="section === 'legal'">
        <p><strong>1. Éditeur du Site</strong></p>
        <ul>
          <li>Nom de l'entreprise : Astroverse</li>
          <li>Adresse : 34 rue Juliette Savarin, 94000</li>
          <li>Téléphone : 0625984606</li>
          <li>Email : <a href="mailto:Astroverse@gmail.com" target="_blank" class="url">Astroverse@gmail.com</a></li>
        </ul>
        <p><strong>2. Hébergeur</strong></p>
        <ul>
          <li>Nom de l'hébergeur : Renderer</li>
          <li>Adresse : 45 rue du Cavalier, 76000</li>
          <li>Téléphone : 0176887766</li>
          <li>Email : <a href="mailto:Heroku@gmail.com" target="_blank" class="url">Heroku@gmail.com</a></li>
        </ul>
      </div>
  
      <div v-if="section === 'cgu'">
        <p><strong>1. Introduction</strong></p>
        <p>Bienvenue sur Astroverse, le site de vente en ligne de figurines. En utilisant notre site, vous acceptez les présentes conditions générales d'utilisation. Veuillez les lire attentivement.</p>
        <p><strong>2. Inscription et Compte Utilisateur</strong></p>
        <p>Pour acheter des produits sur notre site, vous devez créer un compte en fournissant des informations exactes et complètes. Vous êtes responsable de la sécurité de votre mot de passe et de toute activité effectuée sous votre compte.</p>
        <p><strong>3. Utilisation du Site</strong></p>
        <p>Vous acceptez d'utiliser le site uniquement à des fins légales et de manière à ne pas enfreindre les droits d'autrui ou restreindre leur utilisation du site.</p>
        <p><strong>4. Propriété Intellectuelle</strong></p>
        <p>Tous les contenus présents sur le site (textes, images, logos) sont la propriété exclusive d'Astroverse et sont protégés par le droit d'auteur. Toute reproduction est interdite sans autorisation préalable.</p>
        <p><strong>5. Limitation de Responsabilité</strong></p>
        <p>Astroverse ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation de son site.</p>
        <p><strong>6. Modifications des CGU</strong></p>
        <p>Astroverse se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entreront en vigueur dès leur publication sur le site.</p>
      </div>
  
      <div v-if="section === 'privacy-policy'">
        <p><strong>1. Introduction</strong></p>
        <p>Astroverse s'engage à protéger la confidentialité de vos données personnelles. Cette politique explique comment nous collectons, utilisons et protégeons vos informations.</p>
        <p><strong>2. Données Collectées</strong></p>
        <p>Nous collectons les données suivantes :</p>
        <ul>
          <li>Nom et prénom</li>
          <li>Téléphone</li>
          <li>Adresse (optionnelle)</li>
          <li>Email</li>
        </ul>
        <p><strong>3. Utilisation des Données</strong></p>
        <p>Les données collectées sont utilisées pour :</p>
        <ul>
          <li>Gérer votre compte utilisateur</li>
          <li>Traiter vos commandes</li>
          <li>Vous informer des mises à jour importantes du site</li>
        </ul>
        <p><strong>4. Stockage et Sécurité des Données</strong></p>
        <p>Vos données sont stockées dans une base de données PostgreSQL sécurisée. Les mots de passe sont chiffrés et l'accès aux données est restreint aux utilisateurs ayant les rôles appropriés.</p>
        <p><strong>5. Droits des Utilisateurs</strong></p>
        <p>Vous avez le droit d'accéder, de corriger et de supprimer vos données personnelles. Vous pouvez également demander l'exportation de vos données.</p>
        <p><strong>6. Partage des Données</strong></p>
        <p>Nous partageons vos données uniquement avec Stripe pour le traitement des paiements.</p>
        <p><strong>7. Modifications de la Politique</strong></p>
        <p>Nous pouvons modifier cette politique à tout moment. Les modifications seront publiées sur notre site.</p>
      </div>
  
      <div v-if="section === 'refund-policy'">
        <p><strong>1. Introduction</strong></p>
        <p>Chez Astroverse, nous nous engageons à garantir la satisfaction de nos clients. Voici les conditions et procédures pour les remboursements :</p>
        <p><strong>2. Délai de Rétractation</strong></p>
        <p>Vous avez le droit de vous rétracter de votre achat dans un délai de 14 jours à compter de la réception de votre commande, sans avoir à justifier de motif (article L221-18 du Code de la consommation). Pour exercer ce droit, veuillez nous contacter via le formulaire de contact sur notre site. Les frais de retour sont à votre charge, sauf si le produit est défectueux ou incorrect.</p>
        <p><strong>3. Produit Défectueux ou Incorrect</strong></p>
        <p>Si vous recevez un produit défectueux ou incorrect, veuillez nous contacter dans les 14 jours suivant la réception de votre commande en fournissant des preuves (photos, description du défaut). Nous vous proposerons les solutions suivantes :</p>
        <p><strong>a. Remplacement</strong></p>
        <ul>
          <li>Si nous avons le même produit en stock, nous vous enverrons un remplacement sans frais supplémentaires.</li>
        </ul>
        <p><strong>b. Remboursement</strong></p>
        <ul>
          <li>Si le produit n'est plus en stock et que nous ne pouvons pas le remplacer, nous vous rembourserons intégralement.</li>
        </ul>
        <p><strong>4. Produit Indisponible chez le Fournisseur</strong></p>
        <p>Si le produit défectueux ou incorrect n'est plus disponible chez notre fournisseur, nous vous proposerons les options suivantes :</p>
        <p><strong>a. Crédit Boutique</strong></p>
        <ul>
          <li>Un crédit boutique équivalent au montant de votre achat, utilisable pour toute commande future sur Astroverse.</li>
        </ul>
        <p><strong>b. Remboursement</strong></p>
        <ul>
          <li>Un remboursement intégral sur le mode de paiement initial.</li>
        </ul>
        <p><strong>5. Retours Produits</strong></p>
        <p>Pour retourner un produit, veuillez suivre la procédure suivante :</p>
        <ul>
          <li>Contactez notre service client via le formulaire de contact pour obtenir une autorisation de retour.</li>
          <li>Emballez soigneusement le produit dans son emballage d'origine.</li>
          <li>Expédiez le produit à l'adresse indiquée par notre service client. Les frais de retour sont à votre charge, sauf en cas de produit défectueux ou incorrect.</li>
        </ul>
        <p><strong>6. État des Produits Retournés</strong></p>
        <p>Les produits doivent être retournés dans leur état d'origine, non utilisés et avec tous les accessoires et emballages d'origine. Tout produit retourné incomplet, abîmé, ou endommagé ne sera pas remboursé.</p>
        <p><strong>7. Délai de Remboursement</strong></p>
        <p>Une fois le produit retourné et inspecté, nous traiterons votre remboursement dans un délai de 14 jours. Le remboursement sera effectué sur le mode de paiement initial.</p>
        <p><strong>8. Contact</strong></p>
        <p>Pour toute question concernant notre politique de remboursement, veuillez nous contacter via le formulaire de contact sur notre site.</p>
      </div>
  
      <div v-if="section === 'warranty-conditions'">
        <p>Votre contenu des conditions de garantie ici...</p>
      </div>
  
      <div v-if="section === 'cookie-policy'">
        <p><strong>1. Absence de Cookies</strong></p>
        <p>Astroverse n'utilise pas de cookies sur son site. Toutes les informations nécessaires sont collectées via des formulaires sécurisés. Nous nous engageons à respecter la vie privée de nos utilisateurs et à ne pas suivre leur activité en ligne.</p>
      </div>
  
      <div v-if="section === 'shipping-policy'">
        <p><strong>1. Introduction</strong></p>
        <p>Chez Astroverse, nous nous engageons à vous offrir une expérience de livraison fiable et rapide. Voici les conditions et procédures de notre politique de livraison :</p>
        <p><strong>2. Zones de Livraison</strong></p>
        <p>Nous livrons exclusivement en France métropolitaine.</p>
        <p><strong>3. Délais de Livraison</strong></p>
        <ul>
          <li>Les commandes sont généralement traitées et expédiées dans un délai de 2 à 3 jours ouvrables.</li>
          <li>Les délais de livraison peuvent varier en fonction de la destination, mais la plupart des commandes sont livrées dans un délai de 5 à 7 jours ouvrables après expédition.</li>
        </ul>
        <p><strong>4. Frais de Livraison</strong></p>
        <p>Les frais de livraison sont calculés en fonction du poids et des dimensions des articles commandés ainsi que de la destination. Les frais de livraison seront clairement indiqués lors du processus de paiement.</p>
        <p><strong>5. Suivi de Livraison</strong></p>
        <p>Une fois votre commande expédiée, vous recevrez un email de confirmation avec un numéro de suivi. Vous pouvez utiliser ce numéro pour suivre l'état de votre livraison sur le site du transporteur.</p>
        <p><strong>6. Problèmes de Livraison</strong></p>
        <p><strong>a. Retard de Livraison</strong></p>
        <ul>
          <li>Si votre commande n'arrive pas dans les délais estimés, veuillez nous contacter via le formulaire de contact. Nous enquêterons sur la situation et vous tiendrons informé des prochaines étapes.</li>
        </ul>
        <p><strong>b. Colis Endommagé</strong></p>
        <ul>
          <li>Si vous recevez un colis endommagé, veuillez nous en informer immédiatement avec des photos du colis et des articles endommagés. Nous travaillerons avec le transporteur pour résoudre le problème et vous proposer une solution (remplacement ou remboursement).</li>
        </ul>
        <p><strong>c. Colis Perdu</strong></p>
        <ul>
          <li>Si votre colis est déclaré perdu par le transporteur, nous vous enverrons un remplacement ou procéderons à un remboursement intégral.</li>
        </ul>
        <p><strong>7. Adresse de Livraison Incorrecte</strong></p>
        <p>Il est de votre responsabilité de fournir une adresse de livraison exacte et complète. En cas d'erreur dans l'adresse de livraison, veuillez nous contacter dès que possible. Si la commande n'a pas encore été expédiée, nous ferons de notre mieux pour corriger l'adresse. Si le colis a déjà été expédié, nous ne pourrons être tenus responsables des retards ou des colis perdus.</p>
        <p><strong>8. Politique de Retour</strong></p>
        <p>Pour retourner un produit, veuillez suivre notre politique de remboursement et de retour. Les frais de retour sont à votre charge, sauf en cas de produit défectueux ou incorrect.</p>
        <p><strong>9. Contact</strong></p>
        <p>Pour toute question concernant notre politique de livraison, veuillez nous contacter via le formulaire de contact sur notre site.</p>
      </div>
  
      <div v-if="section === 'accessibility'">
        <p>Nous suivons la RGAA pour mettre en place notre site et faire un audit voici les fonctionnalités présentes sur notre site et qui peuvent être soumises au RGAA :</p>
        <p>Ce qui nous donne un score d'accessibilité de ... Nous avons aussi utilisé des outils comme Axe DevTools et WAVE Evaluation Tool pour régler tous les problèmes liés à l'accessibilité.</p>
      </div>
  
      <div v-if="section === 'not-found'">
        <p>Le contenu que vous recherchez est introuvable.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const title = ref('');
  const section = ref('');
  
  const updateContent = () => {
    section.value = route.params.section;
    switch (section.value) {
      case 'legal':
        title.value = 'Mentions légales';
        break;
      case 'cgu':
        title.value = "Conditions générales d'utilisation";
        break;
      case 'privacy-policy':
        title.value = "Politique de confidentialité";
        break;
      case 'refund-policy':
        title.value = "Politique de remboursement";
        break;
      case 'warranty-conditions':
        title.value = "Conditions de garantie";
        break;
      case 'cookie-policy':
        title.value = "Politique de cookie";
        break;
      case 'shipping-policy':
        title.value = "Politique de livraison";
        break;
      case 'accessibility':
        title.value = "Accessibilité du site";
        break;
      default:
        title.value = 'Page non trouvée';
        section.value = 'not-found';
    }
  };
  
  watch(route, updateContent, { immediate: true });
  </script>
  
  <style scoped>
  .legal-content {
    padding: 20px;
  }
  </style>
  