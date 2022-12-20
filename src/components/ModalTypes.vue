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
          <h1 class="text-xl">Export Types (for Typescript)</h1>
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

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  const exportedCode = computed(() => {
    const referenceTable: { [key: string]: string } = {
      uuid: 'string',
      text: 'string',
      char: 'string',
      character: 'string',
      varchar: 'string',
      ARRAY: 'any[]',
      boolean: 'boolean',
      date: 'string',
      time: 'string',
      timestamp: 'string',
      timestamptz: 'string',
      interval: 'string',
      json: 'json',
      smallint: 'number',
      int: 'number',
      integer: 'number',
      bigint: 'number',
      float: 'number',
      float8: 'number',
    }

    let code = ''
    const dependencies: any = {}
    Object.entries(state.tables).forEach(([table, value]) => {
      dependencies[table] = value.columns
        ?.map((v) => v.fk?.split('.')[0])
        .filter((v) => typeof v === 'string')
        .filter((v) => table != v)
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
      const table = v
      const value = state.tables[v]

      code += `interface ${capitalizeFirstLetter(table)} {\n`
      value.columns?.forEach((v, i, arr) => {
        // Set title
        code += `  ${v.title}`

        // Check required?
        if (!v.required) code += '?'
        code += ': '

        // Map to Typescript types
        code += referenceTable[v.format]
          ? referenceTable[v.format]
          : 'any // type unknown'

        // Check if Primary key or Foreign Key
        if (v.pk) code += '   /* primary key */'
        if (v.fk) code += `   /* foreign key to ${v.fk} */`
        code += `;\n`
      })

      value.columns
        ?.map((z) => z.fk)
        .filter((z) => typeof z === 'string')
        .forEach((z) => {
          let reference = z?.split('.')[0] as string
          code += `  ${reference}?: ${capitalizeFirstLetter(reference)};\n`
        })

      code += `};\n\n`
    })
    return code
  })

  const { text, copy, copied } = useClipboard({
    source: '',
  })

  const target = ref()
  onClickOutside(target, (e) => {
    emit('close')
  })
</script>
