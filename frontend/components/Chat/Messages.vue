<template>
    <div :class="$style.wrapper">
      <div v-if="messages.length === 0" :class="$style.empty">
        <div :class="$style.innerEmpty">
          <h2 :class="$style.emptyTitle">What do you want to know?</h2>
          <p :class="$style.emptyParagraph">
            Ask a question about your documents.<br/>
            <i>Documents must be placed in the /resources/docs folder</i>
          </p>
        </div>
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
    padding: 40px 40px 40px;
  }

  .innerEmpty {
    height: calc(100vh - 350px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .empty {
    text-align: center;
  }

  .emptyTitle {
    font-size: 32px;
    font-weight: 400;
    margin-bottom: 10px;
  }

  .emptyParagraph {
    font-size: 12px;
    line-height: 145%;
    font-weight: 300;
  }

  .messages {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    max-width: 600px;
  }
  </style>