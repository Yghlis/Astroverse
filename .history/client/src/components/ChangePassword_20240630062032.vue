<template>
    <div>
      <h2>Changez votre mot de passe</h2>
      <form @submit.prevent="changePassword">
        <div>
          <label for="newPassword">Nouveau mot de passe:</label>
          <input id="newPassword" v-model="newPassword" type="password" required>
        </div>
        <div>
          <label for="confirmPassword">Confirmez le mot de passe:</label>
          <input id="confirmPassword" v-model="confirmPassword" type="password" required>
        </div>
        <button type="submit">Changer le mot de passe</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import useFlashMessageStore from '@stores/useFlashMessageStore';
  
  const route = useRoute();
  const router = useRouter();
  const newPassword = ref('');
  const confirmPassword = ref('');
  const { setFlashMessage } = useFlashMessageStore();
  
  const changePassword = async () => {
    if (newPassword.value !== confirmPassword.value) {
      setFlashMessage("Les mots de passe ne correspondent pas.", 'error');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8000/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: route.params.userId,
          newPassword: newPassword.value
        })
      });
  
      const data = await response.json();
      if (response.ok) {
        setFlashMessage("Mot de passe changé avec succès. Veuillez vous reconnecter.", 'success');
        router.push({ name: 'Login' });
      } else {
        setFlashMessage(`Erreur: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
    }
  };
  </script>
  