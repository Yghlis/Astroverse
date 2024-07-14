<template>
  <div
    ref="selecteurCard"
    class="card"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="navigateToDetail"
  >
    <span class="material-symbols-outlined favorite"> favorite </span>
    <img :src="getImageUrl(product.image_preview)" alt="figurine image" />
    <div class="information">
      <p class="title">{{ product.title }}</p>
      <div class="rating">
        <span v-for="(star, index) in 5" :key="index" class="star">
          {{ index < product.rating ? "★" : "☆" }}
        </span>
        <!-- <p>({{ numberOfRatings }})</p> -->
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
      <transition name="fade-slide">
        <button v-if="showBtn" @click.stop="addToCart">Ajouter au panier</button>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { animate } from "motion";
import { useRouter } from "vue-router";
import { useCartStore } from "../stores/cartStore";
import { useProductStore } from "../stores/useProductStore";

const props = defineProps({
  product: Object,
});

const showBtn = ref(false);
const selecteurCard = ref(null);

const router = useRouter();

const toggleBtn = () => {
  showBtn.value = !showBtn.value;
};

const handleMouseEnter = () => {
  animate(
    selecteurCard.value,
    { height: "430px", y: "-10px" },
    { duration: 0.3 }
  );
  toggleBtn();
};

const handleMouseLeave = () => {
  animate(selecteurCard.value, { height: "350px", y: "0" }, { duration: 0.3 });
  toggleBtn();
};

const navigateToDetail = () => {
  router.push(`/item/${props.product.id}`);
};

const getImageUrl = (absolutePath) => {
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
  width: 280px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  position: relative;
  cursor: pointer;
  height: 350px;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid #f2a45a;
  }
  .favorite {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
    color: #bebebe;
    transition: all 0.3s ease;
    &:hover {
      color: red;
      transform: scale(1.2);
      font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
    }
    &:active {
      transform: scale(1.2);
      color: red;
      font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
    }
  }
  img {
    width: 100%;
    height: 200px;
    object-fit: contain;
  }
  .information {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 10px;
    p {
      font-size: 17px;
      font-weight: 700;
      margin: 10px 0 0 0;
    }
    .title {
      min-height: 30px;
      max-height: 60px;
      //for having ... when text is too long
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      line-height: 20px;
    }

    .rating {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 0;
      .star {
        color: #f1c40f;
        font-size: 17px;
      }
      p {
        font-size: 15px;
        margin: 0 0 0 5px;
        font-weight: normal;
      }
    }
    .price {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 5px 0 0 0;
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
      align-self: center;
      width: 80%;
      height: 50px;
      background-color: #f2a45a;
      border-radius: 10px;
      color: #ffffff;
      font-size: 17px;
      font-weight: 700;
      border: none;
      cursor: pointer;
      margin-top: 20px;
    }
    button:hover {
      background-color: #f39c12;
    }
    .material-symbols-outlined {
      font-size: 35px;
      font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
      transition: transform 0.5s ease;
    }
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}
.fade-slide-enter-from {
  transform: translateY(-50px);
  opacity: 0;
}
.fade-slide-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.fade-slide-leave-from {
  transform: translateY(0);
  opacity: 1;
}
.fade-slide-leave-to {
  transform: translateY(-50px);
  opacity: 0;
}
</style>
