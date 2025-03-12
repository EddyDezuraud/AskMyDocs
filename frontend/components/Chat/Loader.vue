<template>
    <div :class="$style.wrapper">
      <Loader />
      <slot></slot>
    </div>
  </template>


<style module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  padding: 0px 40px 200px;
}
</style>