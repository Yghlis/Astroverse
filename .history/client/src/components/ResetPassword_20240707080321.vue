<template>
  <div class="reset-password-form" v-if="state.tokenValid">
    <h1>Réinitialiser votre mot de passe</h1>
    <div v-if="state.flashMessage" :class="`flash-message ${state.flashMessage.type}`">{{ state.flashMessage.message }}</div>
    <form @submit.prevent="submitNewPassword">
      <input type="password" v-model="state.newPassword" @input="evaluatePassword" placeholder="Nouveau mot de passe" required>
      <div :style="{ color: state.passwordStrength.color }">{{ state.passwordStrength.message }}</div>
      <input type="password" v-model="state.confirmPassword" placeholder="Confirmez le nouveau mot de passe" required>
      <button type="submit" :disabled="!state.canSubmit">Réinitialiser le mot de passe</button>
    </form>
  </div>
  <div v-else>
    <p>{{ state.errorMessage }}</p>
  </div>
</template>
import { reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const state = reactive({
  newPassword: '',
  confirmPassword: '',
  token: route.params.token,
  tokenValid: false,
  errorMessage: 'Le token est invalide ou a expiré.',
  passwordStrength: {
    message: '',
    color: ''
  },
  canSubmit: false,
  flashMessage: null // Ajout pour gérer les messages flash
});

const verifyToken = async () => {
  try {
    const response = await fetch(`http://localhost:8000/auth/reset-password/${state.token}`);
    if (!response.ok) {
      throw new Error('Erreur de validation du token.');
    }
    const data = await response.json();
    if (data.message === "Token est valide.") {
      state.tokenValid = true;
    } else {
      state.tokenValid = false;
      state.errorMessage = data.error || 'Le token est invalide ou a expiré.';
    }
  } catch (error) {
    console.error('Error:', error);
    state.tokenValid = false;
    state.errorMessage = 'Erreur de serveur.';
  }
};

const evaluatePassword = () => {
  const hasLowercase = /[a-z]/.test(state.newPassword);
  const hasUppercase = /[A-Z]/.test(state.newPassword);
  const hasNumber = /[0-9]/.test(state.newPassword);
  const hasSpecialChar = /[\W_]/.test(state.newPassword);
  const isLongEnough = state.newPassword.length >= 12;

  if (isLongEnough && hasLowercase && hasUppercase && hasNumber && hasSpecialChar) {
    state.passwordStrength.message = 'Mot de passe solide';
    state.passwordStrength.color = 'green';
    state.canSubmit = true;  // Permet la soumission si le mot de passe est solide
  } else {
    state.passwordStrength.message = 'Mot de passe trop faible. Il doit contenir au moins 12 caractères, avec au moins un symbole, un chiffre, une lettre minuscule et une lettre majuscule.';
    state.passwordStrength.color = 'red';
    state.canSubmit = false;  // Empêche la soumission si le mot de passe est faible
  }
};

const submitNewPassword = async () => {
  if (state.newPassword !== state.confirmPassword) {
    state.flashMessage = { type: 'error', message: "Les mots de passe ne correspondent pas." };
    return;
  }
  try {
    const response = await fetch(`http://localhost:8000/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: state.token,
        newPassword: state.newPassword
      })
    });
    const data = await response.json();
    state.flashMessage = { type: response.ok ? 'success' : 'error', message: data.message };
    if (response.ok) {
      router.push('/login');
    }
  } catch (error) {
    console.error('Error:', error);
    state.flashMessage = { type: 'error', message: 'Une erreur est survenue lors de la réinitialisation du mot de passe.' };
  }
};

onMounted(() => {
  verifyToken();
});
