<script lang="ts" setup>
import type { Form, FormSubmitEvent } from "@nuxt/ui"
import { z } from "zod"

const props = defineProps({ gameId: { type: Number, required: true } })

const schema = z.object({
  name: z.string().min(1, "Required"),
})

type Schema = z.output<typeof schema>
const formState = reactive<Partial<Schema>>({ name: undefined })

const supabaseClient = useSupabaseClient()
const toast = useToast()
const form = useTemplateRef<Form<Schema>>("playerForm").value

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const newPlayerName = event.data.name
  const { data, error } = await supabaseClient
    .from("players")
    .insert({ game_id: props.gameId, name: newPlayerName })
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
      description: `Player ${newPlayerName} was added!`,
      color: "success",
    })
  }
  formState.name = undefined
  form?.clear()
}
</script>

<template>
  <UForm
    ref="playerForm"
    :state="formState"
    :schema="schema"
    @submit.prevent="onSubmit"
  >
    <div class="flex gap-4">
      <UFormField name="name" class="w-full">
        <UInput
          v-model="formState.name"
          type="text"
          placeholder="New player name"
          icon="material-symbols:add"
          class="w-full text-white"
        />
      </UFormField>
      <template v-if="formState.name && formState.name.length > 0">
        <UButton
          loading-auto
          icon="material-symbols:check"
          class="bg-accent-texture"
          type="submit"
          >Save
        </UButton>
      </template>
    </div>
  </UForm>
</template>
