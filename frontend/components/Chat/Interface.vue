<template>
  <div class="interfaceWrapper">
    <ChatHeader 
      :is-reindexing="isReindexing" 
      @reindex="handleReindex" 
      @clear="clearChat" 
    />
    
    <div>
      <ChatMessages 
        :messages="messages" 
        :format-time="formatTime"
      />
      
      <ChatLoader v-if="isLoading" />
      
      <ChatError v-if="error" :error="error" />
    </div>

    <ChatInput 
      v-model:message="inputMessage"
      :is-loading="isLoading"
      :is-reindexing="isReindexing"
      @send="onSendMessage"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useApiService } from '~/services/api';
import { useChat } from '~/composables/useChat';

// Use destructuring to extract all methods and properties
const { isLoading, messages, error, sendMessage, clearChat } = useChat();
const apiService = useApiService();
const inputMessage = ref(`When was the accessibility declaration made?`);
const isReindexing = ref(false);

const onSendMessage = async () => {
  if (inputMessage.value.trim() && !isLoading.value) {
    const messageText = inputMessage.value;
    inputMessage.value = '';
    try {
      await sendMessage(messageText);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  }
};

const handleReindex = async () => {
  isReindexing.value = true;
  try {
    const result = await apiService.reindexDocuments();
    alert(`Reindexing successful! ${result.count} documents processed.`);
  } catch (err) {
    alert(`Error during reindexing: ${err.message || 'An error occurred'}`);
  } finally {
    isReindexing.value = false;
  }
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>