<template>
{{msg}}
  <h4>msg: {{ msg ? 'msg true' : 'msg false' }}</h4>
</template>

<script setup lang="ts">
defineProps<{
  msg: boolean
}>()
</script>
