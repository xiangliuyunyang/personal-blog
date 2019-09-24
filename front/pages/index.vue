<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">front</h1>
      <h2 class="subtitle">personal blog front</h2>
      <div class="links">
        <a href="https://nuxtjs.org/" target="_blank" class="button--green">Documentation</a>
        <a href="https://github.com/nuxt/nuxt.js" target="_blank" class="button--grey">GitHub</a>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  async created () {
    let ret = await this.$axios.get('/api/user')
    console.log(ret.data)
  }
}
</script>

<style>
</style>
