<template>
  <footer class="footer" v-if="!isAdminRoute">
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
    <div class="footer-content">
      <div v-if="isLoggedIn" class="newsletter">
        <h2 class="newsletter-title">Abonnez-vous à notre Newsletter</h2>
        <p class="newsletter-description">
          Restez à jour avec les dernières nouvelles et offres exclusives.
        </p>
        <button @click="toggleSubscription" class="newsletter-button">
          {{ isSubscribedToNewsletter ? "Se désabonner" : "M'abonner" }}
        </button>
      </div>
      <p>&copy; 2024 Astroverse. Tous droits réservés.</p>
      <ul class="footer-links">
        <li><router-link to="/legal/legal">Mentions légales</router-link></li>
        <li>
          <router-link to="/legal/cgu"
            >Conditions générales d'utilisation</router-link
          >
        </li>
        <li>
          <router-link to="/legal/privacy-policy"
            >Politique de confidentialité</router-link
          >
        </li>
        <li>
          <router-link to="/legal/refund-policy"
            >Politique de remboursement</router-link
          >
        </li>
        <li>
          <router-link to="/legal/warranty-conditions"
            >Conditions de garantie</router-link
          >
        </li>
        <li>
          <router-link to="/legal/cookie-policy"
            >Politique de cookie</router-link
          >
        </li>
        <li>
          <router-link to="/legal/shipping-policy"
            >Politique de livraison</router-link
          >
        </li>
        <li>
          <router-link to="/legal/accessibility"
            >Accessibilité du site</router-link
          >
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import useFlashMessageStore from "@composables/useFlashMessageStore";
import { useRoute } from "vue-router";
import { useUserStore } from "../stores/userStore";

const route = useRoute();
const isAdminRoute = computed(() => route.path === "/admin");

const { flashMessage, flashMessageType, setFlashMessage } =
  useFlashMessageStore();
const isSubscribedToNewsletter = ref(false);
const isLoggedIn = ref(false);
const token = ref("");
const userId = ref("");
const apiUrl = import.meta.env.VITE_API_URL;
const userStore = useUserStore();

onMounted(async () => {
  token.value = localStorage.getItem("jwt");
  userId.value = localStorage.getItem("userId");
  isLoggedIn.value = !!token.value;

  if (isLoggedIn.value) {
    await userStore.getUserById(userId.value);
    isSubscribedToNewsletter.value =
      userStore.userData.isSubscribedToNewsletter || false;
  }
});
const toggleSubscription = async () => {
  try {
    const response = await fetch(`${apiUrl}/users/${userId.value}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        toggleNewsletterSubscription: !isSubscribedToNewsletter.value,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      isSubscribedToNewsletter.value = data.isSubscribedToNewsletter;
      setFlashMessage(data.message, "success");
    } else {
      setFlashMessage("Erreur lors de l'abonnement.", "error");
    }
  } catch (error) {
    console.error("Erreur lors de l'abonnement:", error);
    setFlashMessage("Erreur lors de l'abonnement.", "error");
  }
};
</script>

<style lang="scss" scoped>
.flash-message {
  position: fixed;
  top: 100px;
  padding: 10px;
  margin: 20px 0;
  border-radius: 4px;
  text-align: center;
}

.flash-message.success {
  background-color: #dff0d8;
  color: #3c763d;
}

.flash-message.error {
  background-color: #f2dede;
  color: #a94442;
}

.footer {
  width: 100%;
  background-color: black;
  color: #fff;
  padding: 20px 0;
  text-align: center;
  margin-top: auto;
  &-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    .newsletter {
      max-width: 500px;
      margin: 0px auto 20px auto;
      text-align: center;

      &-title {
        font-size: 24px;
        margin-bottom: 10px;
        color: white;
      }

      &-description {
        font-size: 16px;
        margin-bottom: 20px;
        color: white;
      }

      &-button {
        padding: 10px 20px;
        font-size: 20px;
        border: none;
        border-radius: 4px;
        color: black;
        background-color: white;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
          background-color: #ccc;
        }
      }
    }
  }

  &-links {
    list-style: none;
    padding: 0;
    margin: 10px 0 0;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    li {
      margin: 0 15px;

      a {
        color: #fff;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
