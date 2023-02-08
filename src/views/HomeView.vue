<template>
    <section id="home" class="flex items-center justify-center min-h-screen pt-20 relative">
    <div class="max-w-[700px] bg-slate-800 rounded-lg drop-shadow-lg border border-spacing-1 border-slate-700 p-4 lg:p-8 mx-4">
      <div class="flex flex-col mt-6 gap-6 items-center justify-center text-3xl sm:text-4xl md:text-5xl font-nice text-white text-center">
        <div>Summon the Soul of Legendary Hero</div>
      </div>
      <div class="text-xl sm:text-2xl md:text-3xl font-nice text-white">
        <div class="my-6">
              <div v-for="trait in traits" :key="trait[0]" class="flex gap-4 justify-between items-center px-2 rounded font-mono hover:bg-slate-700 transition-all">
                <div class="uppercase flex-grow">{{ trait[0] }}</div>
                <button @click="updateTrait(trait[0], -1)" class="p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                    <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clip-rule="evenodd" />
                    </svg>
                </button>
                <div class="text-center w-8">{{ trait[1] }}</div>
                <button @click="updateTrait(trait[0], 1)" class="p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                    <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
                    </svg>
                </button>
                <div class="relative cursor-pointer">
                    <div class="flex rounded-full w-5 h-5 bg-slate-600 text-lg items-center justify-center text-slate-800 text-center">?</div>
                </div>
            </div>
            <hr class="my-2">
            <div class="flex gap-4 justify-between items-center px-2 font-mono">
                <div class="flex-grow text-right">Unused: </div>
                <div class="w-24 text-center">{{ freePoints }} / 35</div>
                <button @click="randomize" class="p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                    <path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
        <div class="text-center tracking-wide text-xl text-slate-400 mb-6">
          Summoned: {{ minted }}, Current price: {{ Math.round(priceView) }} canto
        </div>
        <div class="text-center mt-4">
          <button @click="mint()" class="bg-blue-400 px-6 py-2.5 text-2xl hover:bg-blue-500 rounded-lg drop-shadow-lg border-4 border-l-blue-300 border-t-blue-300 border-r-blue-500 border-b-blue-500">
            <span class="drop-shadow-sm font-digits font-bold tracking-widest">
              SUMMON
            </span>
          </button>
        </div>
      </div>
      <div class="w-full flex justify-center gap-8 mt-10 text-white drop-shadow">
          <a href="https://twitter.com/CantoZoo" target="_blank" rel="noopener nofollow"><twitter-icon class="w-8 h-8 cursor-pointer" /></a>
          <!-- <a href="https://discord.gg/zzz" target="_blank" rel="noopener nofollow"><discord-icon class="w-8 h-8 cursor-pointer" /></a> -->
        </div>
      <div v-if="minting" class="flex justify-center items-center absolute inset-0 bg-black bg-opacity-50">
        <div class="rounded-lg bg-white drop-shadow-lg p-8 text-center">
          Waiting for blockchain confirmation...
        </div>
      </div>
    </div>
    </section>
</template>

<script>
// import FAQ from '@/components/FAQ.vue'
import TwitterIcon from '@/components/TwitterIcon.vue'
import { mapGetters, mapState } from 'vuex'
import config from '../config'
// import AboutIt from '@/components/AboutIt.vue'

const MAX_CUMULATIVE_POINTS = 35
const MIN_TRAIT_POINTS = 2
const MAX_TRAIT_POINTS = 10

export default {
  components: { TwitterIcon },
  name: 'HomeView',
  data() {
    return {
      stats: {
        agi: 5,
        cha: 5,
        con: 5,
        dex: 5,
        int: 5,
        str: 5,
        wis: 5
      }
    };
  },
  computed: {
    ...mapState(['minted', 'loading', 'ready', 'minting', 'paused']),
    ...mapGetters(['priceView']),
    traits () {
        return Object.entries(this.stats)
    },
    freePoints () {
        return MAX_CUMULATIVE_POINTS - Object.values(this.stats).reduce((acc, it) => acc + it, 0)
    },
    contractLink () {
        return `${config.mainnet.explorer}/address/${config.mainnet.contract}`
    },
    contract () {
        const contract = config.mainnet.contract
        return `${contract.slice(0, 4)}...${contract.slice(-4)}`
    }
  },
  mounted() {
    this.randomize()
  },
  methods: {
    async mint () {
      await this.$store.dispatch('summon', this.stats)
    },
    updateTrait(trait, delta) {
        const stats = this.stats
        const points = Object.values(stats).reduce((acc, it) => acc + it, 0) + delta
        if (points < MIN_TRAIT_POINTS * 7 || points > MAX_CUMULATIVE_POINTS) return
        const value = stats[trait] + delta
        if (value < MIN_TRAIT_POINTS || value > MAX_TRAIT_POINTS) return
        stats[trait] = value
    },
    // randomize traits
    randomize () {
      const points = new Array(
        MIN_TRAIT_POINTS,
        MIN_TRAIT_POINTS,
        MIN_TRAIT_POINTS,
        MIN_TRAIT_POINTS,
        MIN_TRAIT_POINTS,
        MIN_TRAIT_POINTS,
        MIN_TRAIT_POINTS
      );
      let distribute = MAX_CUMULATIVE_POINTS - 7 * MIN_TRAIT_POINTS
      while (distribute > 0) {
        const i = Math.floor(Math.random() * 7)
        if (points[i] < MAX_TRAIT_POINTS) {
            points[i]++
            distribute--
        }
      }
      const stats = this.stats
      stats.agi = points[0]
      stats.cha = points[1]
      stats.con = points[2]
      stats.dex = points[3]
      stats.int = points[4]
      stats.str = points[5]
      stats.wis = points[6]
      console.log(stats)
    }
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
