<template>
  <header>
    <div class="logo">
      <img :src="logo" alt="Logo" class="logo" />
      <h1>Astroverse</h1>
    </div>
    <NavBar />
    <div class="right-btn">
      <button class="login" @click="toggleUser">
        <span class="material-symbols-outlined">account_circle</span>
      </button>
      <button class="login" @click="toggleCart">
        <span class="material-symbols-outlined alt"> shopping_cart </span>
        <div v-if="NombreDeItem" class="number-filtre" ref="numberItem">
          <span>{{ NombreDeItem }}</span>
        </div>
      </button>
    </div>
    <SideBar
      :showSideBar="userClicked || cartClicked"
      :type="type"
      @update:hideUserSideBar="toggleUser"
      @update:hideCartSideBar="toggleCart"
    >
      <UserDisplay v-if="userClicked"></UserDisplay>
      <ShoppingCart v-if="cartClicked"></ShoppingCart>
    </SideBar>
  </header>
</template>

<script setup>
import NavBar from "./NavBar.vue";
import SideBar from "../ui/SideBar.vue";
import UserDisplay from "./UserDisplay.vue";
import ShoppingCart from "./ShoppingCart.vue";
import { computed, ref, watch } from "vue";
import logoPath from "../assets/images/logo.png"; // Importer le logo

const logo = ref(logoPath); // Référence au chemin du logo
const userClicked = ref(false);
const cartClicked = ref(false);
const type = ref("");


const toggleUser = () => {
  type.value = "user";
  userClicked.value = !userClicked.value;
};

const toggleCart = () => {
  type.value = "cart";
  cartClicked.value = !cartClicked.value;
};

//Panier

import { useCartStore } from '../stores/cartStore';
import { animate } from "motion";

const cartStore = useCartStore();

const NombreDeItem = computed(() => cartStore.cartItemCount);
const numberItem = ref(null);


watch(NombreDeItem, (newValue, oldValue) => {
  if (newValue !== oldValue && numberItem.value) {
    animate(numberItem.value, [
      { scale: 1, backgroundColor: 'black' },
      { scale: 1.5, backgroundColor: 'orange' },
      { scale: 1, backgroundColor: 'black' }
    ], {
      duration: 0.5,
      easing: 'ease-in-out'
    });
  }
});
</script>

<style lang="scss" scoped>
header {
  position: fixed;
  top: 0;
  width: 100%;
  font-family: "Nippo", sans-serif;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100px;
  z-index: 1000;
  .logo {
    display: flex;
    align-items: center;
    h1 {
      font-size: 2rem;
      color: #f2a45a;
    }
    img {
      width: 100px;
      height: 100px;
    }
  }
  .right-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    button {
      margin: 0 10px;
    }
    .login {
      position: relative;
      cursor: pointer;
      color: black;
      background-color: white;
      transition: all 0.3s ease;
      padding: 10px;
      border-radius: 100%;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        color: white;
        background-color: #f2a45a;
        transform: scale(1.1);
      }
      .material-symbols-outlined {
        font-size: 35px;
        font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
        transition: transform 0.5s ease;
        &.alt {
          font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
        }
      }
    }
    .number-filtre {
      position: absolute;
      right: -10px;
      background-color: black;
      border-radius: 100%;
      height: 20px;
      width: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        color: white;
        font-size: 15px;
      }
    }
  }
}
</style>
