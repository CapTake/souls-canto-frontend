import config from '../config'
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import abi from './abi.json'

const network = config.testnet

let ethereum
let provider
let rpcProvider
let signer
let crowdsale

export default {
    async init ({ state, commit }) {
        try {
            commit('loading', true)
            
            rpcProvider = new ethers.providers.JsonRpcProvider(network.rpc)
            
            crowdsale = new ethers.Contract(network.contract, abi, rpcProvider)
            
            const minted = await crowdsale.summoned()
            commit('minted', minted)
            
            const price = await crowdsale.price()
            commit('price', price)

            // eslint-disable-next-line no-unused-vars
            crowdsale.on("SoulSummoned", async (summoner, value, id, event) => {
                commit('minted', id.add(1)) // token Ids are 0 based
                if (summoner?.toLowerCase() === state.userAddress.toLowerCase()) {
                    commit('success', `Successfully summoned soul #${id}`)
                }
                const price = await crowdsale.price()
                commit('price', price)
            })

            ethereum = await detectEthereumProvider()
            if (ethereum) {
                provider = new ethers.providers.Web3Provider(ethereum)

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

    async switchNetwork (_, target) {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${Number(target).toString(16)}` }],
        })
        // window.location.reload()
    },

    async connectWallet ({ state, commit, dispatch }) {
        try {
            if (!provider) {
                throw new Error('Metamask is not installed!')
            }
            const chainId = await ethereum.request({ method: 'eth_chainId' })

            if (parseInt(chainId) !== parseInt(network.chainId)) {
                await dispatch('switchNetwork', network.chainId)
            }

            if (state.userAddress) return

            await provider.send('eth_requestAccounts', [])

            console.log(await provider.listAccounts())

            signer = provider.getSigner()

            const address = await signer.getAddress()

            commit('userAddress', address)
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
            await dispatch('connectWallet')
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

    async setPrice ({ state, commit, dispatch }, price) {
        try {
            if (state.minting) return
            commit('minting', true)
            await dispatch('connectWallet')
            const value = parseUnits(price)
            console.log(value.toString())
            const contract = crowdsale.connect(signer)
            // making this call just to throw correct error
            await contract.callStatic.setPrice(value)
            const op = await contract.setPrice(value)
            await op.wait()
            // console.log(tx)
            // console.log(tx.events[0])
        } catch (e) {
            console.log(e)
            commit('error', e.errorArgs?.join('. ') || e.data?.message || `Can't complete transaction`)
        } finally {
            commit('minting', false)
        }
    },

    async disconnectWallet ({ commit }) {
      commit('userAddress')
    },
}