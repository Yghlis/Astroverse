<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container" :style="{ width: width, height: height }">
        <div class="modal-header">
          <h3>
            Consultation
            {{
              currentDataType === "products"
                ? "du Produit"
                : currentDataType === "characters"
                ? "du Personnage"
                : currentDataType === "universes"
                ? "de l'Univers"
                : currentDataType === "orders"
                ? "de la Commande"
                : "de l'Utilisateur"
            }}
          </h3>
        </div>
        <div class="modal-body">
          <div v-if="item">
            <!-- Détails du produit -->
            <div v-if="currentDataType === 'products'">
              <p><strong>Nom du produit :</strong> {{ item.title }}</p>
              <p><strong>Marque :</strong> {{ item.brand }}</p>
              <p><strong>Prix :</strong> {{ item.price }}</p>
              <p>
                <strong>Prix en promotion :</strong> {{ item.discounted_price }}
              </p>
              <p><strong>Description :</strong> {{ item.description }}</p>
              <p><strong>Stock :</strong> {{ item.stock }}</p>
              <p><strong>Personnage :</strong> {{ item.character?.name }}</p>
              <p><strong>Univers :</strong> {{ item.universe?.name }}</p>
              <p><strong>Référence :</strong> {{ item.reference }}</p>
              <p>
                <strong>Dimensions :</strong> {{ parsedDetails.dimensions }}
              </p>
              <p><strong>Poids :</strong> {{ parsedDetails.weight }}</p>
              <p><strong>Matériaux :</strong> {{ parsedDetails.materials }}</p>
              <p><strong>Tags :</strong> {{ item.tags?.join(", ") }}</p>
              <div>
                <p><strong>Image Preview :</strong></p>
                <img
                  :src="getImageUrl(item.image_preview)"
                  alt="Image Preview"
                  style="max-width: 200px"
                  v-if="item.image_preview"
                />
              </div>
              <div>
                <p><strong>Gallery Images :</strong></p>
                <div
                  v-for="(image, index) in item.image_gallery"
                  :key="index"
                  style="display: inline-block; margin-right: 10px"
                >
                  <img
                    :src="getImageUrl(image)"
                    :alt="'Gallery Image ' + (index + 1)"
                    style="max-width: 100px"
                  />
                </div>
              </div>
            </div>
            <!-- Détails du personnage -->
            <div v-if="currentDataType === 'characters'">
              <p><strong>Nom du personnage :</strong> {{ item.name }}</p>
              <p><strong>Univers :</strong> {{ universeName }}</p>
            </div>
            <!-- Détails de l'univers -->
            <div v-if="currentDataType === 'universes'">
              <p><strong>Nom de l'univers :</strong> {{ item.name }}</p>
              <p><strong>Couleur 1 :</strong> {{ item.color1 }}</p>
              <p><strong>Couleur 2 :</strong> {{ item.color2 }}</p>
              <p><strong>Couleur du Texte :</strong> {{ item.colorText }}</p>
            </div>
            <!-- Détails de la commande -->
            <div v-if="currentDataType === 'orders'">
              <p><strong>Numéro de commande :</strong> {{ item.id }}</p>
              <div v-for="product in item.products" :key="product.productId" class="product-details">
                <img
                  :src="getImageUrl(product.image_preview)"
                  alt="Image Preview"
                  class="product-image"
                  v-if="product.image_preview"
                />
                <div class="product-info">
                  <p><strong>Nom du produit :</strong> {{ product.title }}</p>
                  <p><strong>Quantité :</strong> {{ product.quantity }}</p>
                  <p><strong>Prix :</strong> {{ product.price }}</p>
                </div>
              </div>
              <p><strong>Prix total :</strong> {{ item.totalPrice }}</p>
            </div>
            <!-- Détails de l'utilisateur -->
            <div v-if="currentDataType === 'users'">
              <p><strong>Prénom :</strong> {{ item.first_name }}</p>
              <p><strong>Nom :</strong> {{ item.last_name }}</p>
              <p><strong>Email :</strong> {{ item.email }}</p>
              <p>
                <strong>Numéro de téléphone :</strong>
                {{ item.phone_number || "non renseigné" }}
              </p>
              <p>
                <strong>Rue :</strong>
                {{ item.address?.street || "non renseigné" }}
              </p>
              <p>
                <strong>Ville :</strong>
                {{ item.address?.city || "non renseigné" }}
              </p>
              <p>
                <strong>Code Postal :</strong>
                {{ item.address?.postal_code || "non renseigné" }}
              </p>
              <p>
                <strong>Pays :</strong>
                {{ item.address?.country || "non renseigné" }}
              </p>
              <p>
                <strong>Rôles :</strong>
                {{ item.roles?.join(", ") || "non renseigné" }}
              </p>
              <p>
                <strong>Mot de passe à changer :</strong>
                {{ item.mustChangePassword ? "Oui" : "Non" }}
              </p>
              <p>
                <strong>Email vérifié :</strong>
                {{ item.isEmailVerified ? "Oui" : "Non" }}
              </p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-default-button" @click="$emit('close')">
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useCharacterFormStore } from "../stores/characterFormStore";

const props = defineProps({
  currentDataType: String,
  selectedRow: Object,
  width: {
    type: String,
    default: "50%",
  },
  height: {
    type: String,
    default: "auto",
  },
});

const item = ref(null);
const characterFormStore = useCharacterFormStore();
const universeName = ref("");
const apiUrl = import.meta.env.VITE_API_URL;

const getImageUrl = (filename) => {
  return `${apiUrl}/uploads/${filename.split("/").pop()}`;
};

onMounted(async () => {
  let url = "";
  if (props.currentDataType === "products") {
    url = `${apiUrl}/products/${props.selectedRow.id}`;
  } else if (props.currentDataType === "characters") {
    url = `${apiUrl}/characters/${props.selectedRow.id}`;
  } else if (props.currentDataType === "universes") {
    url = `${apiUrl}/universes/${props.selectedRow.id}`;
  } else if (props.currentDataType === "users") {
    url = `${apiUrl}/users/${props.selectedRow.user_id}`;
  } else if (props.currentDataType === "orders") {
    url = `${apiUrl}/orders/${props.selectedRow.id}`;
  }
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données");
    }
    item.value = await response.json();
    console.log("Item details:", item.value);

    if (props.currentDataType === "characters" && item.value.universe) {
      await characterFormStore.fetchUniverseNameById(item.value.universe);
      universeName.value = characterFormStore.universeName;
    }
  } catch (error) {
    console.error("Erreur:", error.message);
  }
});

const parsedDetails = computed(() => {
  try {
    return item.value && item.value.details
      ? JSON.parse(item.value.details)
      : {};
  } catch (e) {
    console.error("Invalid JSON:", e);
    return {};
  }
});
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 20px;
}

.modal-container {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  max-width: 70%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 1;
  transform: translateY(0);
  animation: modalFadeIn 0.3s ease-out;
}

.modal-header {
  padding: 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1.25rem;
  }
}

.modal-body {
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;

  label {
    display: block;
    font-weight: bold;
    margin-top: 15px;
    color: #495057;
  }

  .promotion {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 15px;

    label {
      margin-top: 0;
    }

    input[type="checkbox"] {
      margin-top: 0;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      display: inline-block;
      width: 25px;
      height: 25px;
      background-color: white;
      border: 2px solid #ccc;
      border-radius: 7px;
      position: relative;
      cursor: pointer;
      transition: all 0.2s;

      &:checked {
        background-color: #2196f3;
        border-color: #2196f3;

        &::after {
          content: "";
          position: absolute;
          left: 6px;
          top: 2px;
          width: 6px;
          height: 12px;
          border: solid white;
          border-width: 0 3px 3px 0;
          transform: rotate(45deg);
          display: block;
        }
      }

      &::after {
        content: "";
        position: absolute;
        left: 6px;
        top: 2px;
        width: 6px;
        height: 12px;
        border: solid transparent;
        border-width: 0 3px 3px 0;
        transform: rotate(45deg);
        transition: all 0.2s;
      }

      &:focus {
        outline: none;
        box-shadow: none;
      }
    }
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #80bdff;
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    &:disabled {
      background-color: #c4c4c4;
      cursor: not-allowed;
    }
  }

  .flash-message {
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 20px;
    font-size: 0.9rem;

    &.success {
      background-color: #d4edda;
      color: #155724;
    }

    &.error {
      background-color: #f8d7da;
      color: #721c24;
    }
  }

  img {
    display: block;
    margin: 10px 0;
    max-width: 100%;
    border: 1px solid #dee2e6;
    border-radius: 4px;
  }

  button[type="submit"] {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0056b3;
    }

    &:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
  }
}

.product-details {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  img.product-image {
    max-width: 150px;
    max-height: 150px;
    width: auto;
    height: auto;
    margin-right: 20px;
  }

  .product-info {
    display: flex;
    flex-direction: column;
  }

  p {
    margin: 0 10px;
  }
}

.modal-footer {
  padding: 10px 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;

  .modal-default-button {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #5a6268;
    }
  }
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
