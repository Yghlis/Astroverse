<template>
    <div>
      <h2>Changer le mot de passe</h2>
      <form @submit.prevent="changePassword">
        <div>
          <label for="newPassword">Nouveau mot de passe:</label>
          <input type="password" id="newPassword" v-model="newPassword" required />
        </div>
        <button type="submit">Changer le mot de passe</button>
      </form>
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const newPassword = ref('');
  const message = ref('');
  const route = useRoute();
  const router = useRouter();
  
  const changePassword = async () => {
    const { userId, token } = route.params;
    const response = await fetch('http://localhost:8000/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newPassword: newPassword.value, token })
    });
  
    if (response.ok) {
      message.value = 'Mot de passe changé avec succès!';
      setTimeout(() => router.push('/'), 3000); // Rediriger après 3 secondes
    } else {
      const errorData = await response.json();
      message.value = errorData.message || 'Erreur lors du changement de mot de passe';
    }
  };
  </script>
  