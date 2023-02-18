import { userServices } from '../services/UserServices'
import { getDataUser } from '../slices/UserSlice'
import { StatusCodes } from 'http-status-codes'

export const createUser = (address) => async (dispatch) => {
    try {
        const { data, status } = await userServices.login({ address })
        if (status <= StatusCodes.CREATED) {
            dispatch(getDataUser(data.data))
        } else {
            console.log(status)
        }
    } catch (err) {
        console.log(err)
    }
}