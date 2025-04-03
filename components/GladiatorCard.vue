<script lang="ts" setup>
defineProps({
  title: { type: String, default: "" },
  color: {
    validator(value: string) {
      // The value must match one of these strings
      return ["primary", "secondary"].includes(value)
    },
    default: "secondary",
  },
})
</script>

<template>
  <UCard
    variant="soft"
    class="w-full md:w-sm mt-4 text-body overflow-hidden relative border border-body"
    :class="{
      'bg-primary-light': color == 'primary',
      'bg-grey': color == 'secondary',
    }"
  >
    <BrushStroke
      class="w-72 h-32 left-[220px] top-[269.97px] absolute origin-top-left rotate-[-59.53deg] opacity-30"
    />
    <BrushStroke
      class="w-96 h-24 left-[415.60px] top-[0.06px] absolute origin-top-left rotate-[120.92deg] opacity-20"
    />
    <BrushStroke
      class="w-[518.33px] h-24 left-[350.95px] top-[-19.23px] absolute origin-top-left rotate-[120.05deg] opacity-10"
    />
    <DecorationLine />
    <h2 class="text-3xl text-center my-6">{{ title }}</h2>
    <slot />
  </UCard>
</template>
