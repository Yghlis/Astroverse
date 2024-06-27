<template>
  <div>
    <h2>Mon Panier</h2>
    <transition-group name="list" tag="ul">
      <li v-for="item in cartItems" :key="item.id">
        <img :src="item.image_gallery[0]" alt="item image" />
        {{ item.title }}
        <div class="right">
          <span> {{ item.quantity }} x {{ item.price }}€ </span>
          <button @click="removeItem(item.id)">Supprimer</button>
        </div>
      </li>
    </transition-group>
    <p>Total: {{ cartTotal }}€</p>
    <button class="call-to-action">Passer votre Commande</button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useCartStore } from "../stores/cartStore";

const cartStore = useCartStore();

const cartItems = computed(() => cartStore.cartItems);
const cartTotal = computed(() => cartStore.cartTotal);

const removeItem = (itemId) => {
  cartStore.removeItemFromCart(itemId);
};
</script>

<style scoped>
h2 {
  text-align: center;
  font-size: 2rem;
  margin: 0;
}

ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 20px;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border: 1px solid black;
  border-radius: 5px;
  padding: 10px;
  transition: all 0.3s ease;
  .right {
    display: flex;
    flex-direction: column;
    align-items: center;
    span {
      font-size: 14px;
      font-weight: bold;
      width: 86px;
      text-align: center;
      margin: 10px 0;
      color: white;
      background-color: black;
      padding: 0.5rem 0.5rem;
      border-radius: 5px;
    }
    button {
      background-color: #f00;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
      border: none;
      padding: 0.5rem 0.5rem;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        background-color: #d10303;
      }
    }
  }
  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin-right: 10px;
  }
}

.call-to-action {
  background-color: #41c902;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: #55af00;
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
