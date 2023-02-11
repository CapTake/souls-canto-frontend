<template>
    <div v-if="userAddress">
        <button  @click="unsync">
        <canto-icon class="inline-block w-7 h-7 -ml-2 mr-2 text-base" /> {{ shortWallet }}
        </button> 
    </div>
    <button v-else @click="sync" class="text-black bg-canto drop-shadow-md transition-all hover:bg-black hover:text-canto">
        <canto-icon class="inline-block w-7 h-7 -ml-2 mr-2" /> Connect
    </button>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import CantoIcon from './CantoIcon.vue'

export default {
  computed: {
    ...mapState(['userAddress']),
    ...mapGetters(['shortWallet'])
  },
  components: { CantoIcon },
  methods: {
    async sync () {
      await this.$store.dispatch('connectWallet')
    },
    async unsync () {
      await this.$store.dispatch('disconnectWallet')
    }
  }
}
</script>
