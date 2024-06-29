<!-- Modal.vue -->
<template>
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" :style="{ width: width, height: height }">
          <div class="modal-header">
            <slot name="header">
              Default Header
            </slot>
          </div>
          <div class="modal-body">
            <slot name="body">
              Default Body
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              Default Footer
              <button class="modal-default-button" @click="$emit('close')">
                Fermer
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Modal',
    props: {
      width: {
        type: String,
        default: '90%'
      },
      height: {
        type: String,
        default: 'auto'
      }
    }
  };
  </script>
  
  <style scoped>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-wrapper {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
  
  .modal-container {
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .modal-header, .modal-footer {
    padding-bottom: 10px;
  }
  </style>
  