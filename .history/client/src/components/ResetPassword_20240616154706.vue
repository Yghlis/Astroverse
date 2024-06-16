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
  
 