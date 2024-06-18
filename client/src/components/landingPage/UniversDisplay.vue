<template>
  <div class="univers">
    <h2>Tous nos Univers</h2>
    <div class="univers-card-container">
      <universCard
        v-for="univers in universes"
        :key="univers.id"
        :imageSrc="univers.imageSrc"
        :title="univers.title"
        :color1="univers.color1"
        :color2="univers.color2"
        :colorText="univers.colorText"
        :link="univers.link"
      />
    </div>
  </div>
</template>

<script setup>
import universCard from './UniversCard.vue';

// ################################################################# API CALL #################################################################

import onePieceImage from '../../assets/images/figurines/one-piece-figurine-luffy-gear-5-king-of-artist-banpresto.jpg';

const universes = [
  {
    id: 1,
    title: 'One Piece',
    color1: '#1c47d6',  
    color2: '#42a8f7', 
    colorText: '#FFFFFF',
    link: 'https://onepiece.com' 
  },
  {
    id: 2,
    title: 'Naruto',
    color1: '#e97504', 
    color2: '#f4ce3c',  
    colorText: '#FFFFFF',
    link: 'https://naruto.com' 
  },
  {
    id: 3,
    title: 'Dragon Ball',
    color1: '#FF0000', 
    color2: '#FFD700', 
    colorText: '#FFFFFF',
    link: 'https://dragonball.com'
  },
  {
    id: 4,
    title: 'My Hero Academia',
    color1: '#216b52',  
    color2: '#160d10',  
    colorText: '#FFFFFF',
    link: 'https://myheroacademia.com' 
  },
  {
    id: 5,
    title: 'Attack on Titan',
    color1: '#73522e', 
    color2: '#d19050',  
    colorText: '#FFFFFF',
    link: 'https://attackontitan.com'
  },
  {
    id: 6,
    title: 'Demon Slayer',
    color1: '#62baa2', 
    color2: '#362722', 
    colorText: '#FFFFFF',
    link: 'https://demonslayer.com'
  }
];


 
</script>

<style lang="scss" scoped>

.univers {
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    font-family: "Nippo", sans-serif;
  }
  .univers-card-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
  }
}

</style>
