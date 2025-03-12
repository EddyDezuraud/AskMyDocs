<template>
    <div>
      <p>Sources:</p>
      <ul>
        <li v-for="(source, index) in sources" :key="index">
          {{ source.title }} (Page {{ source.page }})
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  defineProps({
    sources: {
      type: Array,
      required: true
    }
  });
  </script>