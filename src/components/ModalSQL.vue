<template>
  <teleport to="body">
    <div
      v-if="open"
      class="w-screen h-screen fixed top-0 left-0 flex items-center justify-center bg-light-400 dark:bg-dark-900 !bg-opacity-50"
    >
      <div
        ref="target"
        class="bg-warm-gray-100 dark:bg-dark-800 w-full max-w-screen-md h-screen-sm rounded-md border-2 dark:border-dark-600 flex flex-col"
      >
        <div
          class="text-dark-100 dark:text-white p-4 border-b-2 dark:border-dark-600 flex items-center justify-between"
        >
          <h1 class="text-xl">Export SQL</h1>
          <button class="btn-green" @click="copy(exportedCode)">
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>
        <div
          class="p-4 text-dark-100 dark:text-white h-full overflow-hidden overflow-y-auto"
        >
          <p class="mb-4">
            There might be some issues with the exported code. You may submit
            <a
              href="https://github.com/zernonia/supabase-schema/issues"
              target="_blank"
              class="underline"
              >issues here</a
            >.
          </p>
          <pre
            class="bg-warm-gray-200 dark:bg-dark-900 text-warm-gray-500 dark:text-white-800 text-sm rounded-md p-4 h-auto"
            >{{ exportedCode }}</pre
          >
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
  import { onClickOutside, useClipboard } from '@vueuse/core'
  import { computed, defineComponent, ref } from 'vue'
  import { state } from '../store'

  const prop = defineProps({
    open: Boolean,
  })
  const emit = defineEmits(['close'])

  const reservedKeyword = [
    'user',
    'database',
    'default',
    'dictionary',
    'files',
    'group',
    'index',
    'level',
    'max',
    'min',
    'password',
    'procedure',
    'table',
    'user',
    'view',
  ]
  const exportedCode = computed(() => {
    let code = ''
    const dependencies: any = {}
    Object.entries(state.tables).forEach(([table, value]) => {
      dependencies[table] = value.columns
        ?.map((v) => v.fk?.split('.')[0])
        .filter((v) => typeof v === 'string')
    })
    let keys = Object.keys(dependencies), // ["A","B","C","D","E","F"]
      output: string[] = []

    while (keys.length) {
      for (let i in keys) {
        let key = keys[i], // "A"
          d = dependencies[key] // []

        if (d.every((dependency: any) => output.includes(dependency))) {
          // If all dependencies are already in the output array
          output.push(key) // Pushing "A" to the output
          keys.splice(+i, 1) // Removing "A" from the keys
        }
      }
    }

    output.forEach((v) => {
      if (state.tables[v].is_view) return
      const table = v
      const value = state.tables[v]

      code += `create table ${table} (\n`
      value.columns?.forEach((v, i, arr) => {
        // Set title
        if (reservedKeyword.includes(v.title)) {
          code += `  "${v.title}"`
        } else {
          code += `  ${v.title}`
        }

        // Set data format
        if (v.format == 'integer' && v.pk) {
          code += ` serial`
        } else {
          code += ` ${v.format}`
        }

        // Set references
        if (v.fk)
          code += ` references ${v.fk.split('.')[0]} (${v.fk.split('.')[1]})`
        // code += ` references ${v.fk}`

        // Set default
        if (v.format == 'date' || v.format.includes('timestamp'))
          code += ` default now()`
        if (v.required && v.format == 'uuid' && !v.fk)
          code += ` default uuid_generate_v4()`
        // Set not null/primary key
        else if (v.required && !v.fk) code += ` not null`
        if (v.pk) code += ` primary key`

        if (i == arr.length - 1) {
          code += `\n`
        } else {
          code += `,\n`
        }
      })
      code += `);\n\n`
    })
    return code
  })

  const { text, copy, copied } = useClipboard({
    source: exportedCode,
  })

  const target = ref()
  onClickOutside(target, (e) => {
    emit('close')
  })
</script>
