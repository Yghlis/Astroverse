<template>
  <div class="profile-container">
    <h2>Mes Informations</h2>
    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="firstName">Prénom<span>*</span>:</label>
        <input v-model="firstName" id="firstName" type="text" required />
      </div>

      <div class="form-group">
        <label for="lastName">Nom<span>*</span>:</label>
        <input v-model="lastName" id="lastName" type="text" required />
      </div>

      <div class="form-group">
        <label for="email">Email<span>*</span>:</label>
        <input v-model="email" id="email" type="email" required />
      </div>

      <div class="form-group" v-if="phoneNumber">
        <label for="phoneNumber">Numéro de Téléphone:</label>
        <input v-model="phoneNumber" id="phoneNumber" type="text" />
      </div>

      <div class="form-group address-section">
        <label for="address">Adresse</label>
        <input
          v-model="address"
          @input="handleInput"
          type="text"
          id="address"
          placeholder="Entrez votre adresse"
          required
        />
        <ul v-if="suggestions.length">
          <TheLoader v-if="loading" :loading="loading"></TheLoader>
          <li
            v-else
            v-for="suggestion in suggestions"
            :key="suggestion.place_id"
            @click="selectSuggestion(suggestion)"
          >
            {{ suggestion.formatted }}
          </li>
        </ul>
      </div>
      <button type="submit" :disabled="!addressSelected">
        Mettre à jour le profil
      </button>
      <p @click="sendResetEmail">Modifier le mot de passe</p>
      <!-- Nouveau bouton de suppression de compte -->
      <button type="button" @click="deleteAccount" class="delete-account">
        Supprimer mon compte
      </button>
    </form>
    <!-- Le reste du code reste inchangé -->
  </div>
</template>
