<template>
  <div class="checkout">
    <div class="checkout-content">
      <h2>Finalisation de la commande</h2>
      <form @submit.prevent="handleSubmit">
        <div class="address-section">
          <label for="address">Adresse de livraison</label>
          <input
            v-model="address"
            @input="handleInput"
            type="text"
            id="address"
            placeholder="Entrez votre adresse"
            required
          />
          <ul v-if="suggestions.length">
            <TheLoader v-if="loading" :loading="loading"></TheLoader>
            <li
              v-else
              v-for="suggestion in suggestions"
              :key="suggestion.place_id"
              @click="selectSuggestion(suggestion)"
            >
              {{ suggestion.formatted }}
            </li>
          </ul>
        </div>
        <div class="save-address">
          <input
            v-model="saveAddressForLater"
            type="checkbox"
            id="saveAddressForLater"
          />
          <label for="saveAddressForLater"
            >Sauvegarder l'adresse pour de futurs achats</label
          >
        </div>
        <div class="save-address">
          <input
            v-model="sameAddressForPayment"
            type="checkbox"
            id="sameAddressForPayment"
          />
          <label for="sameAddressForPayment"
            >Si l'adresse de facturation = adresse de livraison</label
          >
        </div>
        <div v-if="!sameAddressForPayment" class="payment-address">
          <label for="street">Rue</label>
          <input
            v-model="street"
            type="text"
            id="street"
            placeholder="Entrez votre rue"
            required
          />
          <label for="city">Ville</label>
          <input
            v-model="city"
            type="text"
            id="city"
            placeholder="Entrez votre ville"
            required
          />
          <label for="postal_code">Code Postal</label>
          <input
            v-model="postalCode"
            type="number"
            id="postal_code"
            placeholder="Entrez votre code postal"
            required
          />
        </div>
        <div class="articles">
          <h3>Mes Articles</h3>
          <ShopCart
            :cartItems="cartItems"
            :incrementItemQuantity="incrementItemQuantity"
            :decrementItemQuantity="decrementItemQuantity"
            :getItemPrice="getItemPrice"
            :removeItem="removeItem"
          />
          <span>Total: {{ cartTotal }}€ /HT</span>
          <span>TVA 20%</span>
          <span>Total: {{ cartTotal * 1.2 }}€ /TTC</span>
        </div>
        <div>
          <label for="payment-element">Détails de paiement</label>
          <div id="payment-element"></div>
          <div id="payment-errors" role="alert"></div>
        </div>
        <div class="save-address">
          <input
            v-model="acceptCGU"
            type="checkbox"
            id="acceptCGU"
            required
          />
          <label for="acceptCGU">
            Je confirme avoir lu&nbsp;
            <a href="#" @click.prevent="openCGUModal">les CGU</a><span>*</span>
          </label>
        </div>
        <button type="submit" class="call-to-action" :disabled="!acceptCGU">
          Rentrer ma cb
        </button>
        <button type="button" class="call-to-action" @click="handlePayment">
          Payer
        </button>
      </form>
    </div>
    <div v-if="showCGUModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeCGUModal">&times;</span>
        <div class="cgu-content">
          <h2>Mentions Légales</h2>
          <p><strong>1. Éditeur du Site</strong></p>
          <ul>
            <li>Nom de l'entreprise : Astroverse</li>
            <li>Adresse : 34 rue Juliette Savarin, 94000</li>
            <li>Téléphone : 0625984606</li>
            <li>Email : <a href="mailto:Astroverse@gmail.com">Astroverse@gmail.com</a></li>
          </ul>
          <p><strong>2. Hébergeur</strong></p>
          <ul>
            <li>Nom de l'hébergeur : Renderer</li>
            <li>Adresse : 45 rue du Cavalier, 76000</li>
            <li>Téléphone : 0176887766</li>
            <li>Email : <a href="mailto:Heroku@gmail.com">Heroku@gmail.com</a></li>
          </ul>

          <h2>Conditions Générales d'Utilisation (CGU)</h2>
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

          <h2>Politique de Confidentialité</h2>
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

          <h2>Politique de Remboursement</h2>
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

          <h2>Politique de Cookies</h2>
          <p><strong>1. Absence de Cookies</strong></p>
          <p>Astroverse n'utilise pas de cookies sur son site. Toutes les informations nécessaires sont collectées via des formulaires sécurisés. Nous nous engageons à respecter la vie privée de nos utilisateurs et à ne pas suivre leur activité en ligne.</p>

          <h2>Politique de Livraison</h2>
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

          <h2>Accessibilité du Site</h2>
          <p>Nous suivons la RGAA pour mettre en place notre site et faire un audit voici les fonctionnalités présentes sur notre site et qui peuvent être soumises au RGAA :</p>
          <p>Ce qui nous donne un score d'accessibilité de ... Nous avons aussi utilisé des outils comme Axe DevTools et WAVE Evaluation Tool pour régler tous les problèmes liés à l'accessibilité.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cartStore';
import ShopCart from '../ui/ShopCart.vue';
import TheLoader from '../ui/TheLoader.vue';
import { loadStripe } from '@stripe/stripe-js';
import { jwtDecode } from "jwt-decode";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const cartStore = useCartStore();
const router = useRouter();

const cartItems = computed(() => cartStore.cartItems);
const cartTotal = computed(() => cartStore.cartTotal);
const incrementItemQuantity = (itemId) => {
  cartStore.incrementItemQuantity(itemId);
};
const decrementItemQuantity = (itemId) => {
  cartStore.decrementItemQuantity(itemId);
};
const getItemPrice = (item) => {
  return cartStore.getItemPrice(item);
};

const removeItem = (itemId) => {
  cartStore.removeItemFromCart(itemId);
};

const address = ref('');
const fullAddress = reactive({});
const saveAddressForLater = ref(false);
const sameAddressForPayment = ref(true);
const addressForPayment = reactive({});
const city = ref('');
const street = ref('');
const postalCode = ref('');
const suggestions = ref([]);
const loading = ref(false);
let debounceTimeout = null;

const acceptCGU = ref(false);
const showCGUModal = ref(false);

const fetchSuggestions = async (query) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  loading.value = true;
  try {
    const response = await fetch(`${apiUrl}/geocode?address=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    suggestions.value = data.results;
    loading.value = false;
  } catch (error) {
    console.error('Error fetching geocoded data:', error);
    loading.value = false;
  }
};

const handleInput = () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    if (address.value.trim()) {
      fetchSuggestions(address.value);
    }
  }, 300);
};

const selectSuggestion = (suggestion) => {
  address.value = suggestion.formatted;
  Object.assign(fullAddress, suggestion, {
    saveForLater: saveAddressForLater.value,
  });
  suggestions.value = [];
};

const fetchUserAddress = async () => {
  const jwt = localStorage.getItem('jwt');
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!jwt) {
    console.error('No JWT found');
    return;
  }

  let userId;
  try {
    const decodedJwt = jwtDecode(jwt);
    userId = decodedJwt.userId;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user address');
    }

    const data = await response.json();
    if (data.address) {
      address.value = `${data.address.street}, ${data.address.city}, ${data.address.postal_code}, ${data.address.country}`;
      fullAddress.street = data.address.street;
      fullAddress.city = data.address.city;
      fullAddress.postal_code = data.address.postal_code;
      fullAddress.country = data.address.country;

      // Trigger fetching suggestions for pre-filled address
      fetchSuggestions(address.value);
    }
  } catch (error) {
    console.error('Error fetching user address:', error);
  }
};

let stripe, elements, paymentElement;

onMounted(async () => {
  stripe = await stripePromise;
  await fetchUserAddress(); // Fetch user address on mount
});

const updateUserAddress = async (address) => {
  const jwt = localStorage.getItem('jwt');
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!jwt) {
    console.error('No JWT found');
    return;
  }

  let userId;
  try {
    const decodedJwt = jwtDecode(jwt);
    userId = decodedJwt.userId; // Assurez-vous que l'ID utilisateur est correctement décodé
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return;
  }

  // Extraire les informations pertinentes
  const simplifiedAddress = {
    city: address.city,
    street: `${address.housenumber || ''} ${address.street || ''}`.trim(),
    country: address.country || address.country_code,
    postal_code: address.postal_code || address.postcode,
  };

  try {
    const response = await fetch(`${apiUrl}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify({ address: simplifiedAddress }),
    });

    if (!response.ok) {
      throw new Error('Failed to update address');
    }

    const data = await response.json();
    console.log('User address updated successfully:', data);
  } catch (error) {
    console.error('Error updating user address:', error);
  }
};

const handleSubmit = async () => {
  if (!stripe) {
    console.error('Stripe.js n\'a pas été initialisé');
    return;
  }

  const apiUrl = import.meta.env.VITE_API_URL;

  // Vérifier si l'utilisateur est connecté
  const jwt = localStorage.getItem('jwt');
  if (!jwt) {
    alert('Veuillez vous connecter');
    return;
  }

  // Vérifier si le panier contient des produits
  try {
    const response = await fetch(`${apiUrl}/basket/check-items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'session-id': localStorage.getItem('sessionId'),
        'Authorization': `Bearer ${jwt}`,
      },
    });

    const data = await response.json();
    if (!data.hasItems) {
      alert('Votre panier est vide');
      return;
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du panier:', error);
    alert('Erreur lors de la vérification du panier');
    return;
  }

  if (sameAddressForPayment.value) {
    Object.assign(addressForPayment, fullAddress);
  } else {
    addressForPayment.city = city.value;
    addressForPayment.street = street.value;
    addressForPayment.postal_code = postalCode.value;
    addressForPayment.country = 'France';
  }

  if (saveAddressForLater.value) {
    await updateUserAddress(addressForPayment);
  } else if (address.value !== `${fullAddress.street}, ${fullAddress.city}, ${fullAddress.postal_code}, ${fullAddress.country}`) {
    await updateUserAddress(fullAddress);
  }

  try {
    // Créer une commande
    const orderResponse = await fetch(`${apiUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'session-id': localStorage.getItem('sessionId'),
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        shippingAddress: fullAddress.formatted,
        billingAddress: sameAddressForPayment.value
          ? fullAddress.formatted
          : `${street.value}, ${city.value}, ${postalCode.value}, France`,
      }),
    });

    const orderData = await orderResponse.json();

    if (orderResponse.ok) {
      console.log('Order created:', orderData);

      // Initialiser Stripe Elements après la création de la commande
      const clientSecret = orderData.clientSecret;
      elements = stripe.elements({ clientSecret });
      paymentElement = elements.create('payment');
      paymentElement.mount('#payment-element');
    } else {
      console.error('Erreur lors de la création de la commande:', orderData);
      alert(`Erreur lors de la création de la commande: ${orderData.message}`);
    }
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    alert('Erreur lors de la création de la commande');
  }
};

const handlePayment = async () => {
  if (!stripe || !elements) {
    console.error('Stripe.js n\'a pas été initialisé');
    return;
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  const jwt = localStorage.getItem('jwt');

  try {
    // Créer le paiement Stripe
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/confirmation`,
      },
    });

    if (error) {
      console.error('Échec du paiement:', error);
      alert('Échec du paiement. Veuillez réessayer.');
      // Supprimer la commande si le paiement échoue
      await fetch(`${apiUrl}/orders/${orderData.orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      });
    } else {
      alert('Commande créée avec succès');
      router.push('/confirmation'); // Redirigez vers une page de confirmation si nécessaire
    }
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    alert('Erreur lors de la création du paiement');
  }
};

const openCGUModal = () => {
  showCGUModal.value = true;
};

const closeCGUModal = () => {
  showCGUModal.value = false;
};
</script>

<style scoped lang="scss">
.checkout {
  background-color: #ccc;
  &-content {
    padding: 20px;
    max-width: 700px;
    margin: 50px auto;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    h2 {
      text-align: center;
      margin-bottom: 20px;
      font-size: 24px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .address-section {
        display: flex;
        flex-direction: column;

        label {
          margin-bottom: 8px;
          font-weight: bold;
          font-size: 20px;
        }

        input[type="text"] {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
        }

        ul {
          margin-top: 10px;
          padding: 0;
          list-style: none;

          li {
            background: #fff;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
            &:hover {
              background-color: #e7e7e7;
            }
          }
        }
      }

      .save-address {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 10px;

        input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
      }

      .payment-address {
        display: flex;
        flex-direction: column;

        label {
          margin: 5px 0;
          font-weight: bold;
          font-size: 16px;
        }

        input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
        }
      }

      .articles {
        display: flex;
        flex-direction: column;
        h3 {
          font-size: 20px;
          margin: 8px 0 0 0;
        }

        span {
          font-size: 20px;
          font-weight: bold;
          text-align: center;
          margin: 20px 0;
          color: white;
          background-color: black;
          padding: 0.5rem 0.5rem;
          border-radius: 5px;
        }
      }

      button {
        padding: 10px;
        background-color: #41c902;
        color: #fff;
        border: none;
        width: 200px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;

        &:hover {
          background-color: #55af00;
        }
        &:disabled {
          background-color: #ddd;
          cursor: not-allowed;
        }
      }
    }
  }
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);

  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 80%;
    max-width: 80%;
    position: relative;

    .close {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 30px;
      cursor: pointer;
    }

    .cgu-content {
      max-height: 60vh;
      overflow-y: auto;
    }
  }
}
</style>
