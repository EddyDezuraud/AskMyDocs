<template>
  <div :class="$style.wrapper">
      <form @submit.prevent="handleSubmit" :class="$style.form" class="grid w-full gap-2 rounded-xl bg-muted/50">
        <Textarea :v-model="message"
                  @input="$emit('update:message', $event.target.value)"
                  placeholder="Ask a question about your documents..."
                  :disabled="isLoading || isReindexing" />
        <Button type="submit"
                :disabled="isLoading || !message.trim() || isReindexing">
          Send message
        </Button>
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
  width: var(--global-small-width);
  background-color: hsl(var(--background));
}

.form {
  padding: 1.5rem;
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
</style>