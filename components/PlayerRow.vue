<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "Required"),
})

type Schema = z.output<typeof schema>
const formState = reactive<Partial<Schema>>({ name: undefined })

const toast = useToast()

function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: "New Player",
    description: `Player ${event.data.name} was added!`,
    color: "success",
  })
  formState.name = undefined
}
</script>

<template>
  <UForm :state="formState" :schema="schema" @submit="onSubmit">
    <UFormField name="name">
      <UInput
        v-model="formState.name"
        type="text"
        placeholder="New player name"
        icon="i-heroicons-plus-circle-solid"
      />
    </UFormField>
  </UForm>
</template>
