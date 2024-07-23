<template>
  <transition-group name="list" tag="ul">
    <li v-for="item in cartItems" :key="item.productId">
      <img v-if="item.image_gallery && item.image_gallery.length" :src="getImageUrl(item.image_gallery[0])" alt="item image" />
      {{ item.title }}
      <div class="right">
        <div class="quantity">
          <button class="control" @click="decrementItemQuantity(item.productId)">-</button>
          <span>{{ item.quantity }}</span>
          <button class="control" @click="incrementItemQuantity(item.productId)">+</button>
        </div>
        <span>{{ getItemPrice(item) * item.quantity }}€ </span>
        <button @click="removeItem(item.productId)">Supprimer</button>
      </div>
    </li>
  </transition-group>
</template>

<script setup>
import { defineProps, watch } from 'vue';

const props = defineProps({
  cartItems: {
    type: Array,
    default: () => []
  },
  incrementItemQuantity: {
    type: Function,
    required: true
  },
  decrementItemQuantity: {
    type: Function,
    required: true
  },
  getItemPrice: {
    type: Function,
    required: true
  },
  removeItem: {
    type: Function,
    required: true
  },
});

const getImageUrl = (absolutePath) => {

  if (!absolutePath) return '';
  const relativePath = absolutePath.split("/uploads/")[1];
  const apiUrl = import.meta.env.VITE_API_URL;
  const fullUrl = `${apiUrl}/uploads/${relativePath}`;
  
  return fullUrl;
};


watch(() => props.cartItems, (newVal) => {
  
}, { deep: true });


</script>

<style lang="scss" scoped>
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
    .quantity {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5px;
      margin: 0;
      .control {
        font-size: 20px;
        color: black;
        width: 30px;
        height: 30px;
        padding: 5px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        border: 1px solid black;
        background-color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        &:first-child:hover {
          color: white;
          background-color: #f00;
          border-color: #f00;
        }
        &:last-child:hover {
          color: white;
          background-color: #41c902;
          border-color: #41c902;
        }
      }
      span {
        margin: 0;
      }
    }
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

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
