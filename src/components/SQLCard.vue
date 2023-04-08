<script setup lang="ts">
import { SQLCardItem } from '@/interface';
import { useClipboard, useDark } from '@vueuse/core';
import { PropType, computed, onMounted, toRefs, watch } from 'vue';
import { supabaseClientState } from '@/store';
import hljs from 'highlight.js/lib/core';
import sql from 'highlight.js/lib/languages/sql';

import 'highlight.js/styles/dark.css';
hljs.registerLanguage('sql', sql);

const props = defineProps({
  item: { type: Object as PropType<SQLCardItem>, required: true },
});
const emits = defineEmits(['delete']);
const { copy, copied } = useClipboard();
const { item } = toRefs(props);

const copyAndOpenSQLTab = async () => {
  if (!item.value.result) return;
  await copy(item.value.result);
  const projectRef = new URL(supabaseClientState.apikey.url).hostname.split(
    '.'
  )[0];
  window.open(`https://app.supabase.com/project/${projectRef}/sql`, '_blank');
};

const highlightedCode = computed(
  () => hljs.highlight(item.value.result ?? '', { language: 'sql' }).value
);
</script>

<template>
  <div
    class="text-left p-6 rounded-xl bg-light-500 hover:bg-light-400 dark:bg-dark-800 hover:bg-dark-700 transition md:max-w-144"
  >
    <p class="text-dark-50">{{ item.query }}</p>
    <pre
      class="mt-2 text-sm p-4 whitespace-pre-wrap border-light-300 bg-light-300 dark:bg-dark-900 rounded-lg border-2 dark:border-dark-border"
      v-html="highlightedCode"
    ></pre>

    <div class="mt-4 flex items-center space-x-2 justify-between">
      <div class="flex items-center space-x-4">
        <button
          v-tooltip="copied ? 'Copied' : 'Copy'"
          :disabled="!item.result"
          @click.prevent="copy(item.result ?? '')"
          class="text-dark-50 dark:hover:text-light-300 transition"
        >
          <i-mdi-clipboard-outline class=""></i-mdi-clipboard-outline>
        </button>
        <button
          v-tooltip="'Open SQL Editor'"
          :disabled="!item.result"
          @click.prevent="copyAndOpenSQLTab"
          class="text-dark-50 dark:hover:text-light-300 transition"
        >
          <i-mdi-link class=""></i-mdi-link>
        </button>
      </div>

      <button
        v-tooltip="'Remove'"
        class="text-red-800 hover:text-light-300 transition"
        @click="emits('delete')"
      >
        <i-mdi:delete-outline class="text-lg"></i-mdi:delete-outline>
      </button>
    </div>
  </div>
</template>

<style lang="postcss">
.hljs-keyword,
.hljs-link,
.hljs-literal,
.hljs-section,
.hljs-selector-tag {
  @apply text-dark-50 dark:text-light-300;
}
</style>
