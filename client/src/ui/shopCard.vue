<template>
  <div class="card" @click.stop="navigateToDetail">
    <img :src="getImageUrl(product.image_preview)" alt="figurine image" />
    <div class="divider"></div>
    <div class="information">
      <p class="title">{{ product.title }}</p>
      <div class="rating">
        <span v-for="(star, index) in 5" :key="index" class="star">
          {{ index < product.rating ? "★" : "☆" }}
        </span>
      </div>
      <div class="price">
        <span :class="{ promotion: product.is_promotion }">
          {{ product.is_promotion ? product.discounted_price : product.price }}
          €
        </span>
        <div v-if="product.is_promotion" class="promo-data">
          <span class="promo">- {{ discountPercentage }}%</span>
          <span class="price-original"> {{ product.price }} € </span>
        </div>
      </div>

      <button @click.stop="addToCart">Add to cart</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../stores/cartStore";

const props = defineProps({
  product: Object,
});

const router = useRouter();

const navigateToDetail = () => {
  router.push(`/item/${props.product.id}`);
};

const getImageUrl = (absolutePath) => {
  console.log("wtf", absolutePath);
  if (!absolutePath) {
    return "";
  }
  // Extraire la partie relative du chemin absolu
  const relativePath = absolutePath.split("/uploads/")[1];
  const apiUrl = import.meta.env.VITE_API_URL;
  return `${apiUrl}/uploads/${relativePath}`;
};

const discountPercentage = computed(() => {
  if (
    props.product &&
    props.product.is_promotion &&
    props.product.discounted_price
  ) {
    return Math.round(
      ((props.product.price - props.product.discounted_price) /
        props.product.price) *
        100
    );
  }
  return 0;
});

//STORE PANIER ICI
const cartStore = useCartStore();

const addToCart = () => {
  cartStore.addItemToCart(props.product);

};
</script>

<style lang="scss" scoped>
.card {
  width: 320px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .favorite {
    cursor: pointer;
    position: absolute;
    top: 16px;
    right: 16px;
    color: black;
    transition: transform 0.3s ease, color 0.3s ease;

    &:hover {
      transform: scale(1.2);
      color: #000;
    }
    &.active {
      color: #ff0000;
    }
  }

  img {
    width: 100%;
    height: 320px;
    object-fit: contain;
  }

  .divider {
    width: 100%;
    height: 1px;
    background-color: #e0e0e0;
    margin: 0;
  }

  .information {
    padding: 16px;

    p {
      margin: 0;
    }

    .title {
      font-size: 20px;
      font-weight: 700;
      color: #333;
      margin-bottom: 8px;
    }

    .rating {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      .star {
        color: #333;
        font-size: 18px;
      }
    }

    .price {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 5px 0;

      span {
        font-size: 20px;
        font-weight: 700;
        border-radius: 5px;
        background-color: black;
        color: #ffffff;
        padding: 5px 10px;

        &.promotion {
          background-color: #ff0000;
          color: #ffffff;
        }
      }

      .promo-data {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
        margin-left: 5px;

        .promo {
          background-color: #36c229;
          color: #ffffff;
          padding: 5px 10px;
        }

        .price-original {
          text-decoration: line-through;
          padding: 0;
          color: black;
          background-color: transparent;
        }
      }
    }

    button {
      width: 100%;
      margin-top: 16px;
      padding: 12px;
      background-color: #333;
      border: none;
      border-radius: 8px;
      color: #fff;
      font-size: 18px;
      font-weight: 700;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #000;
      }
    }

    .material-symbols-outlined {
      font-size: 36px;
      font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
    }
  }
}
</style>
