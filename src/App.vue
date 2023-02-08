<template>
  <top-bar class="fixed w-full z-10" />
  <home-view />
</template>

<script>
import TopBar from './components/TopBar.vue'
import HomeView from './views/HomeView.vue'

export default {
    components: { TopBar, HomeView },
    async mounted () {
        await this.$store.dispatch('init')
    }
}
</script>
