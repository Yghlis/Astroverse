<template>
    <div class="change-password">
      <h2>Changez votre mot de passe</h2>
      <form @submit.prevent="changePassword">
        <input type="password" v-model="newPassword" placeholder="Nouveau mot de passe" required />
        <input type="password" v-model="confirmPassword" placeholder="Confirmer le mot de passe" required />
        <button type="submit">Changer le mot de passe</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const newPassword = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const changePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Les mots de passe ne correspondent pas';
    return;
  }

  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: route.params.userId,
        newPassword: newPassword.value
      })
    });

    if (response.ok) {
      const data = await response.json();
      successMessage.value = 'Mot de passe changé avec succès';

      if (!data.mustChangePassword) {
        // Update the token and navigate away from the change password page
        localStorage.setItem('jwt', data.token); // Store the new token
        setTimeout(() => {
          router.push('/');
        }, 2000); // Rediriger après 2 secondes
      }
    } else {
      const data = await response.json();
      errorMessage.value = data.message || 'Erreur lors du changement de mot de passe';
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la requête';
  }
};
</script>

<style scoped>
.change-password {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
}
input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
.error {
  color: red;
}
.success {
  color: green;
}
</style>
