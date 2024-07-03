<template>
  <div class="checkout">
    <h2>Finalisation de la commande</h2>
    <form @submit.prevent="handleSubmit">
      <div class="address-section">
        <label for="address">Adresse de livraison</label>
        <input
          v-model="address"
          type="text"
          id="address"
          placeholder="Entrez votre adresse de livraison"
          required
        />
      </div>
      <div class="save-address">
        <input
          v-model="saveAddress"
          type="checkbox"
          id="saveAddress"
        />
        <label for="saveAddress">Sauvegarder l'adresse pour de futurs achats</label>
      </div>
      <button type="submit">Confirmer</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const address = ref('');
const saveAddress = ref(false);

const handleSubmit = () => {
  console.log('Adresse de livraison:', address.value);
  console.log("Sauvegarder l'adresse:", saveAddress.value);
  // Ajoutez ici la logique pour traiter l'adresse de livraison et la sauvegarde de l'adresse
};
</script>

<style scoped lang="scss">
.checkout {
  padding: 20px;
  max-width: 400px;
  margin: 100px auto 0 auto;
  background-color: #f9f9f9;
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
      }

      input[type="text"] {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
    }

    .save-address {
      display: flex;
      align-items: center;
      gap: 10px;

      input[type="checkbox"] {
        width: 20px;
        height: 20px;
      }
    }

    button {
      padding: 10px;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;

      &:hover {
        background-color: #0056b3;
      }
    }
  }
}
</style>
