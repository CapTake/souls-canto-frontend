<template>
    <section id="home" :class="{crt: clicks > 10}" class="punk flex items-center text-canto justify-center min-h-screen pt-20 relative w-full">
    <div class="max-w-xl w-full bg-black rounded-md drop-shadow-lg border border-spacing-1 border-canto p-4 lg:p-8 mx-4 md:relative overflow-hidden">
      <h1 class="text-4xl text-center opacity-80">
        <canto-icon class="inline-block w-8 h-8 -mt-1 mr-2"/>
        HERO SOULS
      </h1>
      <div class="text-xl sm:text-2xl md:text-3xl">
        <div class="my-4">
              <p class="text-sm sm:text-lg md:text-xl text-center opacity-40 p-2">Fine tune the 7 core traits of your hero:</p>
              <div v-for="trait in traits" :key="trait[0]" class="flex gap-4 justify-between items-center px-2 rounded-sm font-mono hover:bg-green-900 hover:bg-opacity-40 transition-all">
                <div class="uppercase flex-grow">{{ trait[0] }}</div>
                <button @click="updateTrait(trait[0], -1)" class="p-2" :class="{'opacity-20 cursor-not-allowed' : trait[1] < 3 }">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                    <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clip-rule="evenodd" />
                    </svg>
                </button>
                <div class="text-center w-8">{{ trait[1] }}</div>
                <button @click="updateTrait(trait[0], 1)" class="p-2" :class="{'opacity-20 cursor-not-allowed' : trait[1] > 9 || freePoints === 0}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                    <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
                    </svg>
                </button>
                <button @mouseover="showTip(trait[0])" @mouseleave="hideTip" class="flex rounded-full w-5 h-5 bg-canto opacity-20 text-lg items-center justify-center text-black text-center">
                    ?
                </button>
            </div>
            <hr class="my-2 border-canto opacity-30">
            <div class="flex gap-4 justify-between items-center px-2 text-2xl">
                <div class="flex-grow text-right opacity-30">Unassigned: </div>
                <div class="w-32 text-center font-mono" :class="{'opacity-100': freePoints > 0, 'opacity-30': freePoints === 0}">{{ freePoints }} / 35</div>
                <button @click="randomize" class="hover:opacity-100 opacity-50">
                    <dice-icon class="w-10 h-10"/>
                </button>
            </div>
        </div>
        <div class="text-center tracking-wide text-xl opacity-30 mb-4 mt-8">
          Summoned: {{ minted }}, Current price: {{ Math.round(priceView) }} canto
        </div>
        <div class="text-center mb-6">
          <button @click="mint()" class="bg-canto px-6 py-2.5 text-2xl hover:bg-black text-black hover:text-canto rounded drop-shadow-lg border-2 border-canto">
            <span class="drop-shadow-sm font-mono font-bold tracking-widest">
              SUMMON
            </span>
          </button>
        </div>
      </div>
      <!-- <div class="w-full flex justify-center gap-8 mt-10 text-white drop-shadow">
          <a href="https://twitter.com/Hero_Souls_Tech" target="_blank" rel="noopener nofollow"><twitter-icon class="w-8 h-8 cursor-pointer" /></a>
      </div> -->
      <div v-if="minting" class="flex justify-center items-center absolute inset-0 bg-black bg-opacity-50">
        <div class="rounded-lg bg-white drop-shadow-lg p-8 text-center">
          Waiting for blockchain confirmation...
        </div>
      </div>
      <transition>
        <div v-if="tip" v-html="tip" class="fixed bottom-0 left-0 right-0 md:left-4 text-sm md:right-4 md:max-w-full max-h-80 overflow-y-auto bg-canto text-black px-4 py-4 rounded-t shadow-lg md:absolute">
        </div>
      </transition>
    </div>
    </section>
    <section id="about" :class="{crt: clicks > 10}" class="punk flex items-center text-canto justify-center min-h-screen pt-20 relative w-full">
        <div class="max-w-xl w-full bg-black rounded-md drop-shadow-lg border border-spacing-1 border-canto p-4 lg:p-8 mx-4 md:relative overflow-hidden">
            <h2 class="text-center mb-6 text-xl">About</h2>
            <p class="pb-4">
            </p>
        </div>
    </section>
</template>

<script>
// import FAQ from '@/components/FAQ.vue'
import DiceIcon from '@/components/DiceIcon.vue'
import { mapGetters, mapState } from 'vuex'
import config from '../config'
import CantoIcon from '@/components/CantoIcon.vue'
// import AboutIt from '@/components/AboutIt.vue'

const MAX_CUMULATIVE_POINTS = 35
const MIN_TRAIT_POINTS = 2
const MAX_TRAIT_POINTS = 10

export default {
  components: { DiceIcon, CantoIcon },
  name: 'HomeView',
  data() {
    return {
      clicks: 0,
      stats: {
        agi: 5,
        cha: 5,
        con: 5,
        dex: 5,
        int: 5,
        str: 5,
        wis: 5
      },
      tip: '',
      tips: {
        agi: `<b>Agility</b> represents your character’s swiftness, manoeuvrability, and general fitness. An agile character
naturally lends themselves to speed, be it in terms of running or reaction time.
Agility is a core component in most physical skills; so whether your character is a professional
boxer, an athlete, a bouncer, or a courier; Agility is the trait for you.`,
        cha: `<b>Charisma</b> is your people skill. It represents your character’s general ability to interact with, affect,
and manipulate people. A highly charismatic character can talk their way into or out of almost
any situation, and as such Charisma is a core component in most of the social skills.
Whether your character is a sleazy con-artist, a performer, or a suave secret agent, Charisma
is likely an important trait for you to consider.`,
        con: `<b>Constitution</b> determines your character’s health, their stamina, and their willpower, in other words:
your character’s general stubbornness. Constitution is the core trait in everything to do with
physical and mental health, and has a key role in a number of skills related to yours and other
people’s survival.
If your character is a medic, a ranger, or needs to tank a lot of hits, then Constitution is a good
priority choice.`,
        dex: `<b>Dexterity</b> — or more accurately: <i>manual dexterity</i> — governs your character’s fine motor skills and
ability to skilfully use their hands and fingers. Intricate jobs like lock-picking, surgery, and watch-
making all lend themselves nicely to a dexterous character, but coarser jobs that also require the
use of your hands, like marksmanship and sailing also fall in this category.`,
        int: `<b>Intelligence</b> represents mental capacity, logical reasoning, and general academic prowess. A highly
intelligent character will have no trouble navigating academic resources and doing research; for
this reason, most mental skills rely on Intelligence to some degree.
Good for characters who want to think their way out of and around problems. Scholars, mages,
and tacticians all benefit from a high Intelligence.`,
        str: `<b>Strength</b> represents the raw physical strength of your character. Bulky and buff characters will
naturally be strong, and are good for hitting hard and pulling the weight; this trait is key in some
physical skills.
Bouncers, brutes, weight lifters, naturally benefit from a high Strength.`,
        wis: `<b>Wisdom</b> is your character’s situational awareness, intuition, and general gut-feel. For this reason,
Wisdom applies to a wide variety of situations, as situational awareness and a good intuition will
often be enough to get you through a lot of situations.`
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
      try {
        await this.$store.dispatch('summon', this.stats)
        this.randomize()
      } catch (e) {
        console.log(e.message)
      }
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
      this.clicks++
    },
    showTip (trait) {
        this.tip = this.tips[trait]
    },
    hideTip () {
        this.tip = ''
    }
  },
};
</script>
<style>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  transform: translate(0, 100%);
  transition: all 0.5s ease;
}
.punk {
  backdrop-filter:saturate(200%) sepia(100%) hue-rotate(80deg) brightness(60%);
  x-webkit-filter: saturate(200%) sepia(100%) hue-rotate(80deg);
  x-filter: saturate(200%) sepia(100%) hue-rotate(80deg);
}
/* CRT effects */
@keyframes flicker {
  0% {
    opacity: 0.27861;
  }
  5% {
    opacity: 0.34769;
  }
  10% {
    opacity: 0.23604;
  }
  15% {
    opacity: 0.90626;
  }
  20% {
    opacity: 0.18128;
  }
  25% {
    opacity: 0.83891;
  }
  30% {
    opacity: 0.65583;
  }
  35% {
    opacity: 0.67807;
  }
  40% {
    opacity: 0.26559;
  }
  45% {
    opacity: 0.84693;
  }
  50% {
    opacity: 0.96019;
  }
  55% {
    opacity: 0.08594;
  }
  60% {
    opacity: 0.20313;
  }
  65% {
    opacity: 0.71988;
  }
  70% {
    opacity: 0.53455;
  }
  75% {
    opacity: 0.37288;
  }
  80% {
    opacity: 0.71428;
  }
  85% {
    opacity: 0.70419;
  }
  90% {
    opacity: 0.7003;
  }
  95% {
    opacity: 0.36108;
  }
  100% {
    opacity: 0.24387;
  }
}

@keyframes textShadow {
  0% {
    text-shadow: 0.4389924193300864px 0 1px rgba(0,30,255,0.5), -0.4389924193300864px 0 1px rgba(255,0,80,0.3), 0 0 3px;
  }
  5% {
    text-shadow: 2.7928974010788217px 0 1px rgba(0,30,255,0.5), -2.7928974010788217px 0 1px rgba(255,0,80,0.3), 0 0 3px;
  }
  10% {
    text-shadow: 0.02956275843481219px 0 1px rgba(0,30,255,0.5), -0.02956275843481219px 0 1px rgba(255,0,80,0.3), 0 0 3px;
  }
  15% {
    text-shadow: 0.40218538552878136px 0 1px rgba(0,30,255,0.5), -0.40218538552878136px 0 1px rgba(255,0,80,0.3), 0 0 3px;
  }
  20% {
    text-shadow: 3.4794037899852017px 0 1px rgba(0,30,255,0.5), -3.4794037899852017px 0 1px rgba(255,0,80,0.3), 0 0 3px;
  }
  25% {
    text-shadow: 1.6125630401149584px 0 1px rgba(0,30,255,0.5), -1.6125630401149584px 0 1px rgba(255,0,80,0.3), 0 0 3px;
  }
  30% {
    text-shadow: 0.7015590085143956px 0 1px rgba(0,30,255,0.5), -0.7015590085143956px 0 1px rgba(255,0,80,0.3), 0 0 3px;
  }
  35% {
    text-shadow: 3.896914047650351px 0 1px rgba(0,30,255,0.5), -3.896914047650351px 0 1px rgba(255,0,80,0.3), 0 0 3px;
  }
  40% {
    text-shadow: 3.870905614848819px 0 1px rgba(0,30,255,0.5), -3.870905614848819px 0 1px rgba(255,0,80,0.3), 0 0 3px;
  }
  45% {
    text-shadow: 2.231056963361899px 0 1px rgba(0,30,255,0.5), -2.231056963361899px 0 1px rgba(255,0,80,0.3), 0 0 3px;
  }
  50% {
    text-shadow: 0.08084290417898504px 0 1px rgba(0,30,255,0.5), -0.08084290417898504px 0 1px rgba(255,0,80,0.3), 0 0 3px;
  }
  55% {
    text-shadow: 2.3758461067427543px 0 1px rgba(0,30,255,0.5), -2.3758461067427543px 0 1px rgba(255,0,80,0.3), 0 0 3px;
  }
  60% {
    text-shadow: 2.202193051050636px 0 1px rgba(0,30,255,0.5), -2.202193051050636px 0 1px rgba(255,0,80,0.3), 0 0 3px;
  }
  65% {
    text-shadow: 2.8638780614874975px 0 1px rgba(0,30,255,0.5), -2.8638780614874975px 0 1px rgba(255,0,80,0.3), 0 0 3px;
  }
  70% {
    text-shadow: 0.48874025155497314px 0 1px rgba(0,30,255,0.5), -0.48874025155497314px 0 1px rgba(255,0,80,0.3), 0 0 3px;
  }
  75% {
    text-shadow: 1.8948491305757957px 0 1px rgba(0,30,255,0.5), -1.8948491305757957px 0 1px rgba(255,0,80,0.3), 0 0 3px;
  }
  80% {
    text-shadow: 0.0833037308038857px 0 1px rgba(0,30,255,0.5), -0.0833037308038857px 0 1px rgba(255,0,80,0.3), 0 0 3px;
  }
  85% {
    text-shadow: 0.09769827255241735px 0 1px rgba(0,30,255,0.5), -0.09769827255241735px 0 1px rgba(255,0,80,0.3), 0 0 3px;
  }
  90% {
    text-shadow: 3.443339761481782px 0 1px rgba(0,30,255,0.5), -3.443339761481782px 0 1px rgba(255,0,80,0.3), 0 0 3px;
  }
  95% {
    text-shadow: 2.1841838852799786px 0 1px rgba(0,30,255,0.5), -2.1841838852799786px 0 1px rgba(255,0,80,0.3), 0 0 3px;
  }
  100% {
    text-shadow: 2.6208764473832513px 0 1px rgba(0,30,255,0.5), -2.6208764473832513px 0 1px rgba(255,0,80,0.3), 0 0 3px;
  }
}
.crt::after {
  content: " ";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(18, 16, 16, 0.1);
  opacity: 0;
  z-index: 2;
  pointer-events: none;
  animation: flicker 0.15s infinite;
}
.crt::before {
  content: " ";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
  z-index: 2;
  background-size: 100% 2px, 3px 100%;
  pointer-events: none;
}
.crt {
  animation: textShadow 1.6s infinite;
}
</style>
