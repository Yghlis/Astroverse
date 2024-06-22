<template>
  <div class="item-container">
    <ZoomImg v-model:isFullscreen="zoomIn" :imageSrc="activeImage" />
    <div class="left">
      <transition name="fade" mode="out-in">
        <img @click="zoomInImg" :src="activeImage" alt="image de produit"  :key="activeImage" />
      </transition>
      <div class="galerie">
        <img
          v-for="(image, index) in item.image_gallery"
          :key="index"
          :src="image"
          alt="image de produit"
          @click="activeImage = image"
          :class="{ active: activeImage === image }"
        />
      </div>
    </div>
    <div class="right">
      <h2>Title Du produit {{ itemID }}</h2>
      <span>Note</span>
      <p>Description</p>
      <span>Prix</span>
      <span>Stock</span>
      <button>Ajouter au panier</button>
    </div>
  </div>
</template>

<script setup>
import Luffy from "../assets/images/figurines/one-piece-figurine-luffy-gear-5-king-of-artist-banpresto.jpg";
import naruto from "../assets/images/figurines/bandai-btn65560-8-naruto-s-h-figuarts-naruto-uzumaki-kurama-link-mod.jpg";
import dbz from "../assets/images/figurines/04_4b0d2f02-6ae8-44bd-be40-36de2d56317c.jpg";
import kaido from "../assets/images/figurines/kaido.webp";
import mha from "../assets/images/figurines/my-hero-academia-figurine-izuku-midoriya-the-amazing-hero-plus.webp";
import ZoomImg from "../ui/ZoomImg.vue";

import { ref, reactive } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const itemID = ref(route.params.id);
const zoomIn = ref(false);

const item = reactive({
  title: "ONE PIECE - FIGURINE LUFFY - GEAR 5 - KING OF ARTIST - BANPRESTO",
  price: 35.99,
  description: "Figurine de Luffy en Gear 5 de la série One Piece.",
  stock: 100,
  rating: 5,
  image_gallery: [Luffy, naruto, dbz, kaido, mha],
  details: {
    height: "20cm",
    material: "PVC",
  },
  tags: ["figurine", "One Piece", "Luffy"],
  availability_status: "En stock",
  reference: "OP-LUFFY-GEAR5",
  is_promotion: false,
});

let activeImage = ref(item.image_gallery[0]);

const zoomInImg = () => {
    zoomIn.value = !zoomIn.value;
};

[
  {
    character: {
      id: "20ec1b14-bc04-4ea7-89f0-eb44779ff62b",
      name: "Luffy",
    },
    universe: {
      id: "10143696-3bc2-4130-b1d8-8f27f87e3de8",
      name: "One Piece",
    },
    _id: "667162bae7e971dab5608843",
    id: "e4d9a560-11aa-4889-8428-c2aaef9212f7",
    title: "ONE PIECE - FIGURINE LUFFY - GEAR 5 - KING OF ARTIST - BANPRESTO",
    brand: "Banpresto",
    price: 35.99,
    discounted_price: null,
    is_promotion: false,
    description: "Figurine de Luffy en Gear 5 de la série One Piece.",
    stock: 100,
    number_of_purchases: 120,
    number_of_favorites: 0,
    rating: 5,
    image_preview:
      "../../assets/images/figurines/one-piece-figurine-luffy-gear-5-king-of-artist-banpresto.jpg",
    image_gallery: [
      "../../assets/images/figurines/luffy-gallery1.jpg",
      "../../assets/images/figurines/luffy-gallery2.jpg",
    ],
    reference: "OP-LUFFY-GEAR5",
    details: {
      height: "20cm",
      material: "PVC",
    },
    tags: ["figurine", "One Piece", "Luffy"],
    availability_status: "En stock",
    views_count: 0,
    created_at: "2024-06-18T10:34:34.678Z",
    updated_at: "2024-06-18T10:34:34.678Z",
    __v: 0,
  },
];
</script>

<style lang="scss" scoped>
.item-container {
  width: 100%;
  //background-color: blue;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 50px;
  .left {
    // background-color: #f2a45a;
    width: 700px;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 80%;
      object-fit: cover;
      border-radius: 5px;
      cursor: zoom-in;
    }
    .galerie {
      margin-top: 20px;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      align-items: center;
      gap: 20px;
      img {
        width: 150px;
        height: 150px;
        object-fit: cover;
        border-radius: 5px;
        cursor: pointer;
        border: 1px solid #e2e2e2;
        transition: all 0.3s ease;
        &:hover,
        &.active {
          border: 1px solid #f2a45a;
        }
      }
    }
  }
  .right {
    background-color: aqua;
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
    button {
      padding: 0.5rem 1rem;
      border-radius: 15px;
      background-color: #f2a45a;
      color: white;
      font-weight: bold;
      font-size: 18px;
      margin-top: 1rem;
      transition: all 0.3s ease;
      &:hover {
        background-color: #f2a45a;
        color: white;
        transform: scale(1.1);
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
