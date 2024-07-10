<template>
  <footer class="footer">
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
        <li><a href="#privacy">Politique de confidentialité</a></li>
        <li><a href="#terms">Conditions d'utilisation</a></li>
        <li><a href="#contact">Contactez-nous</a></li>
      </ul>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from "vue";
import useFlashMessageStore from "@composables/useFlashMessageStore";

const { flashMessage, flashMessageType, setFlashMessage } = useFlashMessageStore();
const isSubscribedToNewsletter = ref(false);
const isLoggedIn = ref(false);
const token = ref("");
const userId = ref("");

// Vérifier si l'utilisateur est connecté lors du chargement du composant
onMounted(() => {
  console.log('onMounted in TheFooter.vue called');
  token.value = localStorage.getItem("jwt"); // Assurez-vous que la clé est correcte
  userId.value = localStorage.getItem("userId");
  isLoggedIn.value = !!token.value;

  console.log('userId in TheFooter.vue:', userId.value);
  console.log('token in TheFooter.vue:', token.value);
  console.log('isLoggedIn in TheFooter.vue:', isLoggedIn.value);

  // Récupérer l'état d'abonnement de l'utilisateur
  if (isLoggedIn.value) {
    fetch(`/api/users/${userId.value}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.value}` // Utilisez le token JWT pour l'authentification
      },
    })
      .then(response => response.json())
      .then(data => {
        isSubscribedToNewsletter.value = data.isSubscribedToNewsletter;
      })
      .catch(error => {
        console.error("Erreur lors de la récupération de l'état d'abonnement:", error);
      });
  }
});
const toggleSubscription = async () => {
  console.log('toggleSubscription called');
  console.log('userId:', userId.value);
  console.log('token:', token.value);

  try {
    const response = await fetch(`http://localhost:8000/users/${userId.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}` // Utilisez le token JWT pour l'authentification
      },
      body: JSON.stringify({
        toggleNewsletterSubscription: !isSubscribedToNewsletter.value // Inversez l'état actuel
      })
    });

    console.log('response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('response data:', data);
      isSubscribedToNewsletter.value = data.isSubscribedToNewsletter;
      setFlashMessage(data.message, 'success');
    } else {
      setFlashMessage("Erreur lors de l'abonnement.", 'error');
    }
  } catch (error) {
    console.error("Erreur lors de l'abonnement:", error);
    setFlashMessage("Erreur lors de l'abonnement.", 'error');
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
  background-color: #333;
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
        border: none;
        border-radius: 4px;
        background-color: #f2a45a;
        color: #fff;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
          background-color: #c57b36;
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
