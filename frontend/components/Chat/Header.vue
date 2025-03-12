<template>
    <header :class="$style.wrapper">
        <h1 :class="$style.title">AskMyDocs</h1>
        <div>
          <button 
            @click="$emit('reindex')" 
            :disabled="isReindexing"
          >
            <span v-if="isReindexing">Reindexing...</span>
            <span v-else>Reindex documents</span>
          </button>
          <button @click="$emit('clear')">
            Clear history
          </button>
        </div>
    </header>
  </template>
  
  <script setup>
  defineProps({
    isReindexing: {
      type: Boolean,
      default: false
    }
  });
  
  defineEmits(['reindex', 'clear']);
  </script>

<style module>
.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.title {
  font-size: 1rem;
}
</style>
