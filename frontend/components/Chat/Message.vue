<template>
    <div
        class="rounded-xl"
      :class="[
        $style.wrapper,
        message.role === 'user'
          ? $style.user
          : $style.botMessage
      ]"
    >
      <div :class="$style.header">
        <span>
          {{ message.role === 'user' ? 'You' : 'Assistant' }}
        </span>
        <span>
          {{ formatTime(message.timestamp) }}
        </span>
      </div>
      
      <div v-html="message.content" :class="$style.content" />
      
      <ChatMessageSources 
        v-if="message.sources && message.sources.length > 0"
        :sources="message.sources"
      />
    </div>
  </template>
  
  <script setup>
  defineProps({
    message: {
      type: Object,
      required: true
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
    padding: 10px;
    border-radius: 10px;
  }

  .user {
    background: hsl(var(--muted) / 0.5);
    align-self: flex-end;
    width: 500px;
    max-width: 90%;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .content think::before {
    display: block;
    content: 'Think :';
    color: #3498db;
  }

  .content think {
    display: block;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.2);
    padding: 5px 10px;
    border-left: #3498db 1px solid;
    line-height: 130%;
  }

  .content {
    line-height: 145%;
  }

  .header {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.5);
  }

  .botMessage {
    background: hsl(var(--muted) / 0.1);
    align-self: flex-start;
    width: 500px;
    max-width: 90%;
  }
  </style>