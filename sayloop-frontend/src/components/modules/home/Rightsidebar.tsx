import React from 'react'
import { UserButton } from '@clerk/clerk-react'
import { chest, heart, lingobird, lock, points, start, usaflag } from '../../../assets/RightsidebarAssets'

type Props = {}

const RightSidebar = (props: Props) => {
  return (
    <aside className="w-80 mr-35 bg-[#0A0E13] text-white p-4 overflow-y-auto">
      
      {/* Stats Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <img src={start} alt="streak" className="w-6 h-6" />
            <span className="text-orange-500 font-bold">0</span>
          </span>
          <span className="flex items-center gap-1">
            <img src={points} alt="gems" className="w-6 h-6" />
            <span className="text-blue-400 font-bold">565</span>
          </span>
          <span className="flex items-center gap-1">
            <img src={heart} alt="hearts" className="w-6 h-6" />
            <span className="text-red-500 font-bold">5</span>
          </span>
          <span className="flex items-center gap-1">
            <UserButton afterSignOutUrl="/" />
          </span>
        </div>
      </div>

      {/* Super Duolingo Card */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-4 mb-6 relative overflow-hidden">
        <div className="absolute top-2 left-2">
          <span className="bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded">SUPER</span>
        </div>
        <div className="absolute right-0 top-0">
          <img src={lingobird} alt="Duo" className="w-20 h-20" />
        </div>
        <div className="mt-8">
          <h3 className="text-white font-bold text-lg mb-2">Try Super for free</h3>
          <p className="text-white text-xs mb-4 opacity-90">
            No ads, personalized practice, and unlimited Legendary!
          </p>
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition">
            TRY 1 WEEK FREE
          </button>
        </div>
      </div>

      {/* Unlock Leaderboards */}
      <div className="border border-[#37464F] rounded-2xl p-4 mb-6">
        <h3 className="text-white font-bold mb-3">Unlock Leaderboards!</h3>
        <div className="flex items-center gap-3">
          <div className="bg-[#1C2A35] rounded-xl p-3">
            <img src={lock} alt="shield" className="w-8 h-8" />
          </div>
          <p className="text-gray-300 text-sm">
            Complete <span className="font-bold text-white">9 more lessons</span> to start competing
          </p>
        </div>
      </div>

      {/* Daily Quests */}
      <div className="border border-[#37464F] rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold">Daily Quests</h3>
          <button className="text-blue-400 text-sm font-bold hover:text-blue-300">
            VIEW ALL
          </button>
        </div>
        
        <div className="flex items-center justify-between border border-[#37464F] rounded-xl p-3">
          <div className="flex items-center gap-3">
            <img src={points} alt="XP" className="w-8 h-8" />
            <span className="text-white font-bold">Earn 10 XP</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">0 / 10</span>
            <img src={chest} alt="reward" className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Language Tags */}
      <div className="border border-[#37464F] rounded-2xl p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <span className="bg-white text-gray-800 text-xs font-bold px-3 py-2 rounded-full border-2 border-gray-300">
            Discover more
          </span>
          <span className="bg-white text-gray-800 text-xs font-bold px-3 py-2 rounded-full border-2 border-blue-500 flex items-center gap-1">
            <img src={usaflag} alt="flag" className="w-4 h-4" />
            duolingo abc
          </span>
          <span className="bg-white text-gray-800 text-xs font-bold px-3 py-2 rounded-full border-2 border-gray-300">
            🎵 Duolingo
          </span>
          <span className="bg-white text-gray-800 text-xs font-bold px-3 py-2 rounded-full border-2 border-gray-300">
            📖 Learn to Read - Duolingo ABC
          </span>
          <span className="bg-white text-gray-800 text-xs font-bold px-3 py-2 rounded-full border-2 border-gray-300">
            🦉 duolingo
          </span>
        </div>
      </div>

      

      {/* Footer Links */}
      <div className="border-t border-gray-700 pt-4">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-400">
          <a href="#" className="hover:text-gray-300">ABOUT</a>
          <a href="#" className="hover:text-gray-300">BLOG</a>
          <a href="#" className="hover:text-gray-300">STORE</a>
          <a href="#" className="hover:text-gray-300">EFFICACY</a>
          <a href="#" className="hover:text-gray-300">CAREERS</a>
          <a href="#" className="hover:text-gray-300">INVESTORS</a>
          <a href="#" className="hover:text-gray-300">TERMS</a>
          <a href="#" className="hover:text-gray-300">PRIVACY</a>
        </div>
      </div>

    </aside>
  )
}

export default RightSidebar