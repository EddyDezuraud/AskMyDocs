<template>
    <div>
      Error: {{ error }}
    </div>
  </template>
  
  <script setup>
  defineProps({
    error: {
      type: String,
      required: true
    }
  });
  </script>