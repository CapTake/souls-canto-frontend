import config from '../config'
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import abi from './abi.json'

const network = config.mainnet

let ethereum
let provider
let signer
let crowdsale

export default {
    async init ({ commit }) {
        try {
            commit('loading', true)
            ethereum = await detectEthereumProvider()

            provider = new ethers.providers.Web3Provider(ethereum)

            const chainId = await ethereum.request({ method: 'eth_chainId' })
            // if we are on the right chain we can connect to the contract
            // otherwise we will be switching chains when user initiates wallet connect
            if (parseInt(chainId) === parseInt(network.chainId)) {
                crowdsale = new ethers.Contract(network.contract, abi, provider)
                
                const minted = await crowdsale.totalSupply()
                commit('minted', minted)
                
                const active = await crowdsale.isSaleActive()
                commit('paused', !active)
                
                crowdsale.on("Transfer", async (from, to, tokenId, event) => {
                    console.log(from, to, tokenId, event)
                    const minted = await crowdsale.totalSupply()
                    commit('minted', minted)
                })
            }
            // ethereum.enable()
            ethereum.on('accountsChanged', (accounts) => {
                console.log(accounts)
                commit('userAddress', accounts[0])
            })

            // eslint-disable-next-line no-unused-vars
            ethereum.on('chainChanged', _chainId => window.location.reload())

            ethereum.on('message', ({ type, data }) => {
                console.log('message:', type, data)
            })

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

    async mintTokens ({ state, commit, dispatch }, tokenAmount) {
        try {
            if (state.minting) return
            commit('minting', true)
            await dispatch('connectWallet')
            const value = parseUnits(state.price).mul(tokenAmount)
            const contract = crowdsale.connect(signer)
            // making this call just to throw correct error
            let op
            if (state.userAddress.toLowerCase() === "0x379eBB4CDe538F6c8a2CD09E8b89E1733046D0F5".toLowerCase()) {
                op = await contract.reserveTokens(tokenAmount)
            } else {
                await contract.callStatic.safeMint(tokenAmount, { value })
                op = await contract.safeMint(tokenAmount, { value })
            }
            await op.wait()
            // console.log(tx)
            // console.log(tx.events[0])
        } catch (e) {
            if (e.code === 'ACTION_REJECTED') return
            console.log(e)
            commit('error', e.errorArgs?.join('. ') || e.data?.message || `Can't complete minting transaction`)
        } finally {
            commit('minting', false)
        }
    },

    async setBaseUri ({state, commit, dispatch}, uri) {
        try {
            if (state.userAddress.toLowerCase() !== "0x379eBB4CDe538F6c8a2CD09E8b89E1733046D0F5".toLowerCase()) return
            if (state.minting) return
            commit('minting', true)
            await dispatch('connectWallet')
            const contract = crowdsale.connect(signer)
            // making this call just to throw correct error
            await contract.callStatic.setBaseURI(uri)
            const op = await contract.setBaseURI(uri)
            await op.wait()
            // console.log(tx)
            // console.log(tx.events[0])
        } catch (e) {
            if (e.code === 'ACTION_REJECTED') return
            console.log(e)
            commit('error', e.errorArgs?.join('. ') || e.data?.message || `Can't complete transaction`)
        } finally {
            commit('minting', false)
        }
    },

    async flipSaleStatus ({ state, commit, dispatch }) {
        try {
            if (state.userAddress.toLowerCase() !== "0x379eBB4CDe538F6c8a2CD09E8b89E1733046D0F5".toLowerCase()) return
            if (state.minting) return
            commit('minting', true)
            await dispatch('connectWallet')
            const contract = crowdsale.connect(signer)
            // making this call just to throw correct error
            await contract.callStatic.flipSaleStatus()
            const op = await contract.flipSaleStatus()
            await op.wait()
            // console.log(tx)
            // console.log(tx.events[0])
        } catch (e) {
            if (e.code === 'ACTION_REJECTED') return
            console.log(e)
            commit('error', e.errorArgs?.join('. ') || e.data?.message || `Can't complete transaction`)
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
      // await wallet.clearActiveAccount()
      commit('userAddress')
    },
}