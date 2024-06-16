<template>
    <div class="reset-password-form" v-if="state.tokenValid">
      <h1>Réinitialiser votre mot de passe</h1>
      <form @submit.prevent="submitNewPassword">
        <input type="password" v-model="state.newPassword" placeholder="Nouveau mot de passe" required>
        <input type="password" v-model="state.confirmPassword" placeholder="Confirmez le nouveau mot de passe" required>
        <button type="submit">Réinitialiser le mot de passe</button>
      </form>
    </div>
    <div v-else>
      <p>{{ state.errorMessage }}</p>
    </div>
  </template>
  
  <script setup>
  import { reactive, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  
  const state = reactive({
    newPassword: '',
    confirmPassword: '',
    token: route.params.token,
    tokenValid: false,
    errorMessage: 'Le token est invalide ou a expiré.'
  });
  
  const verifyToken = async () => {
    try {
      const response = await fetch(`/auth/reset-password/${state.token}`);
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
  
  const submitNewPassword = async () => {
    if (state.newPassword !== state.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
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
      alert(data.message);
      if (response.ok) {
        router.push('/login');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  onMounted(() => {
    verifyToken();
  });
  </script>
  