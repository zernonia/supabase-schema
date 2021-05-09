<template>
  <menu
    class="absolute z-1000 top-10 m-0 p-0 w-90 border border-dark-border transition-right duration-500 ease-in-out"
    :style="{ right: positionPanel }"
  >
    <div class="relative bg-dark-800 p-6 rounded-bl-md">
      <h1
        style="-webkit-text-fill-color: transparent"
        class="flex items-baseline text-3xl font-bold bg-gradient-to-r from-green-500 to-green-400 bg-clip-text fill-transparent"
      >
        Supabase Schema
        <a href="" target="_blank">
          <i-mdi-github
            class="text-lg ml-2 text-dark-500 hover:text-white"
          ></i-mdi-github>
        </a>
      </h1>
      <h6 class="text-dark-500 font-semibold text-sm">
        Open Source · LocalStorage
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
                href="https://supabase.io/docs/reference/javascript/generating-types#generate-database-types-from-openapi-specification"
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
        <div class="flex">
          <input
            type="text"
            name="website"
            placeholder="https://your-project.supabase.co/rest/v1/?apikey=your-anon-key"
            v-model="website"
            class="bg-dark-900 placeholder-dark-500 mr-2 rounded-md px-4 py-2 h-10 flex-grow border-dark-border focus:border-green-500 focus:ring-green-500"
          />
          <button
            class="bg-green-500 rounded-md px-4 py-2 h-10 text-sm font-semibold focus:outline-none focus:ring focus:ring-green-600"
            @click.prevent="fetchData"
          >
            Fetch
          </button>
        </div>
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
  export default defineComponent({
    setup() {
      // Form fetch data
      const definition = useStorage('definitions', {})
      const title = ref('Supabase Schema')
      const website = useStorage('website', '')

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
              required: value.required.includes(colKey) ? true : false,
              pk:
                colVal.description && colVal.description.includes('<pk/>')
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
        if (!website.value) return
        fetch(website.value).then(async (res) => {
          const body = await res.json()
          if (body.definitions) {
            definition.value = body.definitions
          }
        })
      }

      // toggle Panel
      const togglePanel = useStorage('togglePanel', true)
      const positionPanel = computed(() => {
        return togglePanel.value ? '0' : '-22.5rem'
      })

      return {
        title,
        website,
        fetchData,
        togglePanel,
        positionPanel,
      }
    },
  })
</script>

<style></style>
