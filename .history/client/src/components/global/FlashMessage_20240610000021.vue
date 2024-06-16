<template>
    <div v-if="visible" :class="`flash-message ${messageType}`">
      {{ currentMessage }}
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        visible: false,
        currentMessage: '',
        messageType: 'info' // 'info', 'success', 'error'
      };
    },
    methods: {
      showMessage(message, type = 'info', duration = 3000) {
        this.currentMessage = message;
        this.messageType = type;
        this.visible = true;
        setTimeout(() => {
          this.visible = false;
        }, duration);
      }
    }
  }
  </script>
  
  <style scoped>
  .flash-message {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    color: white;
    border-radius: 5px;
    text-align: center;
    z-index: 1000;
  }
  .success {
    background-color: green;
  }
  .error {
    background-color: red;
  }
  .info {
    background-color: blue;
  }
  </style>
  