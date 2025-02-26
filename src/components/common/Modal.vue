<template>
    <div class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <slot name="header"></slot>
          <button class="close-button" @click="$emit('close')">×</button>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Modal',
    mounted() {
      document.body.style.overflow = 'hidden';
    },
    beforeDestroy() {
      document.body.style.overflow = 'auto';
    }
  };
  </script>
  