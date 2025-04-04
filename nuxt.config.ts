// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  typescript: {
    typeCheck: false,
  },
  css: ["~/assets/css/main.css"],
  modules: [
    "@pinia/nuxt",
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxtjs/supabase",
    "@nuxt/image",
  ],
  supabase: {
    redirect: false,
  },
  colorMode: {
    preference: "dark",
  },
})
