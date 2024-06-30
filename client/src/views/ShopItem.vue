<template>
  <TheLoader v-if="loading" :loading="loading"> </TheLoader>
  <div v-else-if="error">{{ error }}</div>
  <div v-else-if="product" class="item-container">
    <ZoomImg v-model:isFullscreen="zoomIn" :imageSrc="activeImage" />
    <div class="left">
      <transition name="fade" mode="out-in">
        <img
          @click="zoomInImg"
          :src="activeImage"
          alt="image de produit"
          :key="activeImage"
        />
      </transition>
      <div class="galerie">
        <img
          v-for="(image, index) in product.image_gallery"
          :key="index"
          :src="image"
          alt="image de produit"
          @click="activeImage = image"
          :class="{ active: activeImage === image }"
        />
      </div>
    </div>
    <div class="right">
      <div class="right-content">
        <h2>{{ product.title }}</h2>
        <div class="rating">
          <span v-for="(star, index) in 5" :key="index" class="star">
            {{ index < product.rating ? "★" : "☆" }}
          </span>
        </div>
        <div class="call-to-action">
          <span class="price" :class="{ promotion: product.is_promotion }">
            {{
              product.is_promotion ? product.discounted_price : product.price
            }}
            €
          </span>
          <button @click="addToCart">Ajouter au panier</button>
        </div>
        <div v-if="product.is_promotion" class="call-to-action alt">
          <span class="price-original"> {{ product.price }} € </span>
          <span class="promo">- {{ discountPercentage }}%</span>
        </div>
        <span class="reference">Ref: {{ product.reference }}</span>
        <div class="description">
          <h3>Description:</h3>
          <p>{{ product.description }}</p>
        </div>
        <div class="details">
          <h3>Caractéristiques:</h3>
          <div class="content">
            <span v-for="(value, key) in product.details" :key="key"
              >{{ capitalizeFirstLetter(key) }}: {{ value }}</span
            >
          </div>
        </div>
        <div class="tags">
          <span v-for="value in product.tags">
            {{ value }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useCartStore } from "../stores/cartStore";
import { useProductStore } from "../stores/useProductStore";
import ZoomImg from "../ui/ZoomImg.vue";
import TheLoader from "../ui/TheLoader.vue";

const route = useRoute();
const zoomIn = ref(false);
const productStore = useProductStore();
const activeImage = ref("null");



const product = computed(() => productStore.product);
const loading = computed(() => productStore.loading);
const error = computed(() => productStore.error);

onMounted(async () => {
  const productId = route.params.id;
  await productStore.fetchProduct(productId);

  activeImage.value = product.value.image_gallery[0];
});

const zoomInImg = () => {
  zoomIn.value = !zoomIn.value;
};
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const discountPercentage = computed(() => {
  if (product.is_promotion && product.discounted_price) {
    return Math.round(
      ((product.price - product.discounted_price) / product.price) * 100
    );
  }
  return 0;
});

//STORE PANIER ICI
const cartStore = useCartStore();
const addToCart = () => {
  cartStore.addItemToCart(product.value);
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
  flex-wrap: wrap;
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
      padding: 10px;
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
    width: 30%;
    min-width: 390px;
    position: relative;
    min-height: 547px;
    .right-content {
      width: 30%;
      min-width: 390px;
      min-height: 547px;
      max-height: 70vh;
      overflow-y: auto;
      position: absolute;
      top: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      padding: 20px;
      border: 1px solid #e2e2e2;
      box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
        rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
      h2 {
        font-size: 20px;
        margin: 0;
        font-weight: bold;
      }
      .rating {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin: 0;
        .star {
          color: #f1c40f;
          font-size: 20px;
        }
      }
      .call-to-action {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin: 10px 0 0;
        gap: 10px;
        .price {
          font-size: 20px;
          font-weight: bold;
          margin: 10px 0;
          color: white;
          background-color: black;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          &.promotion {
            background-color: #ff0000;
          }
        }
        button {
          padding: 0.5rem 1rem;
          border-radius: 5px;
          background-color: #f2a45a;
          width: 221px;
          color: white;
          border: none;
          cursor: pointer;
          font-weight: bold;
          font-size: 20px;
          transition: all 0.3s ease;
          &:hover {
            background-color: #4ccc48;
            color: white;
          }
          &:active {
            background-color: #43af40;
            color: white;
          }
        }
        .price-original {
          font-size: 20px;
          font-weight: bold;
          color: white;
          background-color: black;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          text-decoration: line-through;
        }
        .promo {
          font-size: 20px;
          font-weight: bold;
          color: white;
          background-color: #36c229;
          padding: 0.5rem 1rem;
          border-radius: 5px;
        }
        &.alt {
          margin-bottom: 10px;
        }
      }
      .reference {
        font-size: 14px;
        margin: 0;
      }
      .description {
        width: 100%;
        margin-top: 20px;
        h3 {
          font-size: 18px;
          margin: 0;
          font-weight: bold;
        }
        p {
          font-size: 16px;
          margin: 10px 0;
          padding: 10px;
          background-color: rgb(240, 240, 240);
        }
      }
      .details {
        width: 100%;
        margin-top: 20px;
        h3 {
          font-size: 18px;
          margin: 0;
          font-weight: bold;
        }
        .content {
          width: 100%;
          margin-top: 5px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          background-color: rgb(240, 240, 240);
          padding: 10px;
          span {
            font-size: 16px;
            margin: 2px 0;
          }
        }
      }
      .tags {
        width: 100%;
        margin-top: 20px;
        span {
          font-size: 16px;
          font-weight: bold;
          margin: 0 5px 0 0;
          padding: 5px 10px;
          background-color: black;
          color: white;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
          &:hover {
            background-color: #f2a45a;
          }
        }
      }
    }
  }
}

@media (max-width: 1107px) {
  .item-container {
    .left {
      order: 2;
      margin-top: 20px;
      .galerie {
        justify-content: center;
      }
    }
    .right {
      order: 1;
      width: 100%;
      display: flex;
      justify-content: center;
      .right-content {
        width: 90%;
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
