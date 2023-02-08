import { createStore } from 'vuex'
import state from './state'
import actions from './actions'
import { useToast } from "vue-toastification";

const toast = useToast()

export default createStore({
    actions,
    getters: {
        shortWallet: (state) => `${state.userAddress.slice(0,5)}...${state.userAddress.slice(-5)}`,
        // soldOut: ({ minted, supply }) => minted && (supply === minted)
    },
    mutations: {
        error: (state, value) => {
            value && toast.error(value)
        },
        userAddress: (state, value) => state.userAddress = value || '',
        price: (state, value) => state.price = value || '0',
        minted: (state, value) => state.minted = value || 0,
        minting: (state, value) => state.minting = !!value,
        loading: (state, value) => state.loading = !!value,
        ready: (state, value) => state.ready = !!value,
        paused: (state, value) => state.paused = !!value,
    },
    modules: {
    },
    state
})
