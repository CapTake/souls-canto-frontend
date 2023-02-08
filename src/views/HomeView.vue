<template>
  <div>
    <section
      id="home"
      class="min-h-screen pt-20 relative bg-gradient-to-b from-blue-100 to-blue-300"
    >
      <h1
        class="logo-h1 font-nice drop-shadow-lg text-center bg-clip-text text-transparent bg-gradient-to-b from-pink-500 to-violet-500 py-6 mx-auto"
      >
        Canto<br />
        <span class="text-8xl">ZOO</span>
      </h1>
      <div class="flex justify-center gap-4 mx-auto mt-4 max-w-xl">
        <div @click="randomPic(0)" class="flex-1 cursor-pointer rounded-lg drop-shadow-md -rotate-12 p-2 translate-x-6 bg-white hover:scale-105 hover:drop-shadow-lg transition-all">
          <img :src="`/img/${selected[0]}.png`" class="rounded-sm" />
        </div>
        <div @click="randomPic(1)" class="flex-1 cursor-pointer rounded-lg drop-shadow-md -translate-y-7 p-2 bg-white hover:scale-105 hover:drop-shadow-lg transition-all">
          <img :src="`/img/${selected[1]}.png`" class="rounded-sm" />
        </div>
        <div @click="randomPic(2)" class="flex-1 cursor-pointer rounded-lg drop-shadow-md p-2 rotate-12 -translate-x-6 bg-white hover:scale-105 hover:drop-shadow-lg transition-all">
          <img :src="`/img/${selected[2]}.png`" class="rounded-sm" />
        </div>
      </div>
      <div v-if="paused" class="flex flex-col mt-10 gap-6 items-center justify-center text-3xl sm:text-4xl md:text-5xl font-nice text-white text-center">
        <div>Minting Starts Soon</div>
        <p class="font-digits text-base">Follow us to get updates.</p>
        <div @click="flipSaleStatus" class="floating">👇</div>
      </div>
      <div v-else class="text-3xl sm:text-4xl md:text-5xl font-nice text-white">
        <div class="text-center tracking-wide drop-shadow-sm">
          {{ minted.toString() }} / {{ supply }}
        </div>
        <div class="flex gap-6 justify-center items-center mt-4">
          <button @click="mintAmount(-1)" class="w-16 h-16 rounded-full bg-green-400 hover:bg-green-500 drop-shadow-lg border-2 border-green-300">
            -
          </button>
          <div class="p-3">{{ amount }}</div>
          <button @click="mintAmount(1)" class="w-16 h-16 rounded-full bg-green-400 hover:bg-green-500 drop-shadow-lg border-2 border-green-300">
            +
          </button>
        </div>
        <div class="text-center mt-4">
          <button @click="mint(1)" class="floating bg-yellow-400 px-6 py-2.5 text-2xl hover:bg-yellow-500 rounded-lg drop-shadow-lg border-4 border-l-yellow-300 border-t-yellow-300 border-r-yellow-500 border-b-yellow-500">
            <span class="drop-shadow-sm font-digits font-bold tracking-widest">
              MINT
            </span>
          </button>
        </div>
      </div>
      <div class="w-full flex justify-center gap-8 p-10 text-white drop-shadow">
          <a href="https://twitter.com/CantoZoo" target="_blank" rel="noopener nofollow"><twitter-icon class="w-8 h-8 cursor-pointer" /></a>
          <a href="https://discord.gg/ppz3wSupem" target="_blank" rel="noopener nofollow"><discord-icon class="w-8 h-8 cursor-pointer" /></a>
        </div>
      <div v-if="minting" class="flex justify-center items-center absolute inset-0 bg-black bg-opacity-50">
        <div class="rounded-lg bg-white drop-shadow-lg p-8 text-center">
          Minting...
        </div>
      </div>
    </section>
    <section id="faq" class="flex items-center justify-center min-h-screen pt-[60px] pb-6 font-digits relative overflow-hidden" >
        <div class="top-0 absolute scrolling-up w-full" style="background: url('/img/brickbg.png'); height: 200%; background-size: auto 50vh;">
        </div>
      <div class="rounded-lg bg-white drop-shadow-lg sm:w-[550px] max-w-full p-4 mx-4">
        <h1 class="text-center text-xl mb-4 tracking-wide">FAQ</h1>
        <p>Hello Cantonian, Welcome to the Canto Zoo!</p>
        <FAQ />
        <p>Mint contract: <a :href="contractLink" class="hover:text-blue-800 transition-all" target="_blank" rel="noopener nofollow">{{ contract }}</a></p>
        <p class="break-all">Provenance: 9920e57f96a9ba0ec06718a50814f134e5546ec15a88188dd8f097c3cdcfb8bf</p>
      </div>
    </section>
    <section id="about" class="min-h-screen flex items-center pt-[60px] pb-6 font-digits justify-center relative overflow-hidden">
     <div class="inset-0 absolute scaling" style="background: url('/img/patternbg.png');">
    </div>
    <div class="rounded-lg bg-white drop-shadow-lg sm:w-[550px] max-w-full p-4 mx-4">
        <h1 class="text-center text-xl mb-4 tracking-wide">About</h1>
        <about-it />
    </div>
    </section>
  </div>
</template>

<script>
import FAQ from "@/components/FAQ.vue"
import TwitterIcon from "@/components/TwitterIcon.vue"
import DiscordIcon from '@/components/DiscordIcon.vue'
import { mapState } from "vuex"
import config from "../config"
import AboutIt from '@/components/AboutIt.vue'

export default {
  components: { TwitterIcon, DiscordIcon, FAQ, AboutIt },
  name: "HomeView",
  data() {
    return {
      selected: [1, 3, 5],
      amount: 1,
      clicks: 0
    };
  },
  computed: {
    ...mapState(["minted", "supply", "loading", "ready", "minting", "paused"]),
    contractLink () {
        return `${config.mainnet.explorer}/address/${config.mainnet.contract}`
    },
    contract () {
        const contract = config.mainnet.contract
        return `${contract.slice(0,6)}...${contract.slice(-6)}`
    }
  },
  mounted() {
    this.randomPic(0)
    this.randomPic(1)
    this.randomPic(2)
    this.clicks = 0
  },
  methods: {
    async mint () {
      await this.$store.dispatch("mintTokens", this.amount)
    },
    async flipSaleStatus () {
      //await this.$store.dispatch('setBaseUri', 'ipfs://bafybeib4nu7hvqosqpepw7kuaxw4b2efamafyzcphvlthog7bbhu32rh5m/') // 
      await this.$store.dispatch('flipSaleStatus')
    },
    //we have 12 pics to choose from
    randomPic (n) {
      const selected = this.selected
      let i = selected[n]
      while (selected.includes(i)) {
        i = Math.floor(Math.random() * 12) + 1
      }
      this.selected[n] = i
      this.clicks++
      if (this.clicks > 15) {
        this.selected[0] = 'hidden'
        this.selected[1] = 'hidden'
        this.selected[2] = 'hidden'
      }
      if (this.clicks > 25) {
        this.selected[0] = 'hidden'
        this.selected[1] = i
        this.selected[2] = 'hidden'
      }
      if (this.clicks > 33) {
        this.selected[n] = i
      }
    },
    mintAmount(n) {
      this.amount = Math.max(Math.min(this.amount + n, 5), 1);
    },
  },
};
</script>
<style>
#faq p, #about p {
  margin: 1rem 0;
}
.logo-h1 {
  font-size: calc(44px + 2.8vw);
}
.logo-h1 span {
  font-size: calc(90px + 3.3vw);
  line-height: 0.8;
}
.minted {
  text-shadow: 0px 0px 2px #00000066, 1px 1px 0px #00000066,
    -0px -0px 0px #00000066, 1px 1px 1px rgba(0, 0, 0, 0.55);
}
.floating {
  animation-name: floating;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}
.scaling {
  animation-name: scaler;
  animation-duration: 5s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}
.scrolling-up {
  animation-name: up;
  animation-duration: 15s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
@keyframes floating {
  0% {
    transform: translate(0, 0px);
  }
  50% {
    transform: translate(0, 8px);
  }
  100% {
    transform: translate(0, -0px);
  }
}
@keyframes scaler {
  0% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1.05, 1.05);
  }
  100% {
    transform: scale(1, 1);
  }
}
@keyframes up {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}
</style>
