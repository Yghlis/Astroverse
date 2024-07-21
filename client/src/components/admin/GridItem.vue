<!-- GridItem.vue -->
<template>
    <div ref="root" class="grid-stack-item">
      <div class="grid-stack-item-content" :style="{ backgroundColor: card.backgroundColor }">
        <button @click="handleRemove">X</button>
        <component :is="getComponentType(card.type)" :card="card" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import CardType1 from '../../ui/CardType1.vue';
  import CardType2 from '../../ui/CardType2.vue';
  
  const props = defineProps({
    card: Object
  });
  
  const emit = defineEmits(['remove']);
  
  const root = ref(null);
  
  function handleRemove() {
    emit('remove', root.value);
  }
  
  const getComponentType = (type) => {
    switch (type) {
      case 'carte-1':
        return CardType1;
      case 'carte-2':
        return CardType2;
      default:
        return CardType1;
    }
  };
  </script>
  
  <style scoped>
  .grid-stack-item-content {
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-width: 500px;
    min-height: 250px;
  }
  </style>
  