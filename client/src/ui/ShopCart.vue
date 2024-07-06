<template>
    <transition-group name="list" tag="ul">
      <li v-for="item in cartItems" :key="item.id">
        <img :src="getImageUrl(item.image_gallery[0])" alt="item image" />
        {{ item.title }}
        <div class="right">
          <span> {{ item.quantity }} x {{ item.price }}€ </span>
          <button @click="removeItem(item.id)">Supprimer</button>
        </div>
      </li>
    </transition-group>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    cartItems: Array,
    removeItem: Function,
  });

  const getImageUrl = (absolutePath) => {
  const relativePath = absolutePath.split("/uploads/")[1];
  const apiUrl = import.meta.env.VITE_API_URL;
  return `${apiUrl}/uploads/${relativePath}`;
};
  </script>
  
  <style scoped>
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
  
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }
  
  .list-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }
  </style>
  