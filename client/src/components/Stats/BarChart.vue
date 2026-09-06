<template>
  <div class="chart">
    <div v-for="item in items" :key="item.label" class="row">
      <span class="label" :title="item.label">{{ item.label }}</span>
      <span class="track">
        <span class="bar" :style="{ width: pct(item.value) + '%' }" />
      </span>
      <span class="value">{{ format ? format(item.value) : item.value }}</span>
    </div>
    <p v-if="!items.length" class="empty">No data.</p>
  </div>
</template>

<script setup lang="ts">
import type { Count } from '@/stats';

const props = defineProps<{
  items: Count[];
  format?: (v: number) => string;
}>();

const max = () => Math.max(1, ...props.items.map((i) => i.value));
const pct = (v: number) => (v / max()) * 100;
</script>

<style scoped>
.chart {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.row {
  display: grid;
  grid-template-columns: 130px 1fr 44px;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}
.label {
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.9;
}
.track {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
  height: 18px;
}
.bar {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #42b983, #2f9e6d);
  border-radius: 4px;
  min-width: 2px;
  transition: width 0.4s ease;
}
.value {
  text-align: left;
  font-variant-numeric: tabular-nums;
  opacity: 0.85;
}
.empty {
  opacity: 0.6;
}
@media screen and (max-width: 700px) {
  .row {
    grid-template-columns: 90px 1fr 36px;
    font-size: 12px;
  }
}
</style>
