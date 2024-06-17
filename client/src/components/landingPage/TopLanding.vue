<template>
  <div class="top-landing">
    <h1>Find Something</h1>
    <div class="search-bar">
      <span class="material-symbols-outlined"> search </span>
      <input
        type="text"
        placeholder="Rechercher une figurine, nom du personnage ou univers..."
      />
    </div>
    <div class="ad">
      <div class="left">
        <span class="material-symbols-outlined"> local_shipping </span>
        <div class="show-info">
          <p>Free Shipping!</p>
          <p>Only available in France</p>
        </div>
      </div>
      <div class="right">
        <span class="material-symbols-outlined"> verified_user </span>
        <div class="show-info">
          <p>Trusted Merchant</p>
          <p>No Worries All merchants 100% Licensed</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.top-landing {
  padding-bottom: 50px;
  width: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    font-family: "Nippo", sans-serif;
  }
  .search-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 80%;
    input {
      width: 100%;
      height: 50px;
      padding-left: 50px;
      border: none;
      border-bottom: 2px solid #f2a45a;
      font-size: 19px;
      background-color: #f5f5f5;

      &:focus {
        outline: none;
        border-bottom: 2px solid #f2a45a;
      }
    }
    .material-symbols-outlined {
      position: absolute;
      left: 10px;
      font-size: 35px;
      font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
      transition: transform 0.5s ease;
    }
  }
  .ad {
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 80%;
    max-width: 750px;
    margin-top: 50px;
    background-color: white;
    padding: 30px 20px;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px,
      rgba(0, 0, 0, 0.05) 0px 5px 10px;
    .material-symbols-outlined {
      font-size: 35px;
      font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
      transition: transform 0.5s ease;
    }
    .left,
    .right {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 50%;
      z-index: 2;
      span {
        display: flex;
        justify-content: center;
        align-items: center;
        .material-symbols-outlined {
          font-size: 35px;
          font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
        }
      }
      .show-info {
        margin-left: 20px;
        p {
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0;
          &:nth-child(2) {
            font-size: 1rem;
            font-weight: 400;
          }
        }
      }
    }
    &::before {
      content: "";
      position: absolute;
      bottom: 9px;
      left: -125px;
      width: 200px;
      height: 150px;
      border-radius: 100%;
      background-color: #fdb979;
      z-index: 1;
    }
    &::after {
      content: "";
      position: absolute;
      top: 9px;
      right: -125px;
      width: 200px;
      height: 150px;
      border-radius: 100%;
      background-color: #fdb979;
      z-index: 1;
    }
  }
}
</style>
