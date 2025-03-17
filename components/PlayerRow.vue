<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "Required"),
})

type Schema = z.output<typeof schema>
const formState = reactive<Partial<Schema>>({ name: undefined })

const supabaseClient = useSupabaseClient()
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
</script>

<template>
  <UForm :state="formState" :schema="schema" @submit.prevent="onSubmit">
    <div class="flex gap-4">
      <UFormField name="name">
        <UInput
          v-model="formState.name"
          type="text"
          placeholder="New player name"
          icon="i-heroicons-plus-circle-solid"
        />
      </UFormField>
      <template v-if="formState.name && formState.name.length > 0">
        <UButton
          loading-auto
          icon="i-heroicons-check"
          color="secondary"
          type="submit"
          >Save
        </UButton>
      </template>
    </div>
  </UForm>
</template>
