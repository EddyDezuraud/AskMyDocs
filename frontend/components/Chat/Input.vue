<template>
  <div :class="$style.wrapper">
      <form @submit.prevent="handleSubmit" :class="$style.form">
        <textarea
          :value="message"
          @input="$emit('update:message', $event.target.value)"
          placeholder="Ask a question about your documents..."
          :disabled="isLoading || isReindexing"
        />
        <button
          type="submit"
          :disabled="isLoading || !message.trim() || isReindexing"
          :class="$style.send"
        >
          <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M18 11l-6 -6" /><path d="M6 11l6 -6" /></svg>
        </button>
      </form>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  isReindexing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:message', 'send']);

const handleSubmit = () => {
  emit('send');
};
</script>

<style module>
.wrapper {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;

  background: #121922;
  border-radius: 10px;
  padding: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 10px;
}

.wrapper textarea {
  field-sizing: content;
  max-height: 100px;
  width: 100%;
  background: transparent;
  color: white;
  border: none;
  font-family: inherit;
}

.send {
  border: none;
  cursor: pointer;
  width: 32px;
  aspect-ratio: 1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}
</style>