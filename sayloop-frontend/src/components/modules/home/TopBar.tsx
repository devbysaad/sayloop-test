import React from 'react'
import { UserButton } from '@clerk/clerk-react'
import { heart, points, start, usaflag } from '../../../assets/RightsidebarAssets'

type Props = {}

const TopBar = (props: Props) => {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#1F2937] px-4 py-3 flex items-center justify-between z-50 border-b border-gray-700">
      {/* Left Side - Language Flag */}
      <div className="flex items-center gap-2">
        <img src={usaflag} alt="Language" className="w-8 h-8 rounded-md border-2 border-gray-600" />
      </div>

      {/* Right Side - Stats */}
      <div className="flex items-center gap-4">
        {/* Streak */}
        <div className="flex items-center gap-1.5 bg-gray-800 px-2.5 py-1.5 rounded-lg">
          <img src={start} alt="streak" className="w-5 h-5" />
          <span className="text-orange-400 font-bold text-sm">0</span>
        </div>

        {/* Gems/Points */}
        <div className="flex items-center gap-1.5 bg-gray-800 px-2.5 py-1.5 rounded-lg">
          <img src={points} alt="gems" className="w-5 h-5" />
          <span className="text-blue-400 font-bold text-sm">500</span>
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1.5 bg-gray-800 px-2.5 py-1.5 rounded-lg">
          <img src={heart} alt="hearts" className="w-5 h-5" />
          <span className="text-red-400 font-bold text-sm">5</span>
        </div>
      </div>
    </div>
  )
}

export default TopBar