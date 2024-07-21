<template>
  <div class="profile-container">
    <h2>Mes Informations</h2>
    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="firstName">Prénom<span>*</span>:</label>
        <input v-model="firstName" id="firstName" type="text" required />
      </div>

      <div class="form-group">
        <label for="lastName">Nom<span>*</span>:</label>
        <input v-model="lastName" id="lastName" type="text" required />
      </div>

      <div class="form-group">
        <label for="email">Email<span>*</span>:</label>
        <input v-model="email" id="email" type="email" required />
      </div>

      <div class="form-group" v-if="phoneNumber">
        <label for="phoneNumber">Numéro de Téléphone:</label>
        <input v-model="phoneNumber" id="phoneNumber" type="text" />
      </div>

      <div class="form-group address-section">
        <label for="address">Adresse</label>
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
      <button type="submit" :disabled="!addressSelected">
        Mettre à jour le profil
      </button>
      <p @click="sendResetEmail">Modifier le mot de passe</p>
    </form>
    <h2>Mes produits suivis</h2>
    <TheCarousel>
      <shopCard
        v-for="item in displayProducts"
        :key="item.id"
        :product="item.Product"
      ></shopCard>
    </TheCarousel>
    
    <!-- Section des commandes -->
    <h2>Mes Commandes</h2>
    <div v-for="order in orders" :key="order.id" class="order-container">
      <div class="order-header">
        <div>
          <p>Commande effectuée le {{ new Date(order.createdAt).toLocaleDateString() }}</p>
          <p>Total : {{ order.totalPrice }} €</p>
        </div>
        <div>
          <p>Livraison à {{ order.shippingAddress }}</p>
        </div>
      </div>
      <div class="order-items">
        <div v-for="item in order.products" :key="item.productId" class="order-item">
          <img :src="getImageUrl(item.image_preview)" alt="product image" class="product-image" />
          <div class="product-details">
            <p>{{ item.title }}</p>
            <p>{{ item.quantity }} x {{ item.price }} €</p>
          </div>
        </div>
      </div>
      <div class="order-actions">
        <button @click="refundOrder(order.id)">Demander un remboursement</button>
        <button @click="reorder(item.productId)">Acheter à nouveau</button>
        <button @click="viewOrder(order.id)">Consulter la commande</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import TheLoader from "../ui/TheLoader.vue";
import TheCarousel from "../ui/TheCarousel.vue";
import shopCard from "../ui/shopCard.vue";
import { useUserStore } from "../stores/userStore";
import { useProductStore } from "../stores/useProductStore";
import useFlashMessageStore from "@composables/useFlashMessageStore";

const { flashMessage, flashMessageType, setFlashMessage } =
  useFlashMessageStore();

const userStore = useUserStore();
const productStore = useProductStore();

const apiUrl = "http://localhost:8000"; // Base URL pour les images

onMounted(() => {
  const id = localStorage.getItem("userId");
  userStore.getUserById(id);
  productStore.getFollowedProducts(id);
  fetchUserOrders(id); // Appel pour récupérer les commandes de l'utilisateur
});

const userData = computed(() => userStore.userData);
const followedProducts = computed(() => productStore.followedProducts);

// Refs pour les champs d'entrée
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const phoneNumber = ref("");

// Ref pour l'adresse complète
const address = ref("");
const initialAddress = ref("");

// Ref pour indiquer si une adresse suggérée a été sélectionnée
const addressSelected = ref(true);

// Watcher pour mettre à jour les valeurs des champs lorsque les données utilisateur changent
watch(
  userData,
  (newVal) => {
    firstName.value = newVal.first_name || "";
    lastName.value = newVal.last_name || "";
    email.value = newVal.email || "";
    phoneNumber.value = newVal.phone_number || "";

    const addressData = newVal.address || {};
    const formattedAddress = `${addressData.street || ""} ${
      addressData.city || ""
    } ${addressData.postal_code || ""} ${addressData.country || ""}`.trim();
    address.value = formattedAddress;
    initialAddress.value = formattedAddress;
  },
  { immediate: true }
);

const displayProducts = ref([]);

// Watcher pour mettre à jour les produits suivis affichés lorsque les données changent
watch(
  followedProducts,
  (newVal) => {
    displayProducts.value = newVal;
  },
  { immediate: true }
);

const orders = ref([]);

// Méthode pour récupérer les commandes de l'utilisateur
const fetchUserOrders = async (userId) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log(`API URL: ${apiUrl}/orders?userId=${userId}`); // Ajoutez cette ligne pour vérifier l'URL complète
  try {
    const response = await fetch(`${apiUrl}/orders?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        'Content-Type': 'application/json' // Ajout du Content-Type
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur lors de la récupération des commandes: ${errorText}`);
    }
    orders.value = await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
  }
};

const getImageUrl = (imagePath) => {
  // Retirer '/home/node' du chemin si présent
  const cleanPath = imagePath.replace('/home/node', '');
  return cleanPath.startsWith("http") ? cleanPath : `${apiUrl}${cleanPath}`;
};

const fullAddress = ref({});

const suggestions = ref([]);
const loading = ref(false);
let debounceTimeout = null;

const fetchSuggestions = async (query) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  loading.value = true;
  try {
    const response = await fetch(
      `${apiUrl}/geocode?address=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    suggestions.value = data.results;
    loading.value = false;
  } catch (error) {
    console.error("Error fetching geocoded data:", error);
    loading.value = false;
  }
};

const handleInput = () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    if (address.value.trim()) {
      fetchSuggestions(address.value);
      addressSelected.value = false;
    } else {
      addressSelected.value = true;
    }
  }, 300);
};

const selectSuggestion = (suggestion) => {
  address.value = suggestion.formatted;
  Object.assign(fullAddress.value, suggestion);
  suggestions.value = [];
  addressSelected.value = true;
};

const updateProfile = () => {
  let updatedUserData = {
    first_name: firstName.value,
    last_name: lastName.value,
    email: email.value,
    phone_number: phoneNumber.value,
  };

  if (address.value !== initialAddress.value) {
    const formattedAddress = {
      street:
        fullAddress.value.housenumber + " " + fullAddress.value.street || "",
      city: fullAddress.value.city || "",
      postal_code: fullAddress.value.postcode || "",
      country: fullAddress.value.country || "",
    };
    updatedUserData = { ...updatedUserData, address: formattedAddress };
  }

  console.log("Données utilisateur avant envoi :", updatedUserData);

  userStore.updateUser(userData.value.user_id, updatedUserData);
};

const sendResetEmail = async () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!email.value) {
    setFlashMessage("Veuillez entrer votre email.");
    return;
  }
  const response = await fetch(`${apiUrl}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.value }),
  });

  if (response.ok) {
    setFlashMessage(
      "Un email de réinitialisation a été envoyé."
    );
    setTimeout(() => (flashMessage.value = ""), 3000); // Cache le message après 3 secondes
  } else {
    const errorData = await response.json();
    setFlashMessage(
      errorData.message ||
        "Erreur lors de l'envoi de l'email de réinitialisation."
    );
    setTimeout(() => (flashMessage.value = ""), 3000); // Cache le message après 3 secondes
  }
};

const refundOrder = async (orderId) => {
  console.log(`Demander un remboursement pour la commande ID: ${orderId}`);
  // Ajouter ici la logique pour demander un remboursement
};

const reorder = async (productId) => {
  console.log(`Acheter à nouveau le produit ID: ${productId}`);
  // Ajouter ici la logique de rachat du produit
};

const viewOrder = async (orderId) => {
  console.log(`Consulter la commande ID: ${orderId}`);
  // Ajouter ici la logique pour consulter la commande
};
</script>

<style scoped lang="scss">
.profile-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-bottom: 50px;

  h2 {
    margin-bottom: 20px;
    font-size: 45px;
  }

  form {
    display: flex;
    flex-direction: column;
    min-width: 300px;
    width: 500px;
    border: 1px solid #ccc;
    padding: 25px;
    border-radius: 25px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    .form-group {
      margin-bottom: 15px;

      label {
        display: block;
        margin-bottom: 10px;
        font-weight: bold;
        font-size: 20px;
      }

      input,
      textarea {
        width: 100%;
        padding: 15px;
        font-size: 20px;
        border: 1px solid #ccc;
        border-radius: 25px;
        transition: all 0.3s ease;

        &::placeholder {
          color: #ccc;
        }

        &:focus {
          outline: none;
          border-color: #8b8b8b;
        }
      }

      span {
        color: red;
      }
    }

    .address-section {
      display: flex;
      flex-direction: column;

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

    button {
      margin-top: 30px;
      padding: 15px;
      border: none;
      border-radius: 25px;
      background-color: black;
      color: white;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: #333;
      }

      &:focus {
        outline: none;
        background-color: #9b9b9b;
      }

      &:disabled {
        background-color: grey;
        cursor: not-allowed;
      }
    }
    p {
      margin-top: 25px;
      margin-bottom: 0;
      font-size: 20px;
      color: #333;
      cursor: pointer;
      text-align: center;
      transition: all 0.3s ease;
      &:hover {
        color: red;
      }
    }
  }

  .order-container {
    margin: 20px 0;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    width: 80%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    .order-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;

      p {
        margin: 0;
        font-size: 16px;
      }
    }

    .order-items {
      display: flex;
      flex-direction: column;

      .order-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        .product-image {
          width: 60px;
          height: 60px;
          margin-right: 20px;
        }

        .product-details {
          p {
            margin: 0;
            font-size: 14px;
          }
        }
      }
    }

    .order-actions {
      display: flex;
      justify-content: space-around;
      margin-top: 10px;

      button {
        padding: 10px;
        border: none;
        border-radius: 5px;
        background-color: #007bff;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
          background-color: #0056b3;
        }

        &:focus {
          outline: none;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .profile-container {
    h2 {
      font-size: 30px;
    }
    form {
      width: 90%;
    }
    .order-container {
      width: 100%;
    }
  }
}
</style>
