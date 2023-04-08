<script setup lang="ts">
import { computed, ref } from 'vue';
import { state } from '@/store';
import { useStorage } from '@vueuse/core';
import type { SQLCardItem, Table } from '@/interface';
import SQLCard from '@/components/SQLCard.vue';

const query = ref('How many products created this year?');

const resultList = useStorage<SQLCardItem[]>('ai-result-list', () => []);

const isLoading = ref(false);

const authUserTable: Table = {
  title: 'auth.user',
  columns: [
    { title: 'id', format: 'uuid', type: 'string' },
    { title: 'email', format: 'varchar', type: 'string' },
  ],
};

const listOfTables = computed(() => {
  const tables = Object.entries(state.tables)
    .map(([key, value]) => (value.is_view ? undefined : value))
    .filter(Boolean);
  tables.push(authUserTable);
  return tables;
});
const tableSchema = computed(() => {
  return listOfTables.value
    .map(
      (table) =>
        `${table?.title}(${table?.columns
          ?.map((i) => `${i.title} ${i.format}`)
          .join(',')})`
    )
    .join('\n#');
});

const generateBio = async () => {
  try {
    const resultListIndex = resultList.value.length;
    resultList.value[resultListIndex] = {
      query: query.value,
      result: '',
    };
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
      resultList.value[resultListIndex].result =
        resultList.value[resultListIndex].result + chunkValue;
    }
  } catch (err) {
    console.log(err);
  } finally {
    isLoading.value = false;
  }
};

const deleteCard = (index: number) => {
  resultList.value.splice(index, 1);
};
</script>

<template>
  <div class="text-white p-8 pr-14 h-screen overflow-y-auto">
    <h1 class="text-4xl">Supabase SQL AI</h1>
    <p class="mt-2 text-lg">
      Translate human language to SQL based on your Supabase project
    </p>

    <div class="flex flex-col md:flex-row mt-12">
      <div class="md:w-120 flex-shrink-0">
        <div class="sticky top-4 flex flex-col">
          <p>Found table:</p>
          <div class="flex flex-wrap mt-4">
            <code
              class="mr-2 mb-2 rounded-full border text-xs px-2 py-1"
              v-for="table in listOfTables"
              v-tooltip="table?.columns?.map((i) => i.title)"
            >
              {{ table?.title }}
            </code>
          </div>

          <textarea
            v-model="query"
            rows="6"
            class="p-4 bg-dark-700 border-none rounded-xl mt-4 focus:outline-none focus:ring-green-500 focus:ring-2"
          ></textarea>
          <button
            @click="generateBio"
            :disabled="isLoading"
            class="mt-4 bg-green-500 rounded-md px-4 py-2 text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-600 text-white"
          >
            Generate
          </button>
        </div>
      </div>

      <div class="mt-8 md:mt-0 md:ml-8 flex flex-col space-y-4">
        <SQLCard
          @delete="deleteCard(index)"
          v-for="(item, index) in resultList"
          :item="item"
        ></SQLCard>
      </div>
    </div>
  </div>
</template>
