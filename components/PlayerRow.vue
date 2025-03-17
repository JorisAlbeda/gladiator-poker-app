<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "Required"),
})

type Schema = z.output<typeof schema>
const formState = reactive<Partial<Schema>>({ name: undefined })

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const newPlayerName = event.data.name
  const { data, error } = await supabaseClient
    .from("players")
    .insert({ name: newPlayerName })
    .select("id")
    .single()
  if (error || !data) {
    toast.add({
      title: "Oh noes!",
      description: `Error adding player ${newPlayerName}: ${error.message}`,
      color: "error",
    })
  } else {
    toast.add({
      title: "New Player",
      description: `Player ${newPlayerName} was added! Id: ${data.id}`,
      color: "success",
    })
  }
  formState.name = undefined
}

const supabaseClient = useSupabaseClient()
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
