<template>
    <div>
        <div v-for="(item, i) in qa" @click="toggle(i)" :key="i" class="py-2">
            <h3 class="cursor-pointer hover:pl-4 transition-all font-bold">{{ item[0] }}</h3>
            <div v-if="open === i" v-html="item[1]" class="pt-3 pb-4 opacity-50 text-sm md:text-base">
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      open: -1,
      qa: [
        [
        'What is the Hero Souls Protocol?', 
        'The Hero Souls Protocol is a set of smart contracts on the Canto blockchain that allow users to create and manage unique NFTs called Souls.',
        ],
        [
          'What is a Soul NFT?', 
          ' A: A Soul NFT is an NFT that stores a set of core traits – Agility, Charisma, Constitution, Dexterity, Intelligence, Strength, and Wisdom – that can be used as the starting point for a game character.'
        ],
        [
            'How are Souls created?',
            'Initially, there will be a limited genesis mint of 2500 Souls. The price of each Soul during the genesis mint will have a bonding curve, with the price increasing by 2 Canto for every 100 Souls minted.',
        ],
        [
            'Where are Souls stored?',
            'Souls are stored completely on-chain, ensuring their immutability and providing a secure and transparent way to manage your valuable NFTs.'
        ],
        [
            'What happens to a Soul in a game?',
            `Developers of blockchain games can interact with the Hero Souls Protocol smart contracts and allow Souls to descend or incarnate in real game characters.
            The traits of the Soul will be mapped to the corresponding character traits in the game.`
        ],
        [
            'Can a Soul change?',
            'No, a Soul is immutable. However, the in-game incarnation of a Soul can evolve and upgrade according to the rules of the game.'
        ],
        [ 
            'Why should I use the Hero Souls Protocol?',
            `With the Hero Souls Protocol, you can create a truly unique and personalized Soul that can be used as the starting point for your game character.
             You also have the ability to evolve and upgrade your in-game character based on your own gameplay choices.
             From a developer perspective, you can create blockchain games and integrate souls in them.`
        ]
      ]
    }
  },
  methods: {
    toggle (n) {
        this.open = this.open === n ? -1 : n
    }
  }
}
</script>