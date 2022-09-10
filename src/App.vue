<template>
  <main
    class="w-screen h-screen relative bg-white dark:bg-dark-900 text-dark-50 dark:text-white overflow-hidden"
    @wheel="$event.preventDefault()"
  >
    <router-view></router-view>
    <!-- <Navigation></Navigation> -->
    <Settings></Settings>
  </main>
  <Loading v-if="isFetching"></Loading>
</template>

<script setup lang="ts">
  import { state, supabaseClientState } from './store'

  import { ref, toRefs, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import AES from 'crypto-js/aes'
  import UTF8 from 'crypto-js/enc-utf8'

  const isFetching = ref(false)

  const { hash } = toRefs(useRoute())
  const router = useRouter()
  const descryted = (encryptedText: string) =>
    AES.decrypt(encryptedText, 'this password doesnt matter').toString(UTF8)

  watch(
    hash,
    (n) => {
      try {
        if (!n) return
        const descrytedText = descryted(n.substring(1))
        const result = JSON.parse(descrytedText)

        state.tables = result.tables
        state.schemaView = result.schemaView
        supabaseClientState.apikey = result.apikey

        router.push('/')
      } catch (err) {
        console.log(err)
      }
    },
    { immediate: true }
  )
</script>
