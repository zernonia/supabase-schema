<script setup lang="ts">
import { computed, ref } from 'vue';
import { state } from '@/store';

const query = ref('How many products created this year?');
const snippet = ref('');
const isLoading = ref(false);

const tableSchema = computed(() => {
  return Object.entries(state.tables)
    .map(([key, value]) => {
      if (value.is_view) return;
      return `${key}(${value.columns
        ?.map((i) => `${i.title} ${i.format}`)
        .join(',')})`;
    })
    .filter(Boolean)
    .join('\n#');
});

const generateBio = async () => {
  try {
    isLoading.value = true;

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        schema: tableSchema.value,
        query: query.value,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      snippet.value = snippet.value + chunkValue;

      console.log(snippet.value);
    }
  } catch (err) {
    console.log(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="text-white p-8">
    <h1 class="text-4xl">AI</h1>

    <div class="flex flex-col w-108 mt-4">
      <textarea
        v-model="query"
        rows="5"
        class="p-4 bg-dark-700 border-none rounded-xl"
      ></textarea>
      <button
        @click="generateBio"
        class="mt-4 bg-green-500 rounded-md px-4 py-2 text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-600 text-white"
      >
        Generate
      </button>
    </div>

    <div>
      {{ isLoading }}

      {{ snippet }}
    </div>
  </div>
</template>
