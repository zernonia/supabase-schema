<template>
  <menu
    class="absolute z-1000 top-5 m-0 p-0 w-90 rounded-md border-2 dark:border-dark-border transition-right duration-500 ease-in-out"
    :style="{ right: positionPanel }"
  >
    <div class="relative bg-light-300 dark:bg-dark-800 p-6 rounded-md">
      <div class="w-full flex justify-center">
        <img :src="Logo" class="h-32" alt="" />
      </div>
      <h1
        style="-webkit-text-fill-color: transparent"
        class="mt-4 flex items-baseline text-3xl font-bold bg-gradient-to-r from-green-500 to-green-400 bg-clip-text fill-transparent"
      >
        Supabase Schema
        <a href="https://github.com/zernonia/supabase-schema" target="_blank">
          <i-mdi-github
            class="text-lg ml-2 text-dark-500 dark:hover:text-white"
          ></i-mdi-github>
        </a>
      </h1>
      <h6 class="text-dark-500 font-medium text-sm">
        Open Source • LocalStorage
      </h6>
      <div class="mt-4">
        <details :open="true">
          <summary class="font-medium uppercase">Steps</summary>
          <ol class="mt-2 dark:text-white-700 ml-8 list-decimal leading-tight">
            <li class="py-2">
              Obtain OpenAPI URL following instruction
              <a
                class="underline hover:text-green-500"
                target="_blank"
                href="https://github.com/zernonia/supabase-schema#-instructions"
                >here</a
              >
            </li>
            <li class="py-2">Paste the URL below</li>
            <li class="py-2">Enjoy the Supabase Schema</li>
          </ol>
        </details>
      </div>
      <form class="flex flex-col mt-4">
        <label for="website" class="mr-2 text-sm font-medium uppercase"
          >Url</label
        >
        <InputText
          type="text"
          name="url"
          placeholder="https://your-project.supabase.co"
          v-model="supabaseClientState.apikey.url"
        />
        <label for="anon" class="mr-2 mt-2 text-sm font-medium uppercase"
          >API Keys</label
        >
        <InputText
          type="text"
          name="anon"
          placeholder="your-anon-key"
          v-model="supabaseClientState.apikey.anon"
          @keyup.enter="fetchData"
        />
        <div class="flex justify-end mt-4">
          <button
            class="bg-green-500 rounded-md px-4 py-0 h-8 text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-600 text-white"
            @click.prevent="fetchData"
          >
            Fetch
          </button>
        </div>
        <span class="text-sm text-white-900">{{ error }}</span>
      </form>
      <!-- arrow  -->
      <div class="flex gap-3 flex-col -left-3.95rem -top-1px !absolute">
      <button
        v-tooltip:left.tooltip="'Settings'"
          class="btn duration-300"
        @click="togglePanel = !togglePanel"
      >
        <i-majesticons:cog-line></i-majesticons:cog-line>
      </button>
      <button
        v-tooltip:left.tooltip="'Toggle Dark mode'"
          class="btn duration-300"
        @click="toggleDark()"
      >
        <i-majesticons:moon></i-majesticons:moon>
      </button>
    </div>
  </menu>
</template>

<script setup lang="ts">
  import { computed, ref, nextTick } from 'vue'
  import { useStorage } from '@vueuse/core'
  import { state, supabaseClientState } from '../store'
  import Logo from '../assets/logo.svg'
  import { useDark, useToggle } from '@vueuse/core'

  const emit = defineEmits(['fetch'])
  // Form fetch data
  const definition = useStorage('definitions', {})
  const title = ref('Supabase Schema')
  const url = computed(() => supabaseClientState.apikey.url)
  const anon = computed(() => supabaseClientState.apikey.anon)
  const error = ref('')

  const fetchData = () => {
    if (!url.value || !anon.value) return
    fetch(`${url.value}/rest/v1/?apikey=${anon.value}`)
      .then(async (res) => {
        emit('fetch', true)
        if (res.ok) {
          const contentType = res.headers.get('content-type')
          if (
            contentType &&
            contentType.indexOf('application/openapi+json') !== -1
          ) {
            res.json().then((data) => {
              if (data.definitions) {
                definition.value = data.definitions
                if (
                  supabaseClientState.apikey.last_url !=
                  supabaseClientState.apikey.url
                ) {
                  state.tables = {}
                  state.setTables(definition.value, data.paths)
                  nextTick(() => {
                    state.autoArrange()
                  })
                } else {
                  state.setTables(definition.value, data.paths)
                }
              }
              supabaseClientState.apikey.last_url =
                supabaseClientState.apikey.url
            })
          } else {
            res.text().then((text) => {
              error.value = 'Invalid link'
            })
          }
        } else {
          error.value = 'Error with fetching data'
        }
      })
      .catch((e) => {
        error.value = e
      })
      .finally(() => {
        emit('fetch', false)
      })
  }

  const clearStorage = () => {
    localStorage.clear()
    window.location.reload()
  }

  // toggle Panel
  const togglePanel = useStorage(
    'togglePanel',
    import.meta.env.VITE_SUPABASE_API_URL ? false : true
  )
  const positionPanel = computed(() => {
    return togglePanel.value ? '1.25rem' : '-22.5rem'
  })

  // dark mode
  const isDark = useDark()
  const toggleDark = useToggle(isDark)
</script>

<style></style>
