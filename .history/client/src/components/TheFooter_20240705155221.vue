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
      <div class="newsletter">
        <h2 class="newsletter-title">Subscribe to our Newsletter</h2>
        <p class="newsletter-description">
          Stay updated with the latest news and exclusive offers.
        </p>
        <form class="newsletter-form" @submit.prevent="subscribe">
          <input
            type="email"
            v-model="email"
            placeholder="Enter your email"
            class="newsletter-input"
            required
          />
          <button type="submit" class="newsletter-button">Subscribe</button>
        </form>
      </div>
      <p>&copy; 2024 Astroverse. All rights reserved.</p>
      <ul class="footer-links">
        <li><a href="#privacy">Privacy Policy</a></li>
        <li><a href="#terms">Terms of Service</a></li>
        <li><a href="#contact">Contact Us</a></li>
      </ul>
    </div>
  </footer>
</template>

<script setup>
import { ref } from "vue";
import useFlashMessageStore from "@composables/useFlashMessageStore";

const { flashMessage, flashMessageType, setFlashMessage } =
  useFlashMessageStore();

const subscribe = () => {
  // Simuler un appel API
  setTimeout(() => {
    setFlashMessage("Merci pour votre abonnement !");
  }, 500);
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
  margin-top: 100px;
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

      &-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        .newsletter-input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 80%;
          margin-bottom: 10px;
        }
        .newsletter-button {
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

      &-message {
        margin-top: 20px;
        color: green;
        font-size: 1em;
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
