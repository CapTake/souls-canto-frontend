<template>
<div>
<nav class="flex p-4 backdrop-blur-md rounded-lg gap-4 justify-between items-center tracking-widest max-w-sm mx-auto font-digits font-bold text-white md:text-xl text-lg flex-grow">
        <a href="/#home" class="hover:underline drop-shadow-md">Home</a>
        <a href="/#about" class="hover:underline drop-shadow-md">About</a>
        <sync-button class="rounded py-2 px-4 text-lg tracking-wide text-black bg-canto drop-shadow-md transition-all hover:bg-black hover:text-canto" />
        <!-- <button @click="menuOpen = !menuOpen" class="lg:hidden cursor-pointer text-white">
        <menu-icon class="w-9 h-9" />
    </button>
    <div class="flex">
        <a href="https://twitter.com/Celestial_X_?t=lur-lSuXuvMl2gVeDP4xKQ&s=09" target="_blank" rel="noopener nofollow"><twitter-icon class="w-8 h-8 cursor-pointer" /></a>
        <a href="https://discord.gg/2CPeSRqKvG" target="_blank" rel="noopener nofollow"><discord-icon class="w-8 h-8 cursor-pointer" /></a>
    </div>
    <div v-if="menuOpen" class="flex flex-col gap-4 text-4xl font-digits text-white font-semibold tracking-wide justify-between items-center inset-0 z-10 fixed bg-opacity-90 bg-black lg:hidden">
        <div class="w-full p-4 text-right">
            <button @click="menuOpen = false" class="cursor-pointer inline-block">
                <close-icon class="w-10 h-10"/>
            </button>
        </div>
        <router-link @click="menuOpen = false" to="/" exact exact-active-class="underline" class="hover:underline">Home</router-link>
        <router-link @click="menuOpen = false" to="/faq" exact exact-active-class="underline" class="hover:underline">FAQ</router-link>
        <router-link @click="menuOpen = false" to="/about" exact exact-active-class="underline" class="hover:underline">About</router-link>
        <div class="pb-8"></div>
    </div> -->
</nav>
</div>
</template>

<script>
// import TwitterIcon from './TwitterIcon.vue';
// import DiscordIcon from './DiscordIcon.vue';
// import MenuIcon from './MenuIcon.vue';
// import CloseIcon from './CloseIcon.vue';
import SyncButton from './SyncButton.vue';
export default {
  components: { SyncButton },
  data () {
    return {
      menuOpen: false
    }
  }
}
</script>

<style>

</style>