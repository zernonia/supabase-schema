<template>
  <menu
    class="absolute z-1000 top-10 m-0 p-0 w-90 rounded-bl-md border border-dark-border transition-right duration-500 ease-in-out"
    :style="{ right: positionPanel }"
  >
    <div class="relative bg-dark-800 p-6 rounded-bl-md">
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
            class="text-lg ml-2 text-dark-500 hover:text-white"
          ></i-mdi-github>
        </a>
      </h1>
      <h6 class="text-dark-500 font-semibold text-sm">
        Open Source • LocalStorage
      </h6>
      <div class="mt-4">
        <details :open="true">
          <summary class="font-semibold uppercase">Steps</summary>
          <ol class="mt-2 text-snow ml-8 list-decimal leading-tight">
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
        <label for="website" class="mr-2 text-sm font-semibold uppercase"
          >Url</label
        >
        <input
          type="text"
          name="url"
          placeholder="https://your-project.supabase.co"
          v-model="url"
          class="bg-dark-900 placeholder-dark-500 mr-2 rounded-md px-4 py-2 h-10 flex-grow border-dark-border focus:border-green-500 focus:ring-green-500"
        />
        <label for="anon" class="mr-2 mt-2 text-sm font-semibold uppercase"
          >API Keys</label
        >
        <input
          type="text"
          name="anon"
          placeholder="your-anon-key"
          v-model="anon"
          @keyup.enter="fetchData"
          class="bg-dark-900 placeholder-dark-500 mr-2 rounded-md px-4 py-2 h-10 flex-grow border-dark-border focus:border-green-500 focus:ring-green-500"
        />
        <div class="flex justify-end mt-4">
          <button
            class="bg-green-500 rounded-md px-4 py-0 h-8 text-sm font-semibold hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-600"
            @click.prevent="fetchData"
          >
            Fetch
          </button>
        </div>
        <span class="text-sm text-white-900">{{ error }}</span>
      </form>
      <!-- arrow  -->
      <div
        class="-left-2.7rem -top-1px absolute p-3 rounded-l-md bg-dark-800 border-l border-t border-b border-dark-border cursor-pointer hover:bg-dark-600"
        @click="togglePanel = !togglePanel"
      >
        <i-bx-bxs-right-arrow class="p-3px"></i-bx-bxs-right-arrow>
      </div>
    </div>
  </menu>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, onMounted } from 'vue'
  import { useStorage } from '@vueuse/core'
  import { Table, Column } from '../interface'
  import { state } from '../store'
  import Logo from '../assets/logo.svg'

  export default defineComponent({
    emits: ['fetch'],
    setup(prop, { emit }) {
      // Form fetch data
      const definition = useStorage('definitions', {})
      const title = ref('Supabase Schema')
      const url = useStorage('url', '')
      const anon = useStorage('anon', '')
      const error = ref('')

      state.tables = computed(() => {
        let tableGroup: Table[] = []
        let key: string
        let value: any
        for ([key, value] of Object.entries(definition.value)) {
          let colGroup: Column[] = []
          Object.keys(value.properties).forEach((colKey: string) => {
            // Looping every Column
            const colVal = value.properties[colKey]
            let col: Column = {
              title: colKey,
              format: colVal.format.split(' ')[0],
              type: colVal.type,
              default: colVal.default ? colVal.default : undefined,
              required:
                value.required && value.required?.includes(colKey)
                  ? true
                  : false,
              pk:
                colVal.description && colVal.description?.includes('<pk/>')
                  ? true
                  : false,
              fk: colVal.description
                ? colVal.description.split('`')[1]
                : undefined,
            }
            colGroup.push(col)
          })
          // Push every table
          tableGroup.push({
            title: key,
            columns: colGroup,
          })
        }
        return tableGroup
      })

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
                  }
                  emit('fetch', false)
                })
              } else {
                res.text().then((text) => {
                  error.value = 'Invalid link'
                  emit('fetch', false)
                })
              }
            } else {
              error.value = 'Error with fetching data'
              emit('fetch', false)
            }
          })
          .catch((e) => {
            error.value = e
            emit('fetch', false)
          })
      }

      const clearStorage = () => {
        localStorage.clear()
        window.location.reload()
      }

      // toggle Panel
      const togglePanel = useStorage('togglePanel', true)
      const positionPanel = computed(() => {
        return togglePanel.value ? '0' : '-22.5rem'
      })

      return {
        Logo,
        title,
        url,
        anon,
        error,
        fetchData,
        clearStorage,
        togglePanel,
        positionPanel,
      }
    },
  })
</script>

<style></style>
