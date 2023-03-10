import React, { useState } from 'react'
import { minifyAddress } from '@/helpers'
import { useDispatch, useSelector } from 'react-redux'
import { getWalletDetail } from '@/redux/thunk/WalletAction'
const WalletDropdown = () => {
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.UserReducer)
    const { wallet } = useSelector(state => state.WalletReducer)
    const [inputValue, setInputValue] = useState("")
    const [open, setOpen] = useState(false)
    const handleChange = (address) => {
        dispatch(getWalletDetail('address', address))
        setOpen(false);
    }
    return (
        <div className=' w-60 font-medium relative text-black'>
            <div className="inline-flex items-center divide-x rounded bg-violet-700 divide-gray-900">
                <button type="button" className="px-5 font-bold text-white">{wallet?.address ? minifyAddress(wallet.address, 5) : 'No Wallet'}</button>
                <button type="button" className="p-3" onClick={() => setOpen(!open)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
            <ul className={`bg-white mt-2 overflow-y-auto overflow-x-hidden absolute z-50 ${open ? 'max-h-60' : 'max-h-0'} w-[80%] scrollbar`}>
                <div className='flex items-center px-2 sticky top-0 bg-white'>
                    <i className="fa-solid fa-magnifying-glass text-black"></i>
                    <input
                        type='text'
                        placeholder='Enter wallet address'
                        className='placeholder:text-gray-500 p-2 bg-white border-b-2 outline-none w-full'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value.toLowerCase())}
                    />
                </div>
                {user?.wallets?.map((address, index) => {
                    return (
                        <li className={`p-2 text-sm hover:bg-violet-400 hover:text-white cursor-pointer 
                        ${address.toLowerCase().startsWith(inputValue) ? 'block' : 'hidden'}`}
                            key={index}
                            onClick={() => handleChange(address)}>
                            {minifyAddress(address, 5)}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default WalletDropdown