<template>
  <div class="profile-container">
    <h2>Profil Utilisateur</h2>
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
        <input v-model="email" id="email" type="email" disabled />
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
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import TheLoader from "../ui/TheLoader.vue";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();

onMounted(() => {
  const id = localStorage.getItem("userId");
  userStore.getUserById(id);
});

const userData = computed(() => userStore.userData);

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

  // Mettez à jour le profil utilisateur en appelant une méthode du store ici
  userStore.updateUser(userData.value.user_id, updatedUserData);
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
    font-size: 54px;
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
  }
}
</style>
