import React from 'react'
import { useSelector } from 'react-redux'
import { PieChartStats, BarChartStats } from './index'

const COLORS = ['#00C851', '#FF4444', '#FFBB33'];
const ChartStats = () => {
    const { wallet } = useSelector(state => state.WalletReducer)
    const { userStats } = useSelector(state => state.UserReducer)
    const dataState = [
        { name: 'SUCCESS', value: wallet?.successId },
        { name: 'FAIL', value: wallet?.failedId },
        { name: 'PENDING', value: wallet?.pendingId },
    ]
    const dataType = [
        { name: 'TRANSACTION', value: wallet?.transactionId },
        { name: 'CONSENSUS', value: wallet?.consensusId }
    ]
    return (
        <div className='w-3/4 h-3/4'>
            <div className='w-full h-full flex justify-between'>
                <div className='p-4 w-[550px] h-[350px] flex flex-col border border-black dark:border-white rounded-lg justify-center items-center'>
                    <div className='w-full h-4/5'>
                        <PieChartStats data={dataState} colors={COLORS} />
                    </div>
                    <h1 className='text-2xl font-bold tracking-wide text-violet-500'>ID STATE RATE</h1>
                </div>
                <div className='p-4 w-[550px] h-[350px] flex flex-col border border-black dark:border-white rounded-lg justify-center items-center'>
                    <div className='w-full h-4/5'>
                        <PieChartStats data={dataType} colors={COLORS} />
                    </div>
                    <h1 className='text-2xl font-bold tracking-wide text-violet-500'>ID TYPE RATE</h1>
                </div>
            </div>
            <div className='w-full h-[500px] mt-20 mb-5'>
                <BarChartStats data={userStats} />
            </div>
            <h1 className='text-3xl font-bold tracking-wide text-violet-500 text-center mb-5'>OWNER VOTE STATS</h1>
        </div>
    )
}

export default ChartStats