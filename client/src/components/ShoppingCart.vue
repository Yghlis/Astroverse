<template>
    <span class="material-symbols-outlined">person</span>
 
  </template>
  
  
  <script setup>

  </script>
  
  <style scoped>
  .material-symbols-outlined {
    font-size: 150px;
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
    transition: transform 0.5s ease;
    text-align: center;
    width: 100%;
  }
  h2 {
    text-align: center;
    font-size: 2rem;
    margin: 0;
  }
  
  .log-btn-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin-top: 20px;
    width: 100%;
  }
  .log-btn, .log-input {
    padding: 10px;
    width: 100%;
    text-align: center;
    color: black;
    border: 1px solid black;
    margin: 5px 0;
    border-radius: 25px;
    font-size: 20px;
    font-weight: bold;
    transition: all 0.3s ease;
    background-color: white;
    cursor: pointer;
    font-family: 'Nippo', sans-serif;
  }
  .log-btn:hover, .log-btn.alt:hover {
    color: white;
    background-color: #f2a45a;
    border: 1px solid #f2a45a;
  }
  .log-btn.alt {
    margin-top: 20px;
    background-color: #f2a45a;
    color: white;
    border: 1px solid #f2a45a;
  }
  .error-message {
    color: red;
    text-align: center;
  }
  .slide-enter-active, .slide-leave-active {
    transition: transform 0.5s ease;
  }
  .slide-enter-from, .slide-leave-to {
    transform: translateY(100%);
  }
  </style>
  