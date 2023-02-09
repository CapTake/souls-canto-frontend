import { createStore } from 'vuex'
import state from './state'
import actions from './actions'
import { useToast } from "vue-toastification"
import { ethers } from 'ethers'

const toast = useToast()

export default createStore({
    actions,
    getters: {
        shortWallet: (state) => `${state.userAddress.slice(0,4)}...${state.userAddress.slice(-4)}`,
        priceView: (state) => ethers.utils.formatUnits(state.price, 18)
    },
    mutations: {
        error: (state, value) => value && toast.error(value),
        success: (state, value) => value && toast.success(value),
        userAddress: (state, value) => state.userAddress = value || '',
        price: (state, value) => state.price = value || '0',
        minted: (state, value) => state.minted = value?.toString ? value.toString() : (value || '0'),
        minting: (state, value) => state.minting = !!value,
        loading: (state, value) => state.loading = !!value,
        ready: (state, value) => state.ready = !!value,
        paused: (state, value) => state.paused = !!value,
        provider: (state, value) => state.provider = value || null,
        signer: (state, value) => state.signer = value || null
    },
    modules: {
    },
    state
})
