<template>
  <div class="reset-password-form" v-if="state.tokenValid">
    <h1>Réinitialiser votre mot de passe</h1>
    <form @submit.prevent="submitNewPassword">
      <input type="password" v-model="state.newPassword" @input="evaluatePassword" placeholder="Nouveau mot de passe" required>
      <div :style="{ color: state.passwordStrength.color }">{{ state.passwordStrength.message }}</div>
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
  errorMessage: 'Le token est invalide ou a expiré.',
  passwordStrength: {
    message: '',
    color: ''
  },
  canSubmit: false 
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

  const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.match(/[a-z]/)) strength++; // Un point pour les minuscules
  if (password.match(/[A-Z]/)) strength++; // Un point pour les majuscules
  if (password.match(/[0-9]/)) strength++; // Un point pour les chiffres
  if (password.match(/[\W]/)) strength++; // Un point pour les caractères spéciaux
  return strength;
};

const evaluatePassword = () => {
  const strength = getPasswordStrength(state.newPassword);
  if (strength < 4 || state.newPassword.length < 12) {
    state.passwordStrength.message = 'Faible';
    state.passwordStrength.color = 'red';
  } else if (strength === 4 || state.newPassword.length >= 12) {
    state.passwordStrength.message = 'Moyenne';
    state.passwordStrength.color = 'orange';
  } else if (strength > 4 && state.newPassword.length >= 16) {
    state.passwordStrength.message = 'Bonne';
    state.passwordStrength.color = 'green';
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
  