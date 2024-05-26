<template>
  <div ref="selecteurCard" class="card" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <span class="material-symbols-outlined favorite"> favorite </span>
    <img
      src="../assets/images/figurines/one-piece-figurine-luffy-gear-5-king-of-artist-banpresto.jpg"
      alt="figurine image"
    />
    <div class="information">
      <p>ONE PIECE - FIGURINE LUFFY - GEAR 5 - KING OF ARTIST - BANPRESTO</p>
      <div class="rating">
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <p>(120)</p>
      </div>
      <div class="price">
        <span>$35.99</span>
      </div>
      <transition name="fade-slide">
        <button v-if="showBtn">Add to cart</button>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { animate } from "motion";

const showBtn = ref(false);
const selecteurCard = ref(null);

const toggleBtn = () => {
  showBtn.value = !showBtn.value;
};

const handleMouseEnter = () => {
  animate(selecteurCard.value, { height: '430px', y:'-10px' }, { duration: 0.3 });
  toggleBtn();
};

const handleMouseLeave = () => {
  animate(selecteurCard.value, { height: '350px',y: '10px' }, { duration: 0.3 });
  toggleBtn();
};
</script>

<style lang="scss" scoped>
.card {
  width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  position: relative;
  cursor: pointer;
  height: 350px;
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
    align-items: center;
    padding: 10px;
    p {
      font-size: 17px;
      font-weight: 700;
      margin: 10px 0 0 0;
    }
    .rating {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 0;
      span {
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
      margin: 10px 0 0 0;
      span {
        font-size: 20px;
        font-weight: 700;
      }
    }
    button {
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

.fade-slide-enter-active, .fade-slide-leave-active {
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
