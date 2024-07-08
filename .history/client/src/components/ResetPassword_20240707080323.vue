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
