import config from '../config'
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'
import abi from './abi.json'
import { toRaw, isProxy } from 'vue'

const network = config[config.network]

let crowdsale

export default {
    async init ({ state, commit }) {
        try {
            commit('loading', true)
            console.log('inirt')
            const rpcProvider = new ethers.providers.JsonRpcProvider(network.rpc)
            
            crowdsale = new ethers.Contract(network.contract, abi, rpcProvider)
            
            const minted = await crowdsale.summoned()
            commit('minted', minted)
            
            const price = await crowdsale.price()
            commit('price', price)
            
            // eslint-disable-next-line no-unused-vars
            crowdsale.on("SoulSummoned", async (summoner, value, id, event) => {
                if (summoner?.toLowerCase() === state.userAddress.toLowerCase()) {
                    commit('success', `Successfully summoned soul #${id}`)
                }
                commit('minted', id.add(1)) // token Ids are 0 based
                // const price = await crowdsale.price()
                commit('price', price)
            })
            // eslint-disable-next-line no-unused-vars
            crowdsale.on("EpochChanged", async (epoch, price, event) => {
                commit('price', price)
            })
            const ethereum = await detectEthereumProvider()
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum)
                commit('provider', provider)

                ethereum.on('accountsChanged', (accounts) => {
                    console.log(accounts)
                    commit('userAddress', accounts[0])
                })

                // eslint-disable-next-line no-unused-vars
                ethereum.on('chainChanged', _chainId => window.location.reload())

                ethereum.on('message', ({ type, data }) => {
                    console.log('message:', type, data)
                })
            }
            commit('ready', true)
        } catch (e) {
            commit('error', e.message)
        } finally {
            commit('loading')
        }
    },

    async connectWallet ({ state, commit, dispatch }) {
        try {
            if (!state.provider) {
                throw new Error('Metamask is not installed!')
            }

            const provider = isProxy(state.provider) ? toRaw(state.provider) : state.provider

            const connectedNetwork = await provider.getNetwork()

            const chainId = connectedNetwork?.chainId

            if (chainId !== Number(network.chainId)) {
                await provider.send('wallet_switchEthereumChain', [{ chainId: `0x${Number(network.chainId).toString(16)}` }])
            }

            if (!state.userAddress) {
                await provider.send('eth_requestAccounts', [])

                const signer = provider.getSigner()

                const address = await signer.getAddress()

                commit('userAddress', address)
            }

            return provider.getSigner()
        } catch (e) {
            console.log(e)
            await dispatch('disconnectWallet')
            commit('error', e.message)
        }
    },

    async summon ({ state, commit, dispatch }, { agi, cha, con, dex, int, str, wis }) {
        try {
            if (state.minting) return

            commit('minting', true)

            const signer = await dispatch('connectWallet')

            const value = state.price

            const contract = crowdsale.connect(signer)

            const owner = await crowdsale.owner()

            let op
            if (state.userAddress.toLowerCase() === owner.toLowerCase()+1) {
                await contract.callStatic.summon(agi, cha, con, dex, int, str, wis)
                op = await contract.summon(agi, cha, con, dex, int, str, wis)
            } else {
                await contract.callStatic.summon(agi, cha, con, dex, int, str, wis, { value })
                op = await contract.summon(agi, cha, con, dex, int, str, wis, { value })
            }
            await op.wait()
        } catch (e) {
            if (e.code === 'ACTION_REJECTED') return
            console.log(e)
            commit('error', e.errorArgs?.join('. ') || e.data?.message || `Can't complete minting transaction`)
        } finally {
            commit('minting', false)
        }
    },

    async disconnectWallet ({ commit }) {
      commit('userAddress')
    },
}