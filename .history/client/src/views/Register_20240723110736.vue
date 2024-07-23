<template>
  <div class="register-container">
    <p
      v-if="flashMessage"
      class="flash-message"
      :class="{
        active: flashMessage,
        success: flashMessageType === 'success',
        error: flashMessageType === 'error',
      }"
    >
      {{ flashMessage }}
    </p>
    <h2>Créez votre compte</h2>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="first_name">Prénom<span>*</span>:</label>
        <input
          type="text"
          id="first_name"
          v-model="first_name"
          placeholder="Entrez votre prénom"
          required
        />
      </div>
      <div class="form-group">
        <label for="last_name">Nom<span>*</span>:</label>
        <input
          type="text"
          id="last_name"
          v-model="last_name"
          placeholder="Entrez votre nom"
          required
        />
      </div>
      <div class="form-group">
        <label for="email">Email<span>*</span>:</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="Entrez votre email"
          autocomplete="username"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Mot de passe<span>*</span>:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Créez un mot de passe"
          autocomplete="new-password"
          @input="evaluatePassword"
          required
        />
        <div :style="{ color: passwordStrength.color }">
          {{ passwordStrength.message }}
        </div>
      </div>
      <div class="form-group">
        <label for="confirmPassword"
          >Confirmez le mot de passe<span>*</span>:</label
        >
        <input
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          placeholder="Confirmez votre mot de passe"
          autocomplete="new-password"
          required
        />
      </div>
      <div class="form-group checkbox-group">
        <input
          type="checkbox"
          id="acceptCGU"
          v-model="acceptCGU"
          required
        />
        <label for="acceptCGU">
  Je confirme avoir lu&nbsp;
  <a href="#" @click.prevent="openCGUModal"> les CGU</a><span>*</span>
</label>
      </div>
      <button type="submit" :disabled="!acceptCGU">Inscription</button>
    </form>
    <p>
      Avez-vous déjà un compte ?
      <button class="login" @click="goToLogin">Connectez-vous</button>
    </p>

    <div v-if="showCGUModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeCGUModal">&times;</span>
        <h2>Conditions Générales d'Utilisation (CGU)</h2>
        <p>
          <!-- Ajoutez ici le contenu des CGU -->
          Bienvenue sur Astroverse, le site de vente en ligne de figurines. En utilisant notre site, vous acceptez les présentes conditions générales d'utilisation. Veuillez les lire attentivement.
          <!-- Continuez avec le contenu complet des CGU -->
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSidebarStore } from "../stores/sidebarStore";
import useFlashMessageStore from "@composables/useFlashMessageStore";

const { flashMessage, flashMessageType, setFlashMessage } =
  useFlashMessageStore();

const sidebarStore = useSidebarStore();

const first_name = ref("");
const last_name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const passwordStrength = ref({
  message: "",
  color: "",
});
const acceptCGU = ref(false);
const showCGUModal = ref(false);
const router = useRouter();

const evaluatePassword = () => {
  const hasLowercase = /[a-z]/.test(password.value);
  const hasUppercase = /[A-Z]/.test(password.value);
  const hasNumber = /[0-9]/.test(password.value);
  const hasSpecialChar = /[\W_]/.test(password.value);
  const isLongEnough = password.value.length >= 12;

  if (
    isLongEnough &&
    hasLowercase &&
    hasUppercase &&
    hasNumber &&
    hasSpecialChar
  ) {
    passwordStrength.value.message = "Mot de passe solide";
    passwordStrength.value.color = "green";
  } else {
    passwordStrength.value.message =
      "Mot de passe trop faible. Il doit contenir au moins 12 caractères, avec au moins un symbole, un chiffre, une lettre minuscule et une lettre majuscule.";
    passwordStrength.value.color = "red";
  }
};

const register = async () => {
  const hasLowercase = /[a-z]/.test(password.value);
  const hasUppercase = /[A-Z]/.test(password.value);
  const hasNumber = /[0-9]/.test(password.value);
  const hasSpecialChar = /[\W_]/.test(password.value);
  const isLongEnough = password.value.length >= 12;

  if (
    !(
      isLongEnough &&
      hasLowercase &&
      hasUppercase &&
      hasNumber &&
      hasSpecialChar
    )
  ) {
    setFlashMessage(
      "Le mot de passe est trop faible. Il doit contenir au moins 12 caractères, avec au moins un symbole, un chiffre, une lettre minuscule et une lettre majuscule.",
      "error"
    );
    return;
  }

  if (password.value !== confirmPassword.value) {
    setFlashMessage("Les mots de passe ne correspondent pas", "error");
    return;
  }

  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: first_name.value,
        last_name: last_name.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      }),
    });
    const data = await response.json();
    console.log("Register response:", data);
    if (response.ok) {
      setFlashMessage("Inscription réussie !", "success");
      setTimeout(() => {
        router.push("/");
      }, 5000);
    } else {
      setFlashMessage(data.message || "Échec de l'enregistrement", "error");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    setFlashMessage("Une erreur s'est produite lors de l'inscription", "error");
  }
};

const goToLogin = () => {
  sidebarStore.toggleUserSidebar();
};

const openCGUModal = () => {
  showCGUModal.value = true;
};

const closeCGUModal = () => {
  showCGUModal.value = false;
};
</script>

<style lang="scss" scoped>
.register-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  h2 {
    margin-bottom: 20px;
    font-size: 54px;
  }
  form {
    display: flex;
    flex-direction: column;
    min-width: 300px;
    width: 500px;
    border: 1px solid #ccc;
    padding: 25px;
    border-radius: 25px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    .form-group {
      margin-bottom: 15px;
      div {
        margin-top: 5px;
      }
      label {
        display: block;
        margin-bottom: 10px;
        font-weight: bold;
        font-size: 20px;
      }
      input {
        width: 100%;
        padding: 15px;
        font-size: 20px;
        border: 1px solid #ccc;
        border-radius: 25px;
        transition: all 0.3s ease;
        &::placeholder {
          color: #ccc;
        }
        &:focus {
          outline: none;
          border-color: #8b8b8b;
        }
      }
      span {
        color: red;
      }
    }
    .checkbox-group {
      display: flex;
      align-items: center;
      input[type="checkbox"] {
        margin-right: 10px;
        width: auto;
      }
      label {
        display: flex;
        align-items: center;
      }
      a {
        color: #f2a45a;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    button {
      margin-top: 30px;
      padding: 15px;
      border: none;
      border-radius: 25px;
      background-color: black;
      color: white;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        background-color: #333;
      }
      &:focus {
        outline: none;
        background-color: #9b9b9b;
      }
      &:disabled {
        background-color: #ddd;
        cursor: not-allowed;
      }
    }
  }
  p {
    margin-top: 20px;
    font-size: 16px;
    .login {
      background-color: white;
      color: #f2a45a;
      margin-top: 0;
      margin-left: 3px;
      font-size: 16px;
      padding: 0;
      border: none;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);

  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 80%;
    max-width: 600px;
    position: relative;

    .close {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 30px;
      cursor: pointer;
    }

    h2 {
      margin-top: 0;
    }
  }
}
</style>
