<template>
    <div :class="$style.wrapper">
      <div v-if="messages.length === 0" :class="$style.empty">
        <p>Ask a question about your PDF documents</p>
        <p>Documents must be placed in the /resources/docs folder</p>
      </div>
      <div v-else :class="$style.messages">
        <ChatMessage 
          v-for="message in messages" 
          :key="message.id"
          :message="message"
          :format-time="formatTime"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    messages: {
      type: Array,
      default: () => []
    },
    formatTime: {
      type: Function,
      required: true
    }
  });
  </script>

  <style module>
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    padding: 40px 40px 200px;
  }

  .empty {
    text-align: center;
  }

  .messages {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    max-width: 600px;
  }
  </style>