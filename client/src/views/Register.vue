<template>
  <div class="register-container">
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
          required
        />
      </div>
      <button type="submit">Inscription</button>
    </form>
    <p>
      Avez vous déjà un compte ?
      <button class="login" @click="goToLogin">Connectez-vous</button>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSidebarStore } from "../stores/sidebarStore";
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
    alert(
      "Le mot de passe est trop faible. Il doit contenir au moins 12 caractères, avec au moins un symbole, un chiffre, une lettre minuscule et une lettre majuscule."
    );
    return;
  }

  if (password.value !== confirmPassword.value) {
    alert("Les mots de passe ne correspondent pas");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/auth/signup", {
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
      router.push("/");
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    alert("An error occurred during registration");
  }
};

const goToLogin = () => {
  sidebarStore.toggleUserSidebar();
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
</style>
