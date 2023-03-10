import { proposalServices } from '../services'
import { closeModal } from '../slices/ModalSlice'
import { updateProposal } from '../slices/ProposalSlice'
import { updateWallet } from '../slices/WalletSlice'
import { updateWalletThunk } from './WalletAction'
import { StatusCodes } from 'http-status-codes'
import { toast } from 'react-toastify'
import { strToEth } from '../utils'
import { updateLoading } from '../slices/LoaderSlice'

export const createID = (type, dataObj) => async (dispatch, getState) => {
    try {
        dispatch(closeModal())
        dispatch(updateLoading(true))
        const { contractWallet } = getState().Web3Reducer
        const { user } = getState().UserReducer
        const { wallet } = getState().WalletReducer

        let transaction
        let proposalObj = {
            walletId: wallet._id,
            type,
            votes: [{
                voter: user.address,
                vote: true
            }]
        }

        if (type === 'transaction') {
            const { to, amount } = dataObj
            transaction = await contractWallet.createTrans(to, strToEth(amount.toString()))
            proposalObj = { ...proposalObj, to, amount: Number(amount) }
        } else {
            const { addOwners, delOwners, approvalsRequired } = dataObj
            transaction = await contractWallet.createCons(addOwners, delOwners, approvalsRequired)
            proposalObj = { ...proposalObj, addOwners, delOwners, approvalsRequired: Number(approvalsRequired) }
        }

        const receipt = await transaction.wait()
        const { id, creator } = receipt.events[0].args
        proposalObj = { ...proposalObj, contractId: Number(id), creator }

        const { data, status } = await proposalServices.createProposal(proposalObj)
        if (status === StatusCodes.CREATED) {
            dispatch(getAllIDOfWallet(wallet._id))
            dispatch(updateWallet(data.data.walletUpdate))
            dispatch(updateLoading(false))
            toast.success(`😁 A new ID create successfully 😁`)
        } else {
            console.log(data)
        }
    } catch (err) {
        console.log(err)
        dispatch(updateLoading(false))
        toast.error(`😭 Something wrong when create ID 😭`)
    }
}

export const voteID = (proposal, vote) => async (dispatch, getState) => {
    try {
        dispatch(updateLoading(true))
        const { contractWallet } = getState().Web3Reducer
        const { user } = getState().UserReducer

        const transaction = await contractWallet.vote(proposal.contractId, vote)
        const receipt = await transaction.wait()

        const voteObj = {
            voteResult: {
                voter: user.address,
                vote
            }
        }
        if (receipt.events.length > 1) {
            const { event, args } = receipt.events[1]
            voteObj.state = args.success ? 'success' : 'fail'
            dispatch(updateWalletThunk(event, args))
        }

        const { status } = await proposalServices.updateProposal(proposal._id, voteObj)
        if (status === StatusCodes.OK) {
            dispatch(getAllIDOfWallet(proposal.walletId))
            dispatch(updateLoading(false))
            toast.success(`😁 Vote to ID ${proposal.contractId} successfully 😁`)
        } else {
            console.log(status)
        }
    } catch (error) {
        console.log(error)
        dispatch(updateLoading(false))
        toast.error(`😭 Something wrong when vote ID 😭`)
    }
}

export const getAllIDOfWallet = (walletID) => async (dispatch) => {
    try {
        const { data, status } = await proposalServices.getAllProposalOfWallet(walletID)
        if (status === StatusCodes.OK) {
            dispatch(updateProposal(data.data))
        }
    } catch (error) {
        console.log(err)
    }
}

export const resetIdInfo = () => async (dispatch) => {
    try {
        dispatch(updateProposal([]))
    } catch (error) {
        console.log(error)
    }
}