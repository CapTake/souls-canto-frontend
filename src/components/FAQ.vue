<template>
    <div>
        <div v-for="(item, i) in qa" @click="toggle(i)" :key="i" class="py-2">
            <h3 class="cursor-pointer hover:pl-4 transition-all font-bold">{{ item[0] }}</h3>
            <div v-if="open === i" v-html="item[1]" class="pt-3 pb-4 text-slate-500 text-sm md:text-base">
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
            'What is Canto Zoo?',
            `It's a place filled with different magical animals made in the form of programmatically, randomly generated, dynamic and upgradable NFTs living on the Canto blockchain.`
        ],
        [
            'How many animals?',
            '1100'
        ],

        [ 'How many is the team taking?', '30'],

        ['How many animals can I mint?','5 per mint'],
        ['How much does each animal cost?','69 CANTO'],
        ['What does each animal do?',`Some animals have power ups and special abilities!
        `],
        [
            'Why is this collection special? ',
            `Holding these NFTs will give you an edge over the subsequent drops.<br>
            Affordable and fair mint -->  everyone can participate
            `
        ],
        [
            'Do you have roadmap?',
            'Yes, build fun games with zoo animals.'
        ],
        [
            'Do you have plans to create a DAO?',
            'Yes, the DAO will be created after our first game release.'
        ],
        [

            'Where can I see my animal?',
            'You can check the mint transaction of your mint inside your wallet, go to block explorer of canto and check the token id in your wallet.',
        ],
        [
            'Is this just another NFT?',
            'This is the first Canto NFT with upgrades and games as utility.'
        ],
        [
            'Where can I trade my NFT?',
            '<a href="https://alto.build" target="_blank" rel="noopener nofollow" class="text-blue-500">https://alto.build</a>'
        ],
        [
            'How can i get Canto to mint my Canto Zoo animals?',
            `step 1: get some eth in your metamask wallet <br>
            step 2: bridge the assets from Eth to Canto &ndash; <a href="https://docs.canto.io/user-guides/bridging-assets/ethereum" target="_blank" class="text-blue-500" rel="noopener nofollow">READ</a><br>
            step 3: convert the assets from Canto to Cantoevm &ndash; <a href="https://docs.canto.io/user-guides/converting-assets" target="_blank" class="text-blue-500" rel="noopener nofollow">READ</a><br>
            Step 4: be quick. use the mint button to mint!<br><br>
            Alternatively you can get Canto directly from an exchange:<br>
            step 1: go to <a href="https://www.mexc.com" class="text-blue-500" target="_blank" rel="noopener nofollow">www.mexc.com</a><br>
            step 2: purchase some CANTO<br>
            step 3: withdraw Canto to your Cantoevm wallet (same as your Eth wallet address)<br>
            step 4: be quick. use the mint button to mint!`
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