<template>
    <div class="flex">
        <Sign />
        <Ticket class="ticket-wrap" />
        <Clock class="ticket-wrap" />
    </div>
    <!-- <div class="flex">
        <Exercise />
    </div> -->
</template>
<script lang="ts" setup>
import Ticket from "./Ticket.vue";
import Sign from "./Sign.vue";
import Clock from "./Clock.vue";
import Exercise from './Exercise.vue';

</script>

<style lang="less" scoped>
.flex {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    :deep canvas {
        border: 1px solid #c2cdf9;
    }
}
.ticket-wrap {
    width: 400px;
    height: 200px;
    margin: 10px;
    position: relative;
}
</style>
