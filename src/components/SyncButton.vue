<template>
    <div v-if="userAddress">
        <button  @click="unsync">{{ shortWallet }}</button> 
    </div>
    <button v-else @click="sync">
        Connect
    </button>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapState(['userAddress']),
    ...mapGetters(['shortWallet'])
  },
  async created () {
    await this.$store.dispatch('init')
  },
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
