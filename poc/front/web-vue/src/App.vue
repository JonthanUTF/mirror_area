<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
function decrement() {
  count.value--
}
function reset() {
  count.value = 0
}
</script>

<template>
  <section class="counter">
      <h1>Server Counter</h1>
      <div class="value" aria-live="polite">{{ count }}</div>
      <div class="controls">
        <button class="btn" @click="decrement">−</button>
        <button class="btn" @click="reset">Reset</button>
        <button class="btn primary" @click="increment">+</button>
      </div>
    </section>
</template>

