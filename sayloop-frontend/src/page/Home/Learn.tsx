import React from 'react'
import Sidebar from '../../components/home/Sidebar'
import RightSidebar from '../../components/home/Rightsidebar'

type Props = {}

const HomePage = (props: Props) => {
  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Left Sidebar */}
      <Sidebar />
      
      {/* Main Content Area - Centered */}
      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-4xl px-8 py-8">
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-[#58CC02] rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-bold mb-2">← SECTION 1, UNIT 1</p>
                <h1 className="text-white text-2xl font-bold">Solo trip: Compare travel experiences</h1>
              </div>
              <button className="bg-white text-[#58CC02] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition flex items-center gap-2">
                <span>≡</span>
                GUIDEBOOK
              </button>
            </div>
          </div>

          {/* Learning Path Section */}
          <div className="flex flex-col items-center space-y-6 py-8">
            
            {/* Start Button - Green Circle */}
            <div className="relative">
              <div className="w-24 h-24 bg-[#58CC02] rounded-full flex items-center justify-center shadow-lg border-4 border-[#46A302]">
                <div className="text-white text-center">
                  <div className="text-3xl">✓</div>
                  <div className="text-xs font-bold mt-1">START</div>
                </div>
              </div>
            </div>

            {/* Star Button */}
            <div className="relative">
              <div className="w-20 h-20 bg-[#58CC02] rounded-full flex items-center justify-center shadow-lg border-4 border-[#2D5016]">
                <div className="text-white text-3xl">⭐</div>
              </div>
            </div>

            {/* Treasure Chest - Locked */}
            <div className="w-32 h-24 bg-[#3C5A6E] rounded-2xl flex items-center justify-center shadow-lg border-4 border-[#2D4556]">
              <div className="text-4xl">📦</div>
            </div>

            {/* Duo Character Circle */}
            <div className="relative">
              <div className="w-32 h-32 bg-[#46A302] rounded-full flex items-center justify-center shadow-lg border-4 border-[#2D5016]">
                <div className="text-6xl">🦉</div>
              </div>
            </div>

            {/* Progress Circle - Locked */}
            <div className="w-20 h-20 bg-[#3C5A6E] rounded-full flex items-center justify-center shadow-lg border-4 border-[#2D4556]">
              <div className="text-white text-2xl">🧩</div>
            </div>

            {/* Trophy Circle - Locked */}
            <div className="w-20 h-20 bg-[#3C5A6E] rounded-full flex items-center justify-center shadow-lg border-4 border-[#2D4556]">
              <div className="text-white text-2xl">🏆</div>
            </div>

          </div>

          {/* Bottom Section Title */}
          <div className="text-center mt-12 py-8 border-t border-gray-600">
            <p className="text-gray-400 text-sm">Solo trip: Ask about transportation</p>
          </div>

        </div>
      </main>
      
      {/* Right Sidebar */}
      <RightSidebar />
      
    </div>
  )
}

export default HomePage