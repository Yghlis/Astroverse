<template>
  <div class="reset-password-form" v-if="state.tokenValid">
    <h1>Réinitialiser votre mot de passe</h1>
    <div v-if="flashMessageActive" :class="`flash-message ${flashMessageType}`">
      {{ flashMessage }}
    </div>
    <form @submit.prevent="submitNewPassword">
      <input
        type="password"
        v-model="state.newPassword"
        @input="evaluatePassword"
        placeholder="Nouveau mot de passe"
        required
      />
      <div :style="{ color: state.passwordStrength.color }">
        {{ state.passwordStrength.message }}
      </div>
      <input
        type="password"
        v-model="state.confirmPassword"
        placeholder="Confirmez le nouveau mot de passe"
        required
      />
      <button type="submit" :disabled="!state.canSubmit">
        Réinitialiser le mot de passe
      </button>
    </form>
  </div>
  <div v-else>
    <p>{{ state.errorMessage }}</p>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import useFlashMessageStore from "@composables/useFlashMessageStore";

const route = useRoute();
const router = useRouter();

const state = reactive({
  newPassword: "",
  confirmPassword: "",
  token: route.params.token,
  tokenValid: false,
  errorMessage: "Le token est invalide ou a expiré.",
  passwordStrength: {
    message: "",
    color: "",
  },
  canSubmit: false,
});

const { flashMessage, flashMessageType, flashMessageActive, setFlashMessage } =
  useFlashMessageStore();

const verifyToken = async () => {
  try {
    const response = await fetch(
      `http://localhost:8000/auth/reset-password/${state.token}`
    );
    if (!response.ok) {
      throw new Error("Erreur de validation du token.");
    }
    const data = await response.json();
    if (data.message === "Token est valide.") {
      state.tokenValid = true;
    } else {
      state.tokenValid = false;
      state.errorMessage = data.error || "Le token est invalide ou a expiré.";
    }
  } catch (error) {
    console.error("Error:", error);
    state.tokenValid = false;
    state.errorMessage = "Erreur de serveur.";
  }
};

const evaluatePassword = () => {
  const hasLowercase = /[a-z]/.test(state.newPassword);
  const hasUppercase = /[A-Z]/.test(state.newPassword);
  const hasNumber = /[0-9]/.test(state.newPassword);
  const hasSpecialChar = /[\W_]/.test(state.newPassword);
  const isLongEnough = state.newPassword.length >= 12;

  if (
    isLongEnough &&
    hasLowercase &&
    hasUppercase &&
    hasNumber &&
    hasSpecialChar
  ) {
    state.passwordStrength.message = "Mot de passe solide";
    state.passwordStrength.color = "green";
    state.canSubmit = true; // Permet la soumission si le mot de passe est solide
  } else {
    state.passwordStrength.message =
      "Mot de passe trop faible. Il doit contenir au moins 12 caractères, avec au moins un symbole, un chiffre, une lettre minuscule et une lettre majuscule.";
    state.passwordStrength.color = "red";
    state.canSubmit = false; // Empêche la soumission si le mot de passe est faible
  }
};

const submitNewPassword = async () => {
  if (state.newPassword !== state.confirmPassword) {
    setFlashMessage("Les mots de passe ne correspondent pas.", "error");
    return;
  }
  try {
    const response = await fetch(`http://localhost:8000/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: state.token,
        newPassword: state.newPassword,
      }),
    });
    const data = await response.json();
    setFlashMessage(data.message, response.ok ? "success" : "error");
    if (response.ok) {
      router.push("/");
    }
  } catch (error) {
    console.error("Error:", error);
    setFlashMessage(
      "Une erreur est survenue lors de la réinitialisation du mot de passe.",
      "error"
    );
  }
};

onMounted(() => {
  verifyToken();
});
</script>

<style lang="scss" scoped>
.reset-password-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-top: 100px;

  h1 {
    margin-bottom: 20px;
    font-size: 54px;
  }

  .flash-message {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    &.success {
      background-color: #d4edda;
      color: #155724;
    }
    &.error {
      background-color: #f8d7da;
      color: #721c24;
    }
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

    div {
      margin-top: 5px;
      color: red;
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
        background-color: #ccc;
        cursor: not-allowed;
      }
    }
  }

  .error-message {
    color: red;
    text-align: center;
  }
}
</style>
